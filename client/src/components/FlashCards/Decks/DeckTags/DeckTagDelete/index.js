import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { cloneDeep } from "apollo-utilities";

import removeitem from "../../../../../assets/remove-item.png";

const REMOVE_TAG = gql`
  mutation($id: ID!, $tagId: ID!) {
    removeTagFromDeck(id: $id, tagId: $tagId)
  }
`;

const TagDelete = ({ tag, deckId }) => {
  const [removeTagFromDeck] = useMutation(REMOVE_TAG, {
    update(cache, { data: { removeTagFromDeck } }) {
      const localData = cloneDeep(
        cache.readFragment({
          id: deckId,
          fragment: gql`
            fragment deck on Deck {
              id
              tags {
                id
                tagName
              }
            }
          `,
        })
      );

      localData.tags = localData.tags.filter((item) => item.id !== tag.id);
      cache.writeFragment({
        id: deckId,
        fragment: gql`
          fragment deck on Deck {
            id
            tags {
              id
              tagName
            }
          }
        `,
        data: { ...localData },
      });
    },
  });

  const onSubmit = (e, removeTagFromDeck) => {
    e.preventDefault();
    removeTagFromDeck({
      variables: { id: deckId, tagId: tag.id },
    });
  };

  return (
    <input
      type="image"
      src={removeitem}
      width="5"
      height="5"
      alt="Delete Tag"
      onClick={(e) => {
        if (window.confirm("Are you sure you wish to delete this tag?"))
          onSubmit(e, removeTagFromDeck);
      }}
    />
  );
};

TagDelete.propTypes = {
  tag: PropTypes.object.isRequired,
  deckId: PropTypes.string,
};

export default TagDelete;
