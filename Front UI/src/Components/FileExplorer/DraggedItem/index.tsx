import { forwardRef } from 'react';
import styled from 'styled-components';

import { useFileStore } from '@Store/useFileStore';


const Container = styled.div`
  transform: translate(-2000px, -2000px);
  z-index: -99;
  position: absolute;
  background-color: white;
  width: 50px;
  height: 50px;
  color: black;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export const DraggedItem = forwardRef<HTMLDivElement>((_, ref) => {
  const selectedItemIds = useFileStore(store => store.selectedItemIds);

  return (
    <Container ref={ref}>
      {selectedItemIds.length}
    </Container>
  );
});

DraggedItem.displayName = 'DraggedItem';