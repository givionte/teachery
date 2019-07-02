import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

import { isAdmin, isAuthenticated } from "./authorization";
import tag from "./tag";

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

    decksWithTags: async (parent, args, { models }) => {
      return await models.Deck.findAll({
        include: [models.Tag]
      });
    },

    deck: async (parent, { id }, { models }) => {
      return await models.Deck.findByPk(id);
    }
  },

  Mutation: {
    createDeck: combineResolvers(
      isAuthenticated,
      async (parent, { deckName, description }, { models, me }) => {
        const deck = await models.Deck.create({
          deckName,
          description,
          userId: me.id
        });
        return deck;
      }
    ),

    addTagToDeck: combineResolvers(
      isAdmin,
      async (parent, { id, tagName }, { models }) => {
        const deck = await models.Deck.findOne({
          where: { id }
        });
        const tag = await models.Tag.findOne({
          where: {
            tagName: {
              [Sequelize.Op.iLike]: "%" + tagName + "%"
            }
          }
        });
        const deckTag = await models.DeckTag.create({
          tagId: tag.id,
          deckId: deck.id
        });
        console.log(deck);
        return deck;
      }
    ),

    deleteDeck: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.Deck.destroy({
          where: { id }
        });
      }
    )
  },

  Deck: {
    cards: async (deck, args, { models }) => {
      return await models.Card.findAll({
        where: {
          deckId: deck.id
        }
      });
    },

    tags: async (deck, args, { models }) => {
      return await models.Tag.findAll({
        include: [
          {
            model: models.Deck,
            where: {
              id: deck.id
            }
          }
        ]
      });
    },

    user: async (deck, args, { models }) => {
      return await models.User.findByPk(deck.userId);
    }
  }
};
