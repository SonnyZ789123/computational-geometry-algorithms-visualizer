import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from './global/styles/index';

import NavBar from './global/components/NavBar';
import Home from './modules/Home';
import ConvexHull from './modules/ConvexHull';

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
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/convex-hull' element={<ConvexHull />} />
          <Route path='/line-segment-intersection' element={<Home />} />
          <Route path='/polygon-triangulation' element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
