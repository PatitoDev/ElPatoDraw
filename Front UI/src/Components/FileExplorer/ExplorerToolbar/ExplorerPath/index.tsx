import { Icon } from '@iconify/react';
import { useState } from 'react';

import * as S from './styles';
import { useFileStore } from '@Store/useFileStore';
import { ButtonIcon } from '@Core/ButtonIcon';
import { PathActionButton } from './PathActionButton';
import { SearchFilter } from './SearchFilter';


export const ExplorerPath = () => {
  const [isFilterActive, setIsFilterActive] = useState(false);

  const currentFolder = useFileStore(state => state.currentFolder);
  const navigateToParentFolder = useFileStore(state => state.navigateToParentFolder);
  const changeToFolder = useFileStore(state => state.changeToFolder);

  const onDragOver: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
  };

  const onDrop: React.DragEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
  };

  return (
    <S.Container>
      <ButtonIcon
        type='button'
        title='Search'
        onClick={() => setIsFilterActive(v => !v)}
      >
        <Icon icon='mingcute:search-2-fill' />
      </ButtonIcon>

      <SearchFilter isActive={isFilterActive} />

      <ButtonIcon
        title='Back'
        type='button'
        disabled={currentFolder?.isHomeDirectory}
        onClick={navigateToParentFolder}
      >
        <Icon icon='mingcute:arrow-up-fill' />
      </ButtonIcon>

      <ButtonIcon
        title='Home'
        type='button'
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => changeToFolder(null)}
      >
        <Icon icon='mingcute:home-3-line' />
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
            <Icon icon='mingcute:right-fill' style={{ marginTop: '3px' }} />
            <PathActionButton folderId={currentFolder.metadata?.id ?? null}
            >
              {currentFolder.metadata.name}
            </PathActionButton>
          </>
        )
      }

    </S.Container>
  );
};