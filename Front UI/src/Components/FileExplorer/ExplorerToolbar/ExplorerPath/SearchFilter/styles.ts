import styled, { css } from 'styled-components';

export const Input = styled.input<{
  $isActive: boolean
}>`
  padding: 1em;
  position: absolute;
  top: 3em;

  color: ${({ theme }) => theme.colors.background };
  background-color: ${({ theme }) => theme.colors.foreground };
  outline: none;
  border: none;
  border-radius: 0.3em;
  z-index: 100;

  transition: all 0.2s ease-in-out;
  transform: translateY(-10em);

  ${({ $isActive }) => $isActive && css`
    transform: translateY(0);
  `}
`;