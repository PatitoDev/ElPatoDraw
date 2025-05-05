import { useMemo } from 'react';
import { Icon } from '@iconify/react';

import * as S from './styles';
import { useFileStore } from '@Store/useFileStore';


export const FileExplorerFooter = () => {
  const currentFolder = useFileStore(store => store.currentFolder);
  const itemCount = useMemo(() => (
    (currentFolder?.files.length ?? 0) + (currentFolder?.folders.length ?? 0)
  ), [currentFolder]);

  const selectedItemCount = useFileStore(store => store.selectedItemIds.length);

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