import React from "react";
import styled from "styled-components";

const SuccessContainer = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 5px 1px rgba(145, 210, 81, 0.47);
`;

const Success = styled.h5`
  color: ${props => props.theme.success};
`;

const SuccessMessage = () => {
  return (
    <SuccessContainer>
      <Success>Item Created!</Success>
    </SuccessContainer>
  );
};

export default SuccessMessage;