import React, { useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';
import { CANVAS_WIDTH, CANVAS_HEIGHT, drawGrid } from '../../lib/canvas';

const CanvasWrapper = styled.div`
  grid-column: 1 / 9;
  border: 5px solid ${colors.secondary};
  border-radius: 20px;
  overflow: hidden;

  & canvas {
    width: 100%;
    height: 100%;
  }
`;

function Canvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}): JSX.Element {
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawGrid(ctx);
      }
    }
  }, []);

  return (
    <CanvasWrapper>
      <canvas ref={canvasRef} />
    </CanvasWrapper>
  );
}

export default Canvas;
