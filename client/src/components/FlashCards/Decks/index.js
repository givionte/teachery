import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";

import GET_PAGINATED_DECKS_WITH_USERS from "./DeckSchema";
import Loading from "../../Loading";
import withSession from "../../Session/withSession";
import DeckItemBase from "./DeckItem";

const Decks = ({ limit, me }) => (
  <Query query={GET_PAGINATED_DECKS_WITH_USERS} variables={{ limit }}>
    {({ data, loading, error, fetchMore }) => {
      if (!data) {
        return <div>There are no decks yet ...</div>;
      }

      const { decks } = data;

      if (loading || !decks) {
        return <Loading />;
      }

      const { edges, pageInfo } = decks;

      return (
        <Fragment>
          <DeckList decks={edges} me={me} />

          {pageInfo.hasNextPage && (
            <MoreDecksButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              More
            </MoreDecksButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const MoreDecksButton = ({ limit, pageInfo, fetchMore, children }) => (
  <button
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            decks: {
              ...fetchMoreResult.decks,
              edges: [
                ...previousResult.decks.edges,
                ...fetchMoreResult.decks.edges
              ]
            }
          };
        }
      })
    }
  >
    {children}
  </button>
);

const DeckContainer = styled.div`
  padding: 4rem 2rem;
  display: grid;
  align-items: center;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const DeckList = ({ decks, me }) => {
  console.log(decks);
  return (
    <DeckContainer>
      {decks.map(deck => (
        <DeckItem key={deck.id} deck={deck} me={me} />
      ))}
    </DeckContainer>
  );
};

const DeckItem = withSession(DeckItemBase);

export default Decks;
