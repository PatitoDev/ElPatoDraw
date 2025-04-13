import * as S from './styles';
import { ButtonIcon } from "../../ButtonIcon"
import { Icon } from '@iconify/react';
import { useFileStorageStore } from '../../../Store/FileStorageStore';
import { useState } from 'react';


interface PathActionButtonProps {
  children: string,
  folderId: string | null
}

const PathActionButton = ({
  children,
  folderId
}: PathActionButtonProps) => {

  const moveSelectionToFolder = useFileStorageStore(state => state.moveSelectionToFolder);
  const changeToFolder = useFileStorageStore(state => state.changeToFolder);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDragEnter: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  const onDragLeave: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }

  const onDragOver: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

  }

  const onDrop: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    moveSelectionToFolder(folderId)
  }

  return (
    <S.PathButton 
      $isDraggingOver={isDraggingOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => changeToFolder(folderId)}
    >
    {children}
    </S.PathButton>
  )
}


export const ExplorerPath = () => {
  const currentFolder = useFileStorageStore(state => state.currentFolder);
  const navigateToParentFolder = useFileStorageStore(state => state.navigateToParentFolder);
  const changeToFolder = useFileStorageStore(state => state.changeToFolder);

  const onDragOver: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

  }

  const onDrop: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

  }

  return (
    <S.Container>
      {/*
      TODO
      <ButtonIcon title='Search'>
        <Icon icon="mingcute:search-2-fill" />
      </ButtonIcon>
      */}

      <ButtonIcon 
        title='Back'
        disabled={currentFolder?.isHomeDirectory} 
        onClick={navigateToParentFolder}
      >
        <Icon icon="mingcute:arrow-up-fill" />
      </ButtonIcon>

      <ButtonIcon 
        title='Home'
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => changeToFolder(null)}
      >
        <Icon icon="mingcute:home-3-line" />
      </ButtonIcon>

      {
        currentFolder &&
        (
          currentFolder.isHomeDirectory ||
          currentFolder.metadata?.parentFolder === null
        ) && (
          <PathActionButton folderId={null}>
            Home
          </PathActionButton>
        )
      }

      {
        // if metadate then its not home folder
        currentFolder && currentFolder.metadata?.parentFolder && (
          <PathActionButton folderId={currentFolder.metadata?.parentFolder?.id ?? null}>
            {currentFolder.metadata.parentFolder.name}
          </PathActionButton>
        )
      }

      {
        // if metadate then its not home folder
        currentFolder && currentFolder.metadata && (
          <>
            <Icon icon="mingcute:right-fill" />
            <PathActionButton folderId={currentFolder.metadata?.id ?? null}
            >
              {currentFolder.metadata.name}
            </PathActionButton>
          </>
        )
      }

    </S.Container>
  )
}