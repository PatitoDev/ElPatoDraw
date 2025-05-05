import { useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from 'styled-components';

import { ButtonIcon } from '@Components/Core/ButtonIcon';
import { MIDDLE_MOUSE_BTN } from '@/buttons';
import { useFileStore } from '@Store/useFileStore';
import * as S from './styles';

export const TabList = () => {
  const theme = useTheme();
  const openedFiles = useFileStore(state => state.openedFiles);
  const closeFile = useFileStore(state => state.closeFile);
  const openFile  = useFileStore(state => state.openFile);
  const showExplorer  = useFileStore(state => state.showExplorer);
  const focusedFileId = useFileStore(state => state.focusedFileId);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>, fileId: string) => {
    if (e.button !== MIDDLE_MOUSE_BTN) return;
    e.preventDefault();
    closeFile(fileId);
  }, [closeFile]);

  return (
    <S.Container>
      <S.HomeTab
        $selected={focusedFileId === null}
      >
        <S.TabButton
          title='Open home folder'
          $selected={focusedFileId === null}
          onClick={() => showExplorer() }
        />
        <Icon aria-hidden icon='mingcute:folders-line' />
      </S.HomeTab>

      {
        openedFiles.map(f => (
          <S.Tab
            key={f.id}
            $selected={f.id === focusedFileId}
            $fileColor={f.color ?? theme.colors.defaultFileColor}
          >
            <Icon aria-hidden icon='mingcute:file-fill' />
            <span>{f.name}</span>

            <S.TabButton
              title='open'
              $selected={focusedFileId === null}
              onClick={() => openFile(f.id)}
              onMouseDown={(e) => onMouseDown(e, f.id)}
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