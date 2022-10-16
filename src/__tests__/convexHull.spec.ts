import { Vertex } from '../types';
import { bruteForceConvexHull } from '../lib/algorithms/convexHull';

describe('Convex Hull tests', () => {
  const V = new Set<Vertex>([
    { x: 3, y: 3 },
    { x: 7, y: 5 },
    { x: 11, y: 7 },
    { x: 4, y: 8 },
    { x: 10, y: 9 },
    { x: 7, y: 10 },
    { x: 9, y: 11 },
    { x: 5, y: 12 },
    { x: 12, y: 12 },
    { x: 13, y: 5 },
  ]);

  const CH: Vertex[] = [
    { x: 3, y: 3 },
    { x: 4, y: 8 },
    { x: 5, y: 12 },
    { x: 12, y: 12 },
    { x: 13, y: 5 },
  ];

  describe('Brute Force', () => {
    const convexHull = bruteForceConvexHull(V);

    it('contains 4 verices', () => {
      expect(convexHull).toHaveLength(CH.length);
    });

    it('contains the vertices of the convex hull in clockwise order', () => {
      const startIndex = CH.findIndex(
        (v) => v.x === convexHull[0].x && v.y === convexHull[0].y
      );
      expect(startIndex).toBeDefined();

      for (let i = 0; i < convexHull.length; i += 1) {
        expect(convexHull[i]).toEqual(CH[(startIndex + i) % 4]);
      }
    });
  });
});
