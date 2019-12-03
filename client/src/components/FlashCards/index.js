import React from "react";
import styled from "styled-components";

import withAuthorization from "../Session/withAuthorization";
import Decks from "./Decks";
import Search from "./Decks/DeckSearch";
import DeckCreate from "./Decks/DeckCreate";
import DeckEdit from "./Decks/DeckEdit";
import AddDeckTag from "./Decks/DeckItem/DeckTags/AddDeckTag";
import CardCreate from "./Cards/CardCreate";

const FlashCardPage = () => (
  <Container>
    <FlashCardHeader>
      <h3>Flashcard Decks</h3>
      <Menu>
        <Search />
        <AddDeckTag />
        <CardCreate />
        <DeckEdit />
        <DeckCreate />
      </Menu>
    </FlashCardHeader>
    <Decks limit={6} />
  </Container>
);

const Container = styled.div`
  z-index: 15;
  max-width: 100%;
  margin: auto;
`;

const FlashCardHeader = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default withAuthorization(session => session && session.me)(
  FlashCardPage
);
