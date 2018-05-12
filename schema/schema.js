const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString, // GraphQL's string type
  GraphQLInt, // GraphQL's int type
  GraphQLSchema,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString}
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString}, // GraphQL's string type
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}, // GraphQL's int type
    company: {
      // in order to link company here, we will use the resolve function
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue, args);
      }
    }
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
        //return _.find(users, { id: args.id });
        console.log('args.id: ',args.id);
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
        // when axios's promise resolves, we get back a structure like:
        // {data: {...}} It uses the data property.
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});



