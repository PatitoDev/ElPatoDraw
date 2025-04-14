import styled from 'styled-components';
import { keyframes } from 'styled-components';

const ShowModalAnimation = keyframes`
  0% {
    opacity: 0.6;
    transform: translateY(-20px);
  },
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  animation: ${ShowModalAnimation} 0.2s both;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  gap: 1.5em;
  border-radius: 0.5em;
}
`;

export const LabelContainers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
`;

export const ItemCountLabel = styled.div`
  font-size: 2em;
  font-weight: medium;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;

  > button {
    padding: 1em 2em;
    border-radius: 0.5em;
    text-align: center;
    font-family: inherit;
    cursor: pointer;
    border: none;

    &:first-child {
      background-color: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.foreground};
      outline: none;
    }

    &:last-child {
      outline: solid 0.2em ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.background};
      background-color: transparent;
    }
  }
`;
