import styled from "styled-components";

export const Container = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
`;

export const SelectionArea = styled.div`
  position: absolute;

  display: block;

  background-color: ${({ theme }) => theme.colors.selectionBoxBackground};
  border: solid 2px ${({ theme }) => theme.colors.selectionBoxBorderColor};
  border-radius: 0.2em;

  top: attr(data-top px);
  left: attr(data-left px);
  width: attr(data-width px);
  height: attr(data-height px);
`;

export const DraggedItems = styled.div`
  position: absolute;

  display: block;

  background-color: ${({ theme }) => theme.colors.foreground};
  border: solid 2px ${({ theme }) => theme.colors.foregroundLight};
  border-radius: 0.2em;

  top: attr(data-top px);
  left: attr(data-left px);
  
  width: 4em;
  height: 5em;
`;
