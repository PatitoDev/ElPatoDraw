import { useEffect, useRef } from 'react';
import { useFileStorageStore } from '../../../Store/FileStorageStore.ts';
import { ButtonIcon } from '../../ButtonIcon/index.tsx';
import * as S from './styles.ts';
import { Icon } from '@iconify/react';
import { useDebounce } from '../../../hooks/useDebounce.ts';
import { useModalStore } from '../../../Store/ModalStore.ts';

export const ActionToolbar = () => {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const createNewFile = useFileStorageStore(state => state.createNewFile);
  const createNewFolder = useFileStorageStore(state => state.createNewFolder);

  const selectionCount = useFileStorageStore(state => state.selectedItemIds.length);
  const hasSelection = selectionCount > 0;

  const onEditName = useFileStorageStore(state => state.editSelectionName);
  const updateColorToSelection = useFileStorageStore(state => state.updateColorToSelection);
  const setSelectedColor = useFileStorageStore(state => state.setSelectedColor);
  const selectedColor = useFileStorageStore(state => state.selectedColor);

  const openModal = useModalStore(state => state.openModal);

  const debouncedValue = useDebounce(selectedColor, 500);

  useEffect(() => {
    if (!debouncedValue) return;
    updateColorToSelection();
  }, [debouncedValue, updateColorToSelection]);

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    openModal();
  };

  const onColorClick = () => {
    if (!colorPickerRef.current) return;
    colorPickerRef.current.click();
  };

  const onColorChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!colorPickerRef.current) return;
    setSelectedColor(e.target.value);
  };

  return (
    <S.Container>
      <S.LabelButton
        $disabled={!hasSelection}
        htmlFor='input-color-picker'
        title='Change color'
        onClick={onColorClick}
      >
        <S.ColorPicker
          id='input-color-picker'
          disabled={!hasSelection}
          onChange={onColorChange}
          type='color'
          ref={colorPickerRef}
        />
        <Icon icon='mingcute:palette-line' />
      </S.LabelButton>

      <ButtonIcon
        title='Rename selected'
        disabled={selectionCount !== 1}
        onClick={onEditName}
        type='button'
      >
        <Icon icon='gg:rename' />
      </ButtonIcon>

      <ButtonIcon
        title='Delete selection'
        disabled={!hasSelection}
        onClick={onDeleteClick}
        type='button'
      >
        <Icon icon='mingcute:delete-2-line' />
      </ButtonIcon>

      <S.DividerContainer aria-hidden>
        <Icon icon='pepicons-pop:line-y' />
      </S.DividerContainer>

      <ButtonIcon type='button' title='New folder' onClick={createNewFolder}>
        <Icon icon='mingcute:new-folder-line' />
      </ButtonIcon>
      <ButtonIcon type='button' title='New file' onClick={() => createNewFile('TlDraw')}>
        <Icon icon='mingcute:file-new-line' />
      </ButtonIcon>

      <S.DividerContainer aria-hidden>
        <Icon icon='pepicons-pop:line-y' />
      </S.DividerContainer>

      <S.LinkButton
        title='Support me :3'
        href='https://ko-fi.com/patitodev'
        target='_blank'
      >
        <Icon icon='mingcute:hand-heart-line' />
      </S.LinkButton>

      <S.LinkButton
        title='Source code'
        href='https://github.com/PatitoDev/ElPatoDraw'
        target='_blank'
      >
        <Icon icon='mingcute:code-line' />
      </S.LinkButton>
    </S.Container>
  );
};