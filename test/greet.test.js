const assert = require('assert');

const GreetFactory = require('../namesGreeted');

// initialise the database connection
const pgPromise = require('pg-promise')({})
const db = pgPromise({
 connectionString:process.env.DATABASE_URL || 'postgres://postgres:2007121214@localhost:5432/greetings_test', 
  ssl: {
    rejectUnauthorized: true
  }
})


describe("Testing database logic", function(){

    beforeEach(async function(){
        await db.none('delete from users')
    });

    it('should be able to add users to users table', async function(){
        const nameGreeted = GreetFactory(db);

        await nameGreeted.setName("Mbali");

        assert.equal(1, await nameGreeted.nameCount());
    });

    it('should be able to get list of greeted names', async function(){
        const nameGreeted = GreetFactory(db);

        await nameGreeted.setName("Mbali");
        await nameGreeted.setName("Xola");

        let nameList = await nameGreeted.namesList();
        assert.equal(2, nameList.length);
    });

    it('should be able to get count of all none repeating names', async function(){
        const nameGreeted = GreetFactory(db);

        await nameGreeted.setName("Mbali");
        await nameGreeted.setName("Xola");
        await nameGreeted.setName("Mbali");
        await nameGreeted.setName("Xola");

        assert.equal(2, await nameGreeted.nameCount());
    });

    it('should be to get counter of selected name', async function(){
        const nameGreeted = GreetFactory(db);

        await nameGreeted.setName("mbali");
        await nameGreeted.setName("mbali");
        await nameGreeted.setName("xola");

        assert.equal(2, await nameGreeted.greetCount("mbali"));
        assert.equal(1, await nameGreeted.greetCount("xola"));
    });
});
