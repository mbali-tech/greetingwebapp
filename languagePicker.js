module.exports = () => {
    let greetText
    let language

    const setLanguage = (lang) => {
        language = lang
    }

    const getLanguage = () => {
        return language
    }

    const setGreetText = () => {
        if(getLanguage() == 'IsiZulu') {
            greetText = 'Sawubona '
        }

        if(getLanguage() == 'IsiXhosa') {
            greetText = 'Molo '
        }

        if(getLanguage() == 'English') {
            greetText = 'Hello '
        }
    }

    const getGreetText = () => {
        return greetText
    }


    return {
        setLanguage,
        getLanguage,
        setGreetText,
        getGreetText,
    }
}