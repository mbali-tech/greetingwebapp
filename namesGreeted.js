module.exports = (db) => {
    let username = ""

    const setName = async (name) => {
        username = name.toLowerCase().trim()
        await db.none("insert into users(name) values($1)", [username])
    }

    const getName = () => {
        return username
    }

    const namesList = async () => {
        let list = await db.manyOrNone("select distinct name from users")
        return list
    }

    const nameCount = async () => {
        let names = await db.one("select count(*) from users")
        return names.count
    }

    const greetCount = async (user) => {
        let user = await db.one("select * from users where name=$1", [user])
        return user.counter
    }

    const removeNames = async () => {
        await db.none("delete from users")
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