import { useFileStorageStore } from '../../../Store/FileStorageStore.ts';
import { ButtonIcon } from '../../ButtonIcon/index.tsx';
import * as S from './styles.ts';
import { Icon } from '@iconify/react';

export const ActionToolbar = () => {
  const createNewFile = useFileStorageStore(state => state.createNewFile);
  const createNewFolder = useFileStorageStore(state => state.createNewFolder);

  const hasSelection = useFileStorageStore(state => state.selectedItemIds.length > 0);

  return (
  <S.Container>
    <ButtonIcon disabled={!hasSelection}>
      <Icon icon="gg:rename" />
    </ButtonIcon>

    <ButtonIcon disabled={!hasSelection}>
      <Icon icon="mingcute:delete-2-line" />
    </ButtonIcon>

    <S.DividerContainer>
      <Icon icon="pepicons-pop:line-y" />
    </S.DividerContainer>

    <ButtonIcon onClick={createNewFolder}>
      <Icon icon="mingcute:new-folder-line" />
    </ButtonIcon>
    <ButtonIcon onClick={createNewFile}>
      <Icon icon="mingcute:file-new-line" />
    </ButtonIcon>

    <S.DividerContainer>
      <Icon icon="pepicons-pop:line-y" />
    </S.DividerContainer>

    <ButtonIcon>
      <Icon icon="mingcute:hand-heart-line" />
    </ButtonIcon>
    <ButtonIcon>
      <Icon icon="mingcute:code-fill" />
    </ButtonIcon>
  </S.Container>
  )
}