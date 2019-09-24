import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isAssignmentOwner } from "./authorization";

const toCursorHash = string => Buffer.from(string).toString("base64");

const fromCursorHash = string =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  Query: {
    assignments: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor)
              }
            }
          }
        : {};

      const assignments = await models.Assignment.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions
      });
      const hasNextPage = assignments.length > limit;
      const edges = hasNextPage ? assignments.slice(0, -1) : assignments;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    assignment: async (parent, { id }, { models }) => {
      return await models.Assignment.findByPk(id);
    }
  },

  Mutation: {
    createAssignment: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { assignmentName, note, link, status, dueDate },
        { models, me }
      ) => {
        if (link === "") {
          link = null;
        }
        const assignment = await models.Assignment.create({
          assignmentName,
          note,
          link,
          status,
          dueDate,
          userId: me.id
        });
        return assignment;
      }
    ),

    deleteAssignment: combineResolvers(
      isAuthenticated,
      isAssignmentOwner,
      async (parent, { id }, { models }) => {
        return await models.Assignment.destroy({ where: { id } });
      }
    )
  },

  Assignment: {
    assignedTasks: async (assignment, args, { models }) => {
      return await models.AssignedTask.findAll({
        include: [
          {
            model: models.Assignment,
            where: {
              id: assignment.id
            }
          }
        ]
      });
    },

    user: async (assignment, args, { loaders }) => {
      return await loaders.user.load(assignment.userId);
    }
  }
};
