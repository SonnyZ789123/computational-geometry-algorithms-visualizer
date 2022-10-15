import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './global/styles/index';

import NavBar from './global/components/NavBar';

const Container = styled.div`
  margin: 0 auto;
  height: 100vh;
  max-width: 1008px;
  padding: 0 2rem;
`;

function App(): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <Container className='App'>
        <NavBar />
      </Container>
    </>
  );
}

export default App;
