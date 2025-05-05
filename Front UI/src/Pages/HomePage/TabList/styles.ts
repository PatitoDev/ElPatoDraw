import styled, { css } from 'styled-components';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.accent};
  display: flex;
  padding-top: 1em;
  align-items: center;
  gap: 0.5em;

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
    `
    :
    css`
      transform: translateY(0.5em);
      color: ${({ theme }) => theme.colors.notSelectedTabColor};
      background-color: ${({ theme }) => theme.colors.notSelectedTabBackground};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.notSelectedTabBackground};
    `
}
  transition:
    opacity 0.15s cubic-bezier(0, 0.82, 0.165, 2),
    transform 0.15s cubic-bezier(0, 0.82, 0.165, 2),
    background-color 0.15s cubic-bezier(0, 0.82, 0.165, 2)
  ;
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
`;

export const Tab = styled.div<{ $selected: boolean, $fileColor: string }>`
  ${({ $selected }) => $selected ? 
    css`
      transform: translateY(0);
      background-color: ${({ theme }) => theme.colors.background};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.background};
    `
    :
    css`
      transform: translateY(0.5em);
      color: ${({ theme }) => theme.colors.notSelectedTabColor};
      background-color: ${({ theme }) => theme.colors.notSelectedTabBackground};
      box-shadow: 0 10px 0 ${({ theme }) => theme.colors.notSelectedTabBackground};
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