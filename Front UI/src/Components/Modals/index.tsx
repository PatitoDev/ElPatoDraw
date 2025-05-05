import { useEffect, useRef } from 'react';

import * as S from './styles';
import { DeleteSelectionModal } from './DeleteSelectionModal';
import { useModalStore } from '@Store/useModalStore';


export const Modals = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = useModalStore(store => store.isOpen);
  const closeModal = useModalStore(store => store.closeModal);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.target === containerRef.current){
        closeModal();
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [closeModal, containerRef]);

  if (!isOpen) return null;

  return (
    <S.ModalContainer ref={containerRef}>
      <DeleteSelectionModal />
    </S.ModalContainer>
  );
};