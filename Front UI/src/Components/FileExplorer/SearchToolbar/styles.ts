import styled, { css } from 'styled-components';

export const Container = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 2px 0 1em 1em;

  position: relative;
  overflow: hidden;
  transform: translateY(-3em);
  max-height: 0;

  transition: all 0.2s ease-in-out;

  z-index: 1;
  border-bottom: solid 1px #ffffff24;

  ${({ $isActive }) => $isActive && css`
    transform: translateY(0);
    max-height: 5em;
  `}

  > input {
    border-radius: 0.3em;
    font-family: inherit;
    padding: 0.5em;
    border: solid 1px #4b5b66;
    background-color: #1b1f24;
    color: ${({ theme }) => theme.colors.foreground};
    &::placeholder {
      color: #c3c3c3;
    }

    &:focus-within,
    &:focus-visible,
    &:focus {
      outline: solid 1.5px ${({ theme }) => theme.colors.foreground };
    }
  }
`;