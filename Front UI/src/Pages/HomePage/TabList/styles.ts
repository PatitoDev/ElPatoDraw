import styled, { css } from 'styled-components';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.accent};
  display: flex;
  padding-top: 1em;
  align-items: center;
  gap: 0.8em;

  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const HomeTab = styled.div<{ $selected: boolean }>`
  ${({ $selected }) => $selected ?
    css`
      transform: translateY(0);
      background-color: ${({ theme }) => theme.colors.background};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.background};
      &:after {
        opacity: 1;
      }
    `
    :
    css`
      transform: translateY(0.5em);
      color: ${({ theme }) => theme.colors.notSelectedTabColor};
      background-color: ${({ theme }) => theme.colors.notSelectedTabBackground};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.notSelectedTabBackground};
      &:after {
        opacity: 0;
      }
    `
}
  transition:
    opacity 0.15s cubic-bezier(0, 0.82, 0.165, 2),
    transform 0.15s cubic-bezier(0, 0.82, 0.165, 2),
    background-color 0.15s cubic-bezier(0, 0.82, 0.165, 2)
  ;
  &:after {
    transition: opacity 0.15s;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0.5em 0 0;
  padding: 0.5em;
  font-size: 1.8em;
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    transform: translateY(0);
  }

  &:after {
    right: -10px;
    bottom: 0;
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.background };
    mask: radial-gradient(100% 100% at top right,rgb(0 0 0/0%) 100%,rgb(0 0 0/100%));
  }
`;

export const Tab = styled.div<{ $selected: boolean, $fileColor: string }>`
  ${({ $selected }) => $selected ?
    css`
      transform: translateY(0);
      background-color: ${({ theme }) => theme.colors.background};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.background};
      &:after, &:before {
        opacity: 1;
      }
    `
    :
    css`
      transform: translateY(0.5em);
      color: ${({ theme }) => theme.colors.notSelectedTabColor};
      background-color: ${({ theme }) => theme.colors.notSelectedTabBackground};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.notSelectedTabBackground};
      &:after, &:before {
        opacity: 0;
      }
    `
}

  align-self: flex-end;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1em 0.5em 1em;
  gap: 0.5em;
  border-radius: 0.5em 0.5em 0 0;

  cursor: pointer;
  transition:
    opacity 0.20s cubic-bezier(0, 0.82, 0.165, 2),
    transform 0.20s cubic-bezier(0, 0.82, 0.165, 2),
    background-color 0.15s cubic-bezier(0, 0.82, 0.165, 2)
  ;

  &:hover {
    transform: translateY(0);
  }

  > svg:first-child {
    color: ${({ $fileColor }) => $fileColor };
    font-size: 1.3em;
  }

  > :last-child {
    z-index: 2;
    margin-left: 0.5em;
    ${({ $selected }) => !$selected && css`
      opacity: 0;
      &:hover {
        opacity: 1;
      }
    `}
  }

  &:after {
    right: -10px;
    bottom: 0;
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.background };
    mask: radial-gradient(100% 100% at top right,rgb(0 0 0/0%) 100%,rgb(0 0 0/100%));
    transition: opacity 0.20s;
  }

  &:before {
    left: -10px;
    bottom: 0;
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.background };
    mask: radial-gradient(100% 100% at top left,rgb(0 0 0/0%) 100%,rgb(0 0 0/100%));
    transition: opacity 0.20s;
  }
`;

export const TabButton = styled.button<{ $selected: boolean }>`
  cursor: pointer;
  opacity: 0;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;