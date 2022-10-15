import React from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';

const CanvasWrapper = styled.div`
  border: 5px solid ${colors.primary};
  border-radius: 20px;
`;

function Canvas(): JSX.Element {
  return (
    <CanvasWrapper>
      <canvas />
    </CanvasWrapper>
  );
}

export default Canvas;
