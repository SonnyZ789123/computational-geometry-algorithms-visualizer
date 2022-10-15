import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0 2rem;
`;

function PageWrapper({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  return <Container>{children}</Container>;
}

export default PageWrapper;
