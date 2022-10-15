import React, { useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';

const CanvasWrapper = styled.div`
  grid-column: 1 / 9;
  border: 5px solid ${colors.primary};
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
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 10px in between
        const gridSize = 10;

        const canvasWidth = 400;
        const canvasHeight = 400;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const xLinesAmount = Math.floor(canvasWidth / gridSize);
        const yLinesAmount = Math.floor(canvasHeight / gridSize);

        // Start at 1 because otherwise we draw on the border
        // Draw grid lines along X-axis
        for (let i = 1; i < yLinesAmount; i += 1) {
          ctx.beginPath();
          ctx.lineWidth = 1;

          ctx.strokeStyle = colors.darkGrey;

          ctx.moveTo(0, gridSize * i + 0.5);
          ctx.lineTo(canvasWidth, gridSize * i + 0.5);

          ctx.stroke();
        }

        // Draw grid lines along y-axis
        for (let i = 1; i < xLinesAmount; i += 1) {
          ctx.beginPath();
          ctx.lineWidth = 1;

          ctx.strokeStyle = colors.darkGrey;

          ctx.moveTo(gridSize * i + 0.5, 0);
          ctx.lineTo(gridSize * i + 0.5, canvasHeight);

          ctx.stroke();
        }
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
