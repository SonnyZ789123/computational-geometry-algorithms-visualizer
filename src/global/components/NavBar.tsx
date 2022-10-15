import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

const Nav = styled.nav`
  margin: 0 auto;
  padding: 1.5rem 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const Link = styled.a`
  &:hover {
    color: ${colors.secondary};
  }
`;

function NavBar(): JSX.Element {
  return (
    <Nav>
      <Link href='/convex-hulls'>Convex Hulls</Link>
      <Link href='/line-segment-intersection'>Line Segment Intersection</Link>
      <Link href='/polygon-triangulation'>Polygon Triangulation</Link>
    </Nav>
  );
}

export default NavBar;
