import { useState } from 'react';

import { useFileStore } from '@Store/useFileStore';
import * as S from './styles';


export interface PathActionButtonProps {
  children: string,
  folderId: string | null
}

export const PathActionButton = ({
  children,
  folderId
}: PathActionButtonProps) => {
  const moveSelectionToFolder = useFileStore(state => state.moveSelectionToFolder);
  const changeToFolder = useFileStore(state => state.changeToFolder);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDragEnter: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const onDragOver: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

  };

  const onDrop: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    moveSelectionToFolder(folderId);
  };

  return (
    <S.PathButton
      type='button'
      $isDraggingOver={isDraggingOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => changeToFolder(folderId)}
    >
      {children}
    </S.PathButton>
  );
};