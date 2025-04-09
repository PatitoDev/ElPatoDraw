import * as S from './styles';
import { ButtonIcon } from "../../ButtonIcon"
import { Icon } from '@iconify/react';
import { useFileStorageStore } from '../../../Store/FileStorageStore';

export const ExplorerPath = () => {
  const currentFolder = useFileStorageStore(state => state.currentFolder);
  const navigateToParentFolder = useFileStorageStore(state => state.navigateToParentFolder);
  const changeToFolder = useFileStorageStore(state => state.changeToFolder);

  return (
    <S.Container>
      <ButtonIcon>
        <Icon icon="mingcute:search-2-fill" />
      </ButtonIcon>

      <ButtonIcon disabled={currentFolder?.isHomeDirectory} onClick={navigateToParentFolder}>
        <Icon icon="mingcute:arrow-up-fill" />
      </ButtonIcon>

      <ButtonIcon onClick={() => changeToFolder(null)}>
        <Icon icon="mingcute:home-3-line" />
      </ButtonIcon>

      {
        currentFolder &&
        (
          currentFolder.isHomeDirectory ||
          currentFolder.metadata?.parentFolder === null
        ) && (
          <S.PathButton 
            onClick={() => changeToFolder(null)}
          >
            Home
          </S.PathButton>
        )
      }

      {
        // if metadate then its not home folder
        currentFolder && currentFolder.metadata?.parentFolder && (
          <S.PathButton 
            onClick={() => changeToFolder(currentFolder.metadata?.parentFolder?.id ?? null)}
          >
            {currentFolder.metadata.parentFolder.name}
          </S.PathButton>
        )
      }

      {
        // if metadate then its not home folder
        currentFolder && currentFolder.metadata && (
          <>
            <Icon icon="mingcute:right-fill" />
            <S.PathButton 
              onClick={() => changeToFolder(currentFolder.metadata?.id ?? null)}
            >
              {currentFolder.metadata.name}
            </S.PathButton>
          </>
        )
      }



    </S.Container>
  )
}