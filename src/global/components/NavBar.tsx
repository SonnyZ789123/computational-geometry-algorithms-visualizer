import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import colors from '../styles/colors';

const Nav = styled.nav`
  margin: 0 auto;
  padding: 1.5rem 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  &:hover {
    color: ${colors.secondary};
  }
`;

function NavBar(): JSX.Element {
  return (
    <Nav>
      <StyledLink to='/convex-hull'>Convex Hulls</StyledLink>
      <StyledLink to='/line-segment-intersection'>
        Line Segment Intersection
      </StyledLink>
      <StyledLink to='/polygon-triangulation'>Polygon Triangulation</StyledLink>
    </Nav>
  );
}

export default NavBar;
