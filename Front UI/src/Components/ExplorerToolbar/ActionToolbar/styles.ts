import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin: 0 0.5em;
  gap: 0.5em;
`;

export const DividerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 25px;
  width: 20px;
  height: 35px;
`;

export const LinkButton = styled.a`
  display: inline-flex;
  font-size: 25px;

  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.8;

  width: 35px;
  height: 35px;

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
`;

export const LabelButton = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  font-size: 20px;

  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.8;

  width: 35px;
  height: 35px;

  border-radius: 0.1em;
  outline: none;
  border: none;
  background-color: transparent;

  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out
  ;
  ${({ $disabled }) => $disabled && css`
    opacity: 0.4;
  `}

  ${({ $disabled }) => !$disabled && css`
    &:hover {
      cursor: pointer;
      opacity: 1;
      background-color: ${({ theme }) => theme.colors.backgroundLight};
    }
  `}
`;
