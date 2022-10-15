// _common
export type Vertex = {
  x: number;
  y: number;
};

export type Edge = [Vertex, Vertex];

export type DirectedEdge = {
  from: Vertex;
  to: Vertex;
};

export type Line = [Vertex, Vertex];

export type DirectedLine = {
  from: Vertex;
  to: Vertex;
};

// export type LineSegment = Set<Vertex>;

// export type DirectedLineSegment = {
//   from: Vertex;
//   to: Vertex;
// };

// Convex Hull
