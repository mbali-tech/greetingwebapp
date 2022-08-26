module.exports = (namesGreeted, languagePicker) => {

    const home = async (req, res) => {
        let counter = await namesGreeted.nameCount()
        res.render('index', {
            name: namesGreeted.getName().charAt(0).toUpperCase()+namesGreeted.getName().slice(1, namesGreeted.getName().length),
            greetText: languagePicker.getGreetText(),
            counter: counter,
            message: req.flash('warning')
        })
    }

    const greet = async (req, res) => {
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
    }

    const clear = async (req, res) => {
        await namesGreeted.removeNames()
        req.flash('warning', 'Counter Cleared')
        res.redirect("/")
    }

    const greeted = async (req, res) => {
        let names = await namesGreeted.namesList()
        res.render('greeted',{
          uniqueNames: names
        })
    }

    const greetedUser = async (req, res) => {
        let counter = await namesGreeted.greetCount( req.params.name,)
        res.render("counter", {
          nameGreeted: req.params.name,
          counter: counter
        })
    }

    return {
        home,
        greet,
        clear,
        greeted,
        greetedUser
    }
}