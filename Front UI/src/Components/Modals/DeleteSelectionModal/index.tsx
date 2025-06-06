import { useFileStore } from '@Store/useFileStore';
import { useModalStore } from '@Store/useModalStore';
import * as S from './styles';

export const DeleteSelectionModal = () => {
  const selectedItemIds = useFileStore(state => state.selectedItemIds);
  const deleteSelection = useFileStore(state => state.deleteSelection);
  const closeModal = useModalStore(state => state.closeModal);

  const onYesClicked = async () => {
    closeModal();
    await deleteSelection();
  };

  const onNoClicked = () => {
    closeModal();
  };

  return (
    <S.Container>
      <S.LabelContainers>
        <span>Are you sure you want to delete?</span>
        <S.ItemCountLabel>{selectedItemIds.length}</S.ItemCountLabel>
        <span>
          { selectedItemIds.length > 1 ? 'Items' : 'Item' }
        </span>
      </S.LabelContainers>

      <S.ButtonContainer>
        <button onClick={onYesClicked} type='button'>Delete</button>
        <button onClick={onNoClicked} type='button'>Cancel</button>
      </S.ButtonContainer>
    </S.Container>
  );
};