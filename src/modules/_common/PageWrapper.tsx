import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  min-height: 500px;
`;

function PageWrapper({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  return <Container>{children}</Container>;
}

export default PageWrapper;
