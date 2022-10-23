import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './global/styles/index';

import NavBar from './global/components/NavBar';
import RoutesWrapper from './global/routes/RoutesWrapper';

const Container = styled.div`
  margin: 0 auto;
  height: 100vh;
  max-width: 1008px;
`;

function App(): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <Container className='App'>
        <NavBar />
        <RoutesWrapper />
      </Container>
    </>
  );
}

export default App;
