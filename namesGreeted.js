module.exports = (db) => {
    let username = ""

    const setName = async (name) => {
        username = name.toLowerCase().trim()
        let counter =  db.manyOrNone("select count(*) from users where name=$1", [username])
        if (counter == null){
            await db.none("insert into users(name,counter) values($1,1)", [username])
        }
        else {
            await db.none("update users set counter = counter + 1 where name=$1", [username])
        }
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

    const greetCount = async (username) => {
        let user = await db.one("select * from users where name=$1", [username])
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