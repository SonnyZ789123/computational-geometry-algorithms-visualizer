import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';
import {
  clearAndRedrawBuffer,
  readyCanvas,
  TOTAL_POINTS,
} from '../../lib/canvas';

import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause.svg';
import { ReactComponent as SkipBackIcon } from '../../assets/icons/skip-back.svg';
import { ReactComponent as SkipForwardIcon } from '../../assets/icons/skip-forward.svg';
import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh.svg';

import { Button } from '../../global/components/Buttons';
import {
  Algorithm,
  AlgorithmGenerator,
  DrawBuffer,
  AlgorithmData,
} from '../../types';

const Container = styled.div`
  grid-column: 10 / end;
  display: flex;
  flex-flow: column nowrap;
  gap: 1.5rem;
`;

const AlgorithmTitle = styled.h1`
  margin: 0;
  text-decoration: underline;
  text-decoration-color: ${colors.primary};
  text-underline-offset: 0.5rem;
  color: ${colors.light};
  font-size: 1.5rem;
  text-align: center;
`;

const PlayContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Icon = styled.button<{ disabled?: boolean }>`
  display: inline-block;
  margin: 0;
  padding: 0;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  background: none;
  border: none;
  stroke: ${({ disabled }) => (disabled ? colors.darkGreen : colors.secondary)};
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Description = styled.label`
  font-size: 1.25rem;
  color: ${colors.white};
`;

const Input = styled.input`
  font-size: 1.25rem;
  color: ${colors.secondary};
  width: 30%;
`;

type ControlsProps = {
  algorithmTitle: string;
  randomize: (amount: number) => void;
  genAlgorithm: AlgorithmGenerator;
  canvasElement: HTMLCanvasElement | null;
  drawBuffer: DrawBuffer;
  data: AlgorithmData;
};

function Controls({
  algorithmTitle,
  randomize,
  genAlgorithm,
  canvasElement,
  drawBuffer,
  data,
}: ControlsProps): JSX.Element {
  // Controls
  const [playing, setPlaying] = useState(false);
  const [delayAmount, setDelayAmount] = useState(2000); // in ms
  const [amount, setAmount] = useState(5);

  // The reference to the instance of the algorithm Iterator
  const algorithm = useRef<Algorithm>();
  // The interval id that keeps track of the setInterval when the algorithm is playing, it is undefined when not playing.
  const playId = useRef<NodeJS.Timer>();

  // Initialise the algorithm Iterator ref to it's starting position
  const initAlgorithm = () => {
    const ctx = readyCanvas(canvasElement);
    if (!ctx) return;

    // local drawBuffer, it gets modified
    const localDrawBuffer: DrawBuffer = {
      vertices: [...drawBuffer.vertices],
      edges: [...drawBuffer.edges],
      directedEdges: [...drawBuffer.directedEdges],
    };

    clearAndRedrawBuffer(ctx, localDrawBuffer);

    algorithm.current = genAlgorithm(ctx, localDrawBuffer, data);
  };

  // Reset the algorithm to starting position and pause
  const resetAlgorithm = () => {
    clearInterval(playId.current);
    playId.current = undefined;
    setPlaying(false);
    initAlgorithm(); // Reset the algorithm to it's starting point
  };

  // Start the play interval
  const handlePlayClick = () => {
    if (!algorithm.current) return; // Maybe init algorithm?

    setPlaying(true);

    // Step through all the steps (yields), when it's done, stop the loop
    playId.current = setInterval(() => {
      if (algorithm.current?.next().done) {
        resetAlgorithm();
      }
    }, delayAmount);
  };

  // Pause the play interval
  const handlePauseClick = () => {
    setPlaying(false);

    clearInterval(playId.current);
    playId.current = undefined;
  };

  // TODO: https://stackoverflow.com/questions/58142867/get-previous-value-from-generator-function
  const handleBackClick = () => {};

  // Step (yield) forward in the algorithm
  const handleNextClick = () => {
    if (!algorithm.current) return;

    if (algorithm.current?.next().done) {
      resetAlgorithm();
    }
  };

  // Refresh the algorithm to its starting state
  const handleRefreshClick = () => {
    resetAlgorithm();
  };

  // We need to generate the algorithm again if the input changes
  // When you play and when playing change the data, it will keep playing but starts from the beginning with the new data.
  // Maybe keep this feature or not?
  useEffect(() => {
    initAlgorithm();
  }, [data, canvasElement]);

  useEffect(() => {
    randomize(amount);
  }, []);

  return (
    <Container>
      <AlgorithmTitle>{algorithmTitle}</AlgorithmTitle>
      <PlayContainer>
        <Icon disabled>
          <SkipBackIcon onClick={handleBackClick} />
        </Icon>
        <Icon>
          {playing ? (
            <PauseIcon onClick={handlePauseClick} />
          ) : (
            <PlayIcon onClick={handlePlayClick} />
          )}
        </Icon>
        <Icon>
          <SkipForwardIcon onClick={handleNextClick} />
        </Icon>
      </PlayContainer>
      <Icon>
        <RefreshIcon onClick={handleRefreshClick} />
      </Icon>
      <ControlContainer>
        <Description htmlFor='delay'>Delay:</Description>
        <Input
          id='delay'
          name='delay'
          value={`${delayAmount / 1000}`}
          onChange={(e) => setDelayAmount(Number(e.target.value) * 1000)}
          type='number'
          min={0.1}
          step={0.1}
          max={3}
        />
      </ControlContainer>
      <ControlContainer>
        <Description htmlFor='amount'>Vertex Amount:</Description>
        <Input
          id='amount'
          name='amount'
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          type='number'
          min={3}
          step={1}
          max={TOTAL_POINTS / 5} // Accept less than a fifth of the total possible amount of points
        />
      </ControlContainer>
      <Button color='secondary' onClick={() => randomize(amount)}>
        Randomize
      </Button>
    </Container>
  );
}

export default Controls;
