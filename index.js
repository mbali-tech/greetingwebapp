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
  ssl: {
    rejectUnauthorized: false
  }
})

const GreetFactory = require('./namesGreeted')
const LanguageFactory = require('./languagePicker')
const Routes = require('./routes')

const namesGreeted = GreetFactory(db)
const languagePicker = LanguageFactory()
const routes = Routes(namesGreeted, languagePicker)

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
app.get('/', routes.home)

//sets values for name, language uses and stores name of greeted person in database
app.post("/name", routes.greet)

//empties database and resets counter
app.post("/counter", routes.clear)

app.get("/greeted", routes.greeted)

app.get("/greeted/:name", routes.greetedUser)

const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log("App is running at port " + PORT)
})