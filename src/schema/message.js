import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    Get all messages
    """
    messages(cursor: String, limit: Int): MessageConnection!
    """
    Get message by id
    """
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: ID!

    """
    Message text
    """
    text: String!

    createdAt: Date!
    user: User!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
