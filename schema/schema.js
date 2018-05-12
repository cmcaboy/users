const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString, // GraphQL's string type
  GraphQLInt, // GraphQL's int type
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      // We need to use a GraphQLList because we will return a list
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        console.log('parent: ',parentValue);
        console.log('args: ',args);
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLString}, // GraphQL's string type
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}, // GraphQL's int type
    company: {
      // in order to link company here, we will use the resolve function
      type: CompanyType,
      resolve(parentValue, args) {
        // The parentValue has the companyId on it. We can link the company based
        // on this.
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
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
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        // The GraphQLNonNull wrapper makes the value required for the mutation
        firstName: {type: new GraphQLNonNull(GraphQLString) },
        age: {type: new GraphQLNonNull(GraphQLInt) },
        companyId: {type: GraphQLString }
      },
      resolve(parentValue, {firstName, age}) {
        // This post request will return with the record that was just
        // updated.
        return axios.post(`http://localhost:3000/users`, {firstName,age})
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        // The GraphQLNonNull wrapper makes the value required for the mutation
        id: {type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, {id}) {
        // This post request will return with the record that was just
        // updated.
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        // The GraphQLNonNull wrapper makes the value required for the mutation
        id: {type: new GraphQLNonNull(GraphQLString) },
        firstName: {type: GraphQLString },
        age: {type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // This post request will return with the record that was just
        // updated.
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});



