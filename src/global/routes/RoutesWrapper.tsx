import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../../modules/Home';
import ConvexHull from '../../modules/ConvexHull';
import LineSegmentIntersection from '../../modules/LineSegmentIntersetion';
import PolygonTriangulation from '../../modules/PolygonTriangulation';
import LinearProgramming from '../../modules/LinearProgramming';
import NotFound from '../../modules/NotFound';

function RoutesWrapper(): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/convex-hull/:id' element={<ConvexHull />} />
      <Route
        path='/line-segment-intersection/:id'
        element={<LineSegmentIntersection />}
      />
      <Route
        path='/polygon-triangulation/:id'
        element={<PolygonTriangulation />}
      />
      <Route path='/linear-programming/:id' element={<LinearProgramming />} />
      <Route path='/not-found' element={<NotFound />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  );
}

export default RoutesWrapper;
