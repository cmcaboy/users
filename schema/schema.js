const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString, // GraphQL's string type
  GraphQLInt, // GraphQL's int type
  GraphQLSchema,
} = graphql;

const users = [
  {id: '23', firstName: 'Bill', age: 20 },
  {id: '47', firstName: 'Samantha', age: 21 },
]

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString}, // GraphQL's string type
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt} // GraphQL's int type
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // parentValue is not typically used. We care more about args
      // The resolve function is meant to fetch data from our datastore.
      resolve(parentValue, args) {
        // lodash loops through the list of users
        return _.find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});



