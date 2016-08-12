const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const { graphql } = require('graphql');
const { introspectionQuery } = require('graphql/utilities');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();
app.use(express.static('public'));

const mySchema = require('./schema/main');
const MONGO_URL = 'mongodb://localhost:27017/test';

MongoClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    context: { db },
    graphiql: true
  }));

  graphql(mySchema, introspectionQuery)
    .then(result => {
      fs.writeFileSync(
        path.join(__dirname, 'cache/schema.json'),
        JSON.stringify(result, null, 2)
      );
      console.log('Generated cached schema.json file');
    })
    .catch(console.error);

  app.listen(3000, () =>
    console.log('Running Express.js on port 3000')
  );
});
