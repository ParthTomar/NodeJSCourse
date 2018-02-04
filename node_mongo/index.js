const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';
const dboper = require('./operations');

MongoClient.connect(url).then((db) => {
    
    console.log('Connected correctly to the mongodb server');

    dboper.insertDocument(db, { "name": "parth", "description": "Testing mongoDb insert operation" }, "dishes")
    .then((result) => {
        console.log("Insert document :\n", result.ops);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs)=>{
        console.log("Found documents :\n", docs);

        return dboper.updateDocument(db, { "name": "parth" }, { "description": "Confirming update oper" }, "dishes");
    })
    .then((result) => {
        console.log("Updated document :\n", result.result);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log("Found documents :\n", docs);

        return db.dropCollection("dishes");
    })
    .then((result) => {
        console.log("Dropped collection :", result);

       return db.close();
    })
    .catch((err)=>console.log(err));

}, (err)=>console.log(err))
.catch((err)=>console.log(err));