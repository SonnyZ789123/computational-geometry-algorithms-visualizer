import {
  crossProduct,
  intersectLines,
  relativeOrientation,
  turnOrientation,
} from '../lib/algorithms/_helpers';

describe('Algorithms helpers tests', () => {
  const v0 = {
    x: -1,
    y: 0,
  };

  const v1 = {
    x: 3,
    y: 2,
  };

  const v2 = {
    x: 2,
    y: 4,
  };

  const v4 = {
    x: 1,
    y: -2,
  };

  describe('Cross Product', () => {
    it('should calculate the cross product correctly', () => {
      expect(crossProduct(v1, v2)).toBe(8);
    });
  });

  describe('Relative Orientation', () => {
    it('should be greater than 0 if it turns counter clockwise', () => {
      expect(
        relativeOrientation({ from: v0, to: v1 }, { from: v0, to: v2 })
      ).toBeGreaterThan(0);
    });

    it('should be less than 0 if it turns clockwise', () => {
      expect(
        relativeOrientation({ from: v0, to: v2 }, { from: v0, to: v1 })
      ).toBeLessThan(0);
    });

    it('should be 0 if it extends the other line', () => {
      expect(
        relativeOrientation({ from: v0, to: v2 }, { from: v0, to: v2 })
      ).toBe(0);
    });
  });

  describe('Turn Orientation', () => {
    it('should be greater than 0 if it turns counter clockwise', () => {
      expect(
        turnOrientation({ from: v0, to: v1 }, { from: v1, to: v2 })
      ).toBeGreaterThan(0);
    });

    it('should be less than 0 if it turns clockwise', () => {
      expect(
        turnOrientation({ from: v0, to: v1 }, { from: v1, to: v4 })
      ).toBeLessThan(0);
    });
  });

  describe('Intersect Lines', () => {
    it('should return true when they intersect', () => {
      expect(intersectLines([v0, v1], [v2, v4])).toBe(true);
    });

    it('should return false when they do not intersect', () => {
      expect(intersectLines([v0, v4], [v2, v1])).toBe(false);
    });
  });
});
