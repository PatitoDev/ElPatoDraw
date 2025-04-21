import * as S from './styles';
import { Icon } from '@iconify/react';
import { ButtonIcon } from '../../../Components/ButtonIcon';
import { useFileStorageStore } from '../../../Store/FileStorageStore';
import { useTheme } from 'styled-components';

export const TabList = () => {
  const theme = useTheme();
  const activeFiles = useFileStorageStore(state => state.activeFiles);
  const closeFile = useFileStorageStore(state => state.closeFile);
  const openFile  = useFileStorageStore(state => state.openFile);
  const showExplorer  = useFileStorageStore(state => state.showExplorer);
  const fileIdCurrentlyEditing  = useFileStorageStore(state => state.fileIdCurrentlyEditing);

  return (
    <S.Container>
      <S.HomeTab
        $selected={fileIdCurrentlyEditing === null}
      >
        <S.TabButton
          title='Open home folder'
          $selected={fileIdCurrentlyEditing === null}
          onClick={() => showExplorer() }
        />
        <Icon aria-hidden icon='mingcute:folders-line' />
      </S.HomeTab>

      {
        activeFiles.map(f => (
          <S.Tab
            key={f.id}
            $selected={f.id === fileIdCurrentlyEditing}
            $fileColor={f.color ?? theme.colors.defaultFileColor}
          >
            <Icon aria-hidden icon='mingcute:file-fill' />
            <span>{f.name}</span>

            <S.TabButton
              title='open'
              $selected={fileIdCurrentlyEditing === null}
              onClick={() => openFile(f.id)}
            />

            <ButtonIcon title='close' onClick={async () => await closeFile(f.id)}>
              <Icon icon='mingcute:close-fill' />
            </ButtonIcon>
          </S.Tab>
        ))
      }
    </S.Container>
  );
};