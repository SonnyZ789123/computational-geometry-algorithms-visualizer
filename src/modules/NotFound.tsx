import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import colors from '../global/styles/colors';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${colors.white};
  font-size: 2rem;
`;

const StatusCode = styled.span`
  color: ${colors.secondary};
`;

const StyledLink = styled(Link)`
  transition: color 150ms ease-in-out;

  &:hover {
    color: ${colors.secondary};
  }
`;

function NotFound(): JSX.Element {
  // Not use the page wrapper here. We don't want to use the column distribution
  return (
    <Container>
      <Title>
        <StatusCode>404</StatusCode> Not found.
      </Title>
      <StyledLink to='/'>&gt; Go to Home</StyledLink>
    </Container>
  );
}

export default NotFound;
