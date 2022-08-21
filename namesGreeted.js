module.exports = (db) => {
    let username = ""

    const setName = async (name) => {
        username = name.toLowerCase().trim()
        db.query("insert into users(name) values($1)", [username])
    }

    const getName = () => {
        return username
    }

    const namesList = async () => {
        let list = await db.query("select distinct name from users")
        return list
    }

    const nameCount = async () => {
        let names = await db.query("select count( distinct name ) from users")
        return names[0].count
    }

    const greetCount = async (user) => {
        let counter = await db.query("select count(*) from users where name=$1", [user])
        return counter[0].count
    }

    const removeNames = () => {
        db.query("delete from users")
    }

    return {
        setName,
        getName,
        namesList,
        nameCount,
        greetCount,
        removeNames
    }
}