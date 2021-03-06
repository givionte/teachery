import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const SuccessMessage = ({ message }) => {
  return (
    <SuccessContainer>
      <Success>{message}</Success>
    </SuccessContainer>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired
};

const SuccessContainer = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 5px 1px rgba(145, 210, 81, 0.47);
`;

const Success = styled.h5`
  color: ${props => props.theme.success};
`;

export default SuccessMessage;
