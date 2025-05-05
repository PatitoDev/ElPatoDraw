import styled from 'styled-components';

export const SelectionArea = styled.div`
  z-index: 5;
  position: absolute;

  display: block;

  background-color: ${({ theme }) => theme.colors.selectionBoxBackground};
  border: solid 2px ${({ theme }) => theme.colors.selectionBoxBorderColor};
  border-radius: 0.2em;
`;

