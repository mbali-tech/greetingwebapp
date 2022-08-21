const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')

const app = express()

// initialise the database connection
const pgPromise = require('pg-promise')({})
const db = pgPromise({
 connectionString:process.env.DATABASE_URL || 'postgres://postgres:2007121214@localhost:5432/greetings', 
  //ssl: {
  //  rejectUnauthorized: false
  //}
})

const GreetFactory = require('./namesGreeted')
const LanguageFactory = require('./languagePicker')

const namesGreeted = GreetFactory(db)
const languagePicker = LanguageFactory()

// initialise session middleware - flash-express depends on it
app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}))

// initialise the flash middleware
app.use(flash())

//set up middleware
app.engine('handlebars', exphbs({layoutsDir: "views/layouts/"}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//gets values for counter value and greeting text
app.get('/', async (req, res) => {
  let counter = await namesGreeted.nameCount()
  res.render('index', {
      name: namesGreeted.getName().charAt(0).toUpperCase()+namesGreeted.getName().slice(1, namesGreeted.getName().length),
      greetText: languagePicker.getGreetText(),
      counter: counter,
      message: req.flash('warning')
  })
})

//sets values for name, language uses and stores name of greeted person in database
app.post("/name", async(req, res) => {
  if(!req.body.language && req.body.name == ""){
      req.flash('warning', 'Please enter name and language')
  }else if(req.body.name == ""){
      req.flash('warning', 'Please enter name')
  }else if(!/^[A-Za-z]+$/.test(req.body.name)){
      req.flash('warning', 'Please enter valid name')
  }else if(!req.body.language){
      req.flash('warning', 'Please choose language')
  }else {
      await namesGreeted.setName(req.body.name)
      languagePicker.setLanguage(req.body.language)
      languagePicker.setGreetText()
  }
  res.redirect("/")
})

//empties database and resets counter
app.post("/counter", async(req, res) => {
  await namesGreeted.removeNames()
  req.flash('warning', 'Counter Cleared')
  res.redirect("/")
})

app.post("/greeted", async (req, res) => {
  let names = await namesGreeted.namesList()
  res.render('greeted',{
    uniqueNames: names
  })
})

app.get("/greeted/:name", async(req, res) => {
  let counter = await namesGreeted.greetCount( req.params.name,)
  res.render("counter", {
    nameGreeted: req.params.name,
    counter: counter
  })
})

const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log("App is running at port " + PORT)
})