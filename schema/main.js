const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLEnumType
} = require('graphql');

const fs = require('fs');

const readLastLinePromise = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) throw reject(err);
      resolve(data.toString().trim().split('\n').slice(-1)[0]);
    });
  });
};

const roll = () => Math.floor(6 * Math.random()) + 1;

const toTitleCase = str => {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const exampleEmployee = {
  firstName: 'jane',
  lastName: 'doe'
};

const LetterCaseType = new GraphQLEnumType({
  name: 'LetterCase',
  values: {
    TITLE: { value: 'title' },
    UPPER: { value: 'upper' },
    LOWER: { value: 'lower' }
  }
});

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    name: {
      type: GraphQLString,
      args: {
        upperCase: { type: GraphQLBoolean }
      },
      resolve: (obj, args) => {
        let fullName = `${obj.firstName} ${obj.lastName}`;
        return args.upperCase ?
           fullName.toUpperCase() : fullName;
      }
    },
    nameForCase: {
      type: GraphQLString,
      args: {
        letterCase: { type: LetterCaseType }
      },
      resolve: (obj, args) => {
        let fullName = `${obj.firstName} ${obj.lastName}`;
        switch (args.letterCase) {
          case 'lower':
            return fullName.toLowerCase();
          case 'upper':
            return fullName.toUpperCase();
          case 'title':
            return toTitleCase(fullName);
          default:
            return fullName;
        }
      }
    },
    boss: { type: EmployeeType }
  })
});

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    lastQuote: {
      type: GraphQLString,
      resolve: () => readLastLinePromise('data/quotes')
    },
    exampleEmployee: {
      type: EmployeeType,
      resolve: () => exampleEmployee
    },
    hello: {
      type: GraphQLString,
      resolve: () => 'world'
    },
    diceRoll: {
      description: '**Simulate** a dice roll determined by count',
      type: new GraphQLList(GraphQLInt),
      args: {
        count: {
          type: GraphQLInt,
          defaultValue: 2
        }
      },
      resolve: (_, args) => {
        let rolls = [];
        for (let i = 0; i < args.count; i++) {
          rolls.push(roll());
        }
        return rolls;
      }
    },
    usersCount: {
      description: 'Total number of users in the database',
      type: GraphQLInt,
      resolve: (_, args, { db }) =>
        db.collection('users').count()
    }
  }
});

const appendLinePromise = (path, line) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, line, err => {
      if (err) throw reject(err);
      resolve(line);
    });
  });
};

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addQuote: {
      type: GraphQLString,
      args: {
        body: { type: GraphQLString }
      },
      resolve: (_, args) =>
        appendLinePromise('data/quotes', args.body)
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports = mySchema;
