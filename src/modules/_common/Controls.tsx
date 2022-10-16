import React from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';
import { TOTAL_POINTS } from '../../lib/canvas';

import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as SkipBackIcon } from '../../assets/icons/skip-back.svg';
import { ReactComponent as SkipForwardIcon } from '../../assets/icons/skip-forward.svg';

import { Button } from '../../global/components/Buttons';

const Container = styled.div`
  grid-column: 10 / end;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
`;

const PlayContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Description = styled.label`
  font-size: 1.5rem;
  color: ${colors.white};
`;

const Input = styled.input`
  font-size: 1.5rem;
  color: ${colors.secondary};
  width: 30%;
`;

type ControlsProps = {
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  randomize: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function Controls({
  speed,
  setSpeed,
  amount,
  setAmount,
  randomize,
}: ControlsProps): JSX.Element {
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <Container>
      <PlayContainer>
        <SkipBackIcon />
        <PlayIcon />
        <SkipForwardIcon />
      </PlayContainer>
      <ControlContainer>
        <Description htmlFor='speed'>Speed:</Description>
        <Input
          id='speed'
          name='speed'
          value={`${speed}`}
          onChange={handleSpeedChange}
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
          onChange={handleAmountChange}
          type='number'
          min={3}
          step={1}
          max={TOTAL_POINTS / 5} // Accept less than a fifth of the total possible amount of points
        />
      </ControlContainer>
      <Button color='secondary' onClick={randomize}>
        Randomize
      </Button>
    </Container>
  );
}

export default Controls;
