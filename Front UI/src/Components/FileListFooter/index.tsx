import { useMemo } from 'react';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import * as S from './styles';
import { Icon } from '@iconify/react';


export const FileListFooter = () => {
  const currentFolder = useFileStorageStore(store => store.currentFolder);
  const itemCount = useMemo(() => (
    (currentFolder?.files.length ?? 0) + (currentFolder?.folders.length ?? 0)
  ), [currentFolder]);

  const selectedItemCount = useFileStorageStore(store => store.selectedItemIds.length);

  return (
    <S.Container>
      <span>
        {itemCount} items
      </span>

      {selectedItemCount > 0 && (
        <>
          <Icon aria-hidden icon='pepicons-pop:line-y' />
          <span>
            {selectedItemCount} item{selectedItemCount === 1 ? '' : 's'} selected
          </span>
        </>
      )}
    </S.Container>
  );
};