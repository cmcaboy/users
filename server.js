const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql:true
}));
// graphiql is a development variable that is only used in development environments.


app.listen(4000,() => {
  console.log('Listening');
});