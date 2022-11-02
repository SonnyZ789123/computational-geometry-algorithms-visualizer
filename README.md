# How to contribute

## Configuration

> Do not change the configuration files in the root directory!

For your workspace VS Code settings. `Ctrl+Shift+P` to open the command palette and type `Preferences: Open Workspace Settings (JSON)`. Paste the following JSON in your settings file.

```json
{
  // Formatter ESLint and Prettier
  "prettier.requireConfig": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "editor.formatOnSaveMode": "file",
  "eslint.enable": true,
  "eslint.alwaysShowStatus": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

We use Prettier formatter and ESLint as linter, so you need to install these in your VS Code extensions.

## Algorithms

### Naming convetion

The name of the file containing the algorithms corresponding to the problem needs to be camel-case version of the head-link in the navbar. For example, a head-link in the navbar is "Line Segment Intersection" so the file containing those algorithms is "lineSegmentIntersection.ts".

It is normal Javascript to have long names, abbreviations are not the convention. So for the function names of the algorithms, the name will be a concatenation of the sub-link and the head-link from the navbar in camelcase. For example the brute force algorithm for line segment intersection is "bruteForceLineSegmentIntersection". You can omit unnecessary symbols in the sub-link.

### Implementation Structure

The algorithm function type must be of

```typescript
type AlgorithmData = {
  vertices?: readonly Vertex[];
  edges?: readonly Edge[];
  directedEdges?: readonly DirectedEdge[];
};

type DrawBuffer = {
  vertices: { value: Vertex; color: string }[];
  edges: { value: Edge; color: string }[];
  directedEdges: { value: Directed; color: string }[];
};

type AlgorithmGenerator = (
  ctx: CanvasRenderingContext2D, // To draw on the canvas
  drawBuffer: DrawBuffer, // To save what you draw
  data: AlgorithmData // Data you use
) => Algorithm;

type Algorithm = Generator<undefined, DrawBuffer | undefined, unknown>;
```

The function returns a `Generator` that returns a `DrawBuffer`. The parameters:

- ctx: canvas context which you can use to draw on the canvas.
- drawBuffer: a buffer of elements that need to be drawn on the canvas. You need to make a local copy of this in your function.
- data: the data you use for your calculations. Not that these are readonly.

An implementation example of the brute force algorithm for a convex hull (/src/lib/algorithms/convexHull.ts).

```typescript
export function* bruteForceConvexHull(
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer,
  { vertices }: AlgorithmData
): Algorithm {
  // AlgoritmData is possibly undefined
  if (!vertices) {
    throw new Error('Vertices is undefined');
  }

  // Force a clean context
  clearAndRedrawBuffer(ctx, drawBuffer);

  // Make a local drawBuffer
  const localDrawBuffer: DrawBuffer = {
    vertices: [...drawBuffer.vertices],
    edges: [...drawBuffer.edges],
    directedEdges: [...drawBuffer.directedEdges],
  };

  //...actual calculating and drawing

  // Return the local drawBuffer
  return localDrawBuffer;
}
```

For every "step" you want to define, put a `yield` where you want it to stop. In this example we "step" over every edge (from a list of vertices), draw the edge as a directed edge (arrow) and add it to the drawn edges in the local draw buffer.

```typescript
for (let i = 0; i < vertices.length; i += 1) {
  for (let j = 0; j < vertices.length; j += 1) {
    if (j === i) {
      continue;
    }
    const e1 = { from: vertices[i], to: vertices[j] };

    drawDirectedEdge(ctx, e1, colors.white);
    localDrawBuffer.directedEdges.push({
      value: e1,
      color: colors.white,
    });
    yield; // Stop here
  }
}
```

### Common Draw Functions

All available functions are defined in /src/lib/canvas.ts.

clearAndRedrawBuffer
: Clears the whole canvas, draws the grid and draws every element in the given draw buffer.

drawDot
: Draws a dot.

drawEdge
: Draws an edge.

drawDirectedEdge
: Draws an arrow.

## Git Workflow

### contributing Guide

[Step-by-step guide to contributing on GitHub](https://www.dataschool.io/how-to-contribute-on-github/)

### Branch conventions

A branch represents an issue. With the issue comes some additional information and guidelines.

When you decide to contribute to an issue, you make a new branch with the name "feature/<#ticketnr>-\<abvoftitle\>". So image there is an issue with the title "Convex Hull - Andrew's Algorithm implementation #1", this case the ticketnr is #1 so the branch name will be "feature/#1-convex-hull-andrew". You also assign yourself to the issue so others know you're already working on it.

# File structure

All the code is in the /src folder, all the config files are in the root folder of the project.

## /\_\_tests\_\_

The /\_\_tests\_\_ folder contains some tests.

## /assets

All the assets (images, icons, models) go in the /assets folders. We only use svg-icons (for now), so there's just an /icons subfolder.

## /global

The /global folder contains global components (custom Button and Link components), the routing, and global styles (colors, global css, helper functions). Only use colors from the defined colors!

## /lib

The /lib folder contains the library of algorithms in the /algorithms subfolder. Each file in this folder has the main algorithms corresponding to the problem. The algorithm must be of type `AlgorithmGenerator`. Helpers of the algorithm are in a seperate helpers.ts file.
The /lib folder also contains helper functions for drawing in the canvas (canvas.ts) and visualization (like delaying execution).

## /modules

Page components go in /modules. Shared sub-components (like NavBar, Canvas, Controls, PageWrapper) go in the /\_common folder. It is the convention to put a prefix underscore for shared folders, only files in the same directory can that folder.

## App.ts, index.ts and types.d.ts

At the root of /src are files like App.ts as root component which defines the root layout of the pages and index.ts that imports App.ts and renders it with some extra configuration around it. There is also an types.d.ts file which declares all the globally used types.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
