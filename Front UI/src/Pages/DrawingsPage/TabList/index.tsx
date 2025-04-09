import * as S from './styles';
import { Icon } from '@iconify/react';
import { ButtonIcon } from '../../../Components/ButtonIcon';
import { useFileStorageStore } from '../../../Store/FileStorageStore';
import { useTheme } from 'styled-components';

export interface TabListProps {
}

export const TabList = () => {
  const theme = useTheme();
  const activeFiles = useFileStorageStore(state => state.activeFiles);
  const closeFile = useFileStorageStore(state => state.closeFile);
  const openFile  = useFileStorageStore(state => state.openFile);
  const showExplorer  = useFileStorageStore(state => state.showExplorer);
  const fileIdCurrentlyEditing  = useFileStorageStore(state => state.fileIdCurrentlyEditing);

  const onCloseFileClick = (fileId: string) => {
    closeFile(fileId);
  }

  return (
    <S.Container>
      <S.HomeTab 
        $selected={fileIdCurrentlyEditing === null}
      >
        <S.TabButton
          title="open"
          $selected={fileIdCurrentlyEditing === null}
          onClick={() => showExplorer() }
        />
        <img width={40} height={40} src="/ElPatoDrawLogo.svg" />
      </S.HomeTab>

      {
        activeFiles.map(f => (
          <S.Tab
            key={f.id}
            $selected={f.id === fileIdCurrentlyEditing}
            $fileColor={theme.colors.defaultFileColor}
          >
            <Icon icon="mingcute:file-fill" />
            <span>{f.name}</span>

            <S.TabButton
              title="open"
              $selected={fileIdCurrentlyEditing === null}
              onClick={() => openFile(f.id)}
            />

            <ButtonIcon title="close" onClick={() => onCloseFileClick(f.id)}>
              <Icon icon="mingcute:close-fill" />
            </ButtonIcon>
          </S.Tab>
        ))
      }
    </S.Container>
  )

}