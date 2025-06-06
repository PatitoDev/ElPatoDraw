import { useTheme } from 'styled-components';
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef } from 'react';

import * as S from './styles';
import { useFileStore } from '@Store/useFileStore';
import { SelectionBox } from './SelectionBox';
import { ExplorerToolbar } from './ExplorerToolbar';
import { Item } from './Item';
import { FileExplorerFooter } from './FileExplorerFooter';
import { SearchToolbar } from './SearchToolbar';

export const FileExplorer = () => {
  const isFilterActive = useFileStore(store => store.isFilterActive);
  const filteredRegexValue = useFileStore(state => state.filteredRegexValue);
  const gridRef = useFileStore(state => state.itemContainerRef);
  const folder = useFileStore(state => state.currentFolder);
  const theme = useTheme();
  const loadCounter = useRef<number>(0);

  useEffect(() => {
    loadCounter.current = 0;
  }, [folder?.metadata?.id]);

  loadCounter.current += 1;
  // item index sets the animation delay, but we only want to have some animation delay on the 'first' folder load
  // so after that we disable the delay so that when the user adds a file/folder there is no animation delay

  const filteredFolder = useMemo(() => {
    if (!isFilterActive) {
      return {
        files: folder?.files ?? [],
        folders: folder?.folders ?? []
      };
    }

    const files = (folder?.files ?? []).filter(f =>
      filteredRegexValue ? filteredRegexValue.test(f.name) : f
    );

    const folders = (folder?.folders ?? []).filter(f =>
      filteredRegexValue ? filteredRegexValue.test(f.name) : f
    );

    return { files, folders };
  }, [filteredRegexValue, folder, isFilterActive]);

  const isFolderEmpty = (!folder || (folder.files.length === 0 && folder.folders.length === 0));
  const nothingFound = !isFolderEmpty && filteredFolder.files.length === 0 && filteredFolder.folders.length === 0;

  return (
    <S.Container>

      <ExplorerToolbar />
      <SearchToolbar />

      { isFolderEmpty && (
        <S.NoContent>
          <Icon fontSize='3em' icon='mingcute:folder-open-2-line' />
          <span>This folder is empty</span>
        </S.NoContent>
      )}

      { nothingFound && (
        <S.NoContent>
          <Icon fontSize='3em' icon='mingcute:folder-open-2-line' />
          <span>Nothing found</span>
        </S.NoContent>
      )}

      { !isFolderEmpty && !nothingFound && (
        <S.FileGrid ref={gridRef}>
          <SelectionBox />

          {filteredFolder.folders.map((f, index) => (
            <Item
              index={loadCounter.current < 2 ? index : 0}
              id={f.id}
              key={f.id}
              color={f.color ?? theme.colors.defaultFolderColor}
              name={f.name}
              type='Folder'
            />
          ))}

          {filteredFolder.files.map((f, index) => (
            <Item
              index={loadCounter.current < 2 ? index + filteredFolder.folders.length : 0}
              id={f.id}
              key={f.id}
              name={f.name}
              type='File'
              color={f.color ?? theme.colors.defaultFileColor}
            />
          ))}
        </S.FileGrid>
      )}

      <FileExplorerFooter />
    </S.Container>
  );
};
