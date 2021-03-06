import React from "react";

import withAuthorization from "../Session/withAuthorization";
import { MessageCreate, Messages } from "../Message";
import RoleChange from "./Roles";
import styled from "styled-components";

const AdminPage = () => (
  <Container>
    <Header>
      <Menu>
        <Title>Admin</Title>
      </Menu>
    </Header>
    <Menu>
      <RoleChange />
    </Menu>
    <Hr />
    <Messages limit={3} />
    <MessageCreate />
  </Container>
);

const Container = styled.div`
  z-index: 15;
  max-width: 100%;
  margin: auto;
`;

const Header = styled.div`
  background-color: ${props => props.theme.neutralLight};
  background-clip: border-box;
  width: 100%;
  margin: auto auto 5px auto;
  display: inline-block;
`;

const Title = styled.h2`
  margin: 0;
  padding: 0.5em;
  @media only screen and (max-width: 675px) {
    text-align: center;
    -ms-flex-item-align: end;
    align-self: flex-end;
  }
`;

const Menu = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
`;

export const Hr = styled.hr`
  padding: 0;
  margin: 0;
  border: none;
  height: 2px;
  width: 100%;
  background-image: -webkit-linear-gradient(
    left,
    ${props => props.theme.neutralLight},
    ${props => props.theme.container}
  );
`;

export default withAuthorization(
  session => session && session.me && session.me.role === "ADMIN"
)(AdminPage);
