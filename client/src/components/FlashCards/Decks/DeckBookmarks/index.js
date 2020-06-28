import React, { Fragment } from "react";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import styled from "styled-components";

import useWindowDimensions from "../../../../utilities/useWindowDimensions";
import Button from "../../../../theme/Button";
import liked from "../../../../assets/liked.png";
import like from "../../../../assets/like.png";

const DeckBookmarks = () => {
  const client = useApolloClient();
  const { data: toggleData } = useQuery(gql`
    query Toggle {
      toggleBookmarks @client
      linkedToPage @client
    }
  `);
  const { toggleBookmarks, linkedToPage } = toggleData;

  const toggleBookmarkedDecks = async () => {
    client.writeData({
      data: { toggleBookmarks: !toggleBookmarks, linkedToPage: !linkedToPage }
    });
  };

  const { width } = useWindowDimensions();

  return (
    <ViewButtonWrapper>
      {width < 800 ? (
        <MobileBookmarkButton
          type="button"
          onClick={e => toggleBookmarkedDecks(e)}
        >
          {toggleBookmarks ? (
            <Fragment>
              <LikeIcon src={like} />
            </Fragment>
          ) : (
            <Fragment>
              <LikeIcon src={liked} />
            </Fragment>
          )}
        </MobileBookmarkButton>
      ) : (
        <ViewBookmarkDecksButton
          type="button"
          onClick={e => toggleBookmarkedDecks(e)}
        >
          {toggleBookmarks ? (
            "View All"
          ) : (
            <Flex>
              <LikeIcon src={liked} /> My Saved Decks
            </Flex>
          )}
        </ViewBookmarkDecksButton>
      )}
    </ViewButtonWrapper>
  );
};

const ViewButtonWrapper = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
`;

const ViewBookmarkDecksButton = styled(Button)`
  border: 2px solid ${props => props.theme.secondaryDark};
  width: 175px;
  -ms-flex-item-align: end;
  align-self: flex-end;
`;

const MobileBookmarkButton = styled(Button)`
  border: 2px solid ${props => props.theme.neutralLight};
  height: 36;
  :hover {
    color: white;
    background: ${props => props.theme.neutralLight};
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  @media only screen and (max-width: 480px) {
    width: 75px;
  }
`;

const Flex = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
`;

const LikeIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 0.5em;
  @media only screen and (max-width: 800px) {
    width: 24px;
    height: 24px;
  }
`;

export default DeckBookmarks;
