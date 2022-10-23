import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

import { darken } from '../styles/helpers';

const StyledButton = styled.button<Pick<ButtonProps, 'color'>>`
  color: ${colors.white};
  border-radius: 15px;
  background-color: ${({ color }) => colors[color]};
  font-size: 1.25rem;
  padding: 10px 25px;

  &:hover {
    ${darken(0.1)}
    cursor: pointer;
  }
`;

type AvailableColors = 'primary' | 'secondary';

type ButtonProps = {
  children: string | undefined;
  color: AvailableColors;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({ children, color, onClick }: ButtonProps): JSX.Element {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick(e);
  };

  return (
    <StyledButton onClick={handleClick} color={color}>
      {children}
    </StyledButton>
  );
}

export default Button;
