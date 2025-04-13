import styled from 'styled-components';

export const ButtonIcon = styled.button`
  font-size: 2.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.8;

  width: 1em;
  height: 1em;

  border-radius: 0.1em;
  outline: none;
  border: none;
  background-color: transparent;

  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out
  ;

  &:hover:not(:disabled) {
    cursor: pointer;
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }

  &:disabled {
    opacity: 0.4;
  }
`;