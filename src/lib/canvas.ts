import colors from '../global/styles/colors';
import { Vertex } from '../types';

/// /////////
// Config
/// /////////
export const DOT_SIZE = 3;
export const LINE_WIDTH = 1;
export const GRID_SIZE = 10;
export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;
export const X_MAX = Math.floor(CANVAS_WIDTH / GRID_SIZE);
export const Y_MAX = Math.floor(CANVAS_HEIGHT / GRID_SIZE);

/// /////////
// Init and clear
/// /////////
export function drawGrid(ctx: CanvasRenderingContext2D) {
  // Start at 1 because otherwise we draw on the border
  // Draw grid lines along X-axis
  for (let i = 1; i < Y_MAX; i += 1) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.strokeStyle = colors.darkGrey;

    ctx.moveTo(0, GRID_SIZE * i + 0.5);
    ctx.lineTo(CANVAS_WIDTH, GRID_SIZE * i + 0.5);

    ctx.stroke();
  }

  // Draw grid lines along y-axis
  for (let i = 1; i < X_MAX; i += 1) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.strokeStyle = colors.darkGrey;

    ctx.moveTo(GRID_SIZE * i + 0.5, 0);
    ctx.lineTo(GRID_SIZE * i + 0.5, CANVAS_HEIGHT);

    ctx.stroke();
  }
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(ctx);
}

/// /////////
// Drawing
/// /////////
export function drawDot(ctx: CanvasRenderingContext2D, v: Vertex) {
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(v.x - DOT_SIZE / 2, v.y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE); // Center it
}

export function drawEdge(
  ctx: CanvasRenderingContext2D,
  v1: Vertex,
  v2: Vertex
) {
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = LINE_WIDTH;
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}
