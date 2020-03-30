const { ApolloServer, gql } = require('apollo-server');

const lifts = require("./data/lifts.json");
const trails = require("./data/trails.json");

/* const typeDefs = gql`
  scalar Date

  """
  An object that describes characteristcis of SkiDay
  """

  type SkiDay {
    "A ski day Id"
    id: ID!
    "date the ski occurred"
    date: Date!
    mountain: String!
    conditions: Conditions!
  }

  enum Conditions {
    POWDER
    ICE
    ROCKY
  }

  input AddDayInput {
    date: Date!
    mountain: String!
    conditions: Conditions!
  }

  type RemoveDayResponse {
    removed: Boolean!
    totalBefore: Int!
    totalAfter: Int!
    day: SkiDay!
  }

  type Mutation {
    addDay(input: AddDayInput!): SkiDay!
    removeDay(id: ID!): RemoveDayResponse!
  }

  type Subscription {
    newDay: SkiDay!
  }

  type Query {
    allDays: [SkiDay!]!
    hello: String!
    number: Int!
  }
` */

/* const resolvers = {
  Query: {
    hello: () => 'Hello World'
  }
} */


const typeDefs = gql`

  type Lift {
    id: ID!
    name: String!
    status: LiftStatus!
  }

  enum TrailStatus {
    OPEN
    CLOSED
  }

  enum LiftStatus {
    OPEN
    CLOSED
    HOLD
  }

  type Trail {
    id: ID!
    name: String!
    status: TrailStatus
    lift: [String!]!
  }

  type Query {
    findLiftById(id: ID!): Lift!
    allLifts: [Lift!]!
    liftCount: Int!
    allTrails(status: TrailStatus): [Trail!]!
    findTrailById(id: ID!): Trail!
    trailCount(status: TrailStatus): Int!
  }
`;

const resolvers = {
  Query: {
    allLifts: () => lifts,
    liftCount: () => lifts.length,
    findLiftById: (parent, args) => (
      lifts.find(lift => args.id === lift.id)
    ),
    allTrails: (parent, { status }) => {
      if (!status) return lifts;
      return trails.filter(trail => trail.status === status);
    },
    findTrailById: (parent, args) => (
      trails.find(trail => args.id === trail.id)
    ),
    trailCount: (parent, { status }) => {
      if (!status) return trails.length;
      return resolvers.Query.allTrails(parent, { status }).length;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  // mocks: true
  resolvers

});

server.listen().then(({ url }) => {
  console.log('Server started')
})
