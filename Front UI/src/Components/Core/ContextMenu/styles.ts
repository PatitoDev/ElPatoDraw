import styled, { css } from 'styled-components';

export const Container = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const MenuContainer = styled.div<{ $isOpen: boolean }>`
  z-index: 99999;

  ${({ $isOpen }) => !$isOpen && css`
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
  `}

  ${({ $isOpen }) => $isOpen && css`
    opacity: 1;
    transform: scale(1.0);
  `}

  transform-origin: top left;
  transition:
    opacity 0.05s ease-in-out,
    transform 0.05s ease-in-out
  ;

  position: absolute;

  backdrop-filter: blur(5px);
  background-color: #37373f99;
  outline: solid 2px #464c4e;
  box-shadow: 0 0 9px 0 #000000de;

  border-radius: 0.5em;
  padding: 0.3em;

  width: 10em;

  display: flex;
  flex-direction: column;
  gap: 0.5em;

  > button {
    display: flex;
    align-items: center;
    gap: 0.5em;
    > svg {
      font-size: 1.5em;
    }

    color: white;

    width: 100%;
    padding: 0.5em;

    font-family: inherit;
    font-size: 0.9em;

    text-align: left;
    border-radius: 0.3em;
    outline: none;
    border: none;
    background-color: transparent;

    cursor: pointer;

    &:hover {
      background-color: rgba(255,255,255, 0.2);
    }
  }

`;