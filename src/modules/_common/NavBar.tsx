import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import colors from '../../global/styles/colors';
import {
  convexHull,
  lineSegmentIntersection,
  polygonTriangulation,
  linearProgramming,
} from '../../global/routes/paths';

const Nav = styled.nav`
  position: relative;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  padding: 1rem 5rem;
  z-index: 3;
  border-radius: 15px;
  background-color: ${colors.primaryDark};
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  column-gap: 2rem;
  row-gap: 1rem;
  pointer-events: none;
  width: 100%;
  opacity: 0;
  transform: translateY(-15px);
  top: calc(100%);
  left: 0;
  transition: opacity 150ms ease-in-out, transform 200ms ease-in-out;
`;

const Dropdown = styled.div`
  color: ${colors.white};
  padding: 1.5rem 0;

  &:hover {
    & span {
      cursor: pointer;
      text-decoration: underline ${colors.primaryLight};
      text-underline-offset: 0.5rem;
    }

    & ${DropdownMenu} {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
  }
`;

const StyledLink = styled(Link)`
  transition: color 150ms ease-in-out;

  &:hover {
    color: ${colors.greyLight};
  }
`;

function NavBar(): JSX.Element {
  return (
    <Nav>
      <Dropdown>
        <span>Convex Hull</span>
        <DropdownMenu>
          <StyledLink to={`/convex-hull/${convexHull.BRUTE_FORCE}`}>
            Brute Force
          </StyledLink>
          <StyledLink to={`/convex-hull/${convexHull.ANDREW}`}>
            Andrew&apos;s Algorithm
          </StyledLink>
          <StyledLink to={`/convex-hull/${convexHull.GRAHAM}`}>
            Graham&apos;s Scan
          </StyledLink>
          <StyledLink to={`/convex-hull/${convexHull.JARVIS}`}>
            Jarvis&apos;s March
          </StyledLink>
        </DropdownMenu>
      </Dropdown>

      <Dropdown>
        <span>Line Segment Intersection</span>
        <DropdownMenu>
          <StyledLink
            to={`/line-segment-intersection/${lineSegmentIntersection.BRUTE_FORCE}`}
          >
            Brute Force
          </StyledLink>
          <StyledLink
            to={`/line-segment-intersection/${lineSegmentIntersection.PLANE_SWEEP}`}
          >
            Plane Sweep Algorithm
          </StyledLink>
        </DropdownMenu>
      </Dropdown>

      <Dropdown>
        <span>Polygon Triangulation</span>
        <DropdownMenu>
          <StyledLink
            to={`/polygon-triangulation/${polygonTriangulation.POLYGON_TRIANGULATION}`}
          >
            Polygon Triangulation
          </StyledLink>
        </DropdownMenu>
      </Dropdown>

      <Dropdown>
        <span>Linear Programming</span>
        <DropdownMenu>
          <StyledLink
            to={`/linear-programming/${linearProgramming.HALF_PLANE}`}
          >
            Half-Plane Intersection
          </StyledLink>
          <StyledLink
            to={`/linear-programming/${linearProgramming.ENCLOSING_DISC}`}
          >
            Smallest Enclosing Disc
          </StyledLink>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  );
}

export default NavBar;
