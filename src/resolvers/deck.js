import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

const toCursorHash = string => Buffer.from(string).toString("base64");

const fromCursorHash = string =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  Query: {
    decks: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor)
              }
            }
          }
        : {};

      const decks = await models.Deck.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions
      });

      const hasNextPage = decks.length > limit;
      const edges = hasNextPage ? decks.slice(0, -1) : decks;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    deck: async (parent, { id }, { models }) => {
      return await models.Deck.findById(id);
    }
  },

  Deck: {
    user: async (deck, args, { models }) => {
      return await models.User.findById(deck.userId);
    }
  }
};