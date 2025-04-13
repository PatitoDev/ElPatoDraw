import { useFileStorageStore } from '../../../Store/FileStorageStore.ts';
import { ButtonIcon } from '../../ButtonIcon/index.tsx';
import * as S from './styles.ts';
import { Icon } from '@iconify/react';

export const ActionToolbar = () => {
  const createNewFile = useFileStorageStore(state => state.createNewFile);
  const createNewFolder = useFileStorageStore(state => state.createNewFolder);

  const deleteSelection = useFileStorageStore(state => state.deleteSelection);

  const hasSelection = useFileStorageStore(state => state.selectedItemIds.length > 0);

  const onDeleteClick:React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    await deleteSelection();
  }

  return (
  <S.Container>
    <ButtonIcon disabled={!hasSelection}>
      <Icon icon="gg:rename" />
    </ButtonIcon>

    <ButtonIcon disabled={!hasSelection} onClick={onDeleteClick}>
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

    <S.LinkButton href='https://github.com'>
      <Icon icon="mingcute:hand-heart-line" />
    </S.LinkButton>

    <S.LinkButton href='aaa'>
      <Icon icon="mingcute:code-fill" />
    </S.LinkButton>
  </S.Container>
  )
}