import styled from 'styled-components';
import { ButtonIcon } from '../../ButtonIcon';

export const Container = styled.div`
  display: flex;
  margin: 0 0.5em;
  gap: 0.5em;
`;

export const DividerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 2.2em;
  width: 0.5em;
  height: 1em; 
`;

export const LinkButton = styled.a`
  display: inline-flex;
  font-size: 2.2em;
  padding: 0.5em;

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
`;