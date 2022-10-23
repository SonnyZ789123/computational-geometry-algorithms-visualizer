import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../../modules/Home';
import ConvexHull from '../../modules/ConvexHull';
import NotFound from '../../modules/NotFound';

function RoutesWrapper(): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/convex-hull/:id' element={<ConvexHull />} />
      <Route path='/line-segment-intersection/:id' element={<Home />} />
      <Route path='/polygon-triangulation/:id' element={<Home />} />
      <Route path='/not-found' element={<NotFound />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  );
}

export default RoutesWrapper;
