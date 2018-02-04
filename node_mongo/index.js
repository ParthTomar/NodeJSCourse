const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';
const dboper = require('./operations');

MongoClient.connect(url, (err, db) => {
    assert.equal(err, null);

    console.log('Connected correctly to the mongodb server');

    dboper.insertDocument(db, { "name": "parth", "description": "Testing mongoDb insert operation" }, "dishes", (result) => {
        console.log("Insert document :\n", result.ops);

        dboper.findDocuments(db, "dishes", (docs) => {
            console.log("Found documents :\n", docs);

            dboper.updateDocument(db, { "name": "parth" }, { "description": "Confirming update oper" }, "dishes", (result) => {
                console.log("Updated document :\n", result.result);

                dboper.findDocuments(db, "dishes", (docs) => {
                    console.log("Found documents :\n", docs);

                    db.dropCollection("dishes", (result) => {
                        console.log("Dropped collection :\n", result);
                    });
                });
            });
        });
    });

});