import React from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import PropTypes from "prop-types";

import CARDS_QUERY from "./CardListSchema/CardListSchema";
import withAuthorization from "../../../Session/withAuthorization";
import Loading from "../../../Loading";
import CardItem from "../CardItem";
import ErrorMessage from "../../../Alerts/Error/index";
import GoBack from "../../../Navigation/GoBack";
import SuccessMessage from "../../../Alerts/Success";
import CardCreate from "../CardCreate";
import AddDeckTag from "../../Decks/DeckItem/DeckTags/AddDeckTag";
import CardEdit from "../CardEdit";

export const CardList = props => {
  let { id } = props.match.params;
  id = parseInt(id);

  const { data, error, loading } = useQuery(CARDS_QUERY, {
    variables: { id }
  });
  if (loading && !data) {
    return <Loading />;
  } else if (error) {
    return <ErrorMessage error={error} />;
  }
  const {
    toggleDeleteSuccess,
    deck: { cards, deckName }
  } = data;

  return (
    <Container>
      <Header>
        <Menu>
          <h3>
            <GoBack message="Go Back" />{" "}
          </h3>
          <Title>Card Listing for {deckName}</Title>
          <CardEdit />
          <CardCreate key={data.deck.id} deck={data.deck} />
          <AddDeckTag deck={data.deck} />
        </Menu>
      </Header>
      {toggleDeleteSuccess && (
        <SuccessMessage message="Card successfully deleted!" />
      )}
      {cards.length === 0 && (
        <div>This deck does not have any cards yet ...</div>
      )}
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          deckId={id}
          deckUserId={data.deck.user.id}
        />
      ))}
    </Container>
  );
};

CardList.propTypes = {
  props: PropTypes.object
};

const Container = styled.div`
  z-index: 15;
  max-width: 100%;
  margin: auto;
`;

const Header = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;

const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  flex-grow: 2;
`;

export default withAuthorization(session => session && session.me)(
  withRouter(CardList)
);
