import React from 'react';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

function ConvexHull(): JSX.Element {
  return (
    <PageWrapper>
      <Canvas />
      <Controls />
    </PageWrapper>
  );
}

export default ConvexHull;
