import { useFileStorageStore } from '../../../../Store/FileStorageStore';
import * as S from './styles';

export interface SearchFilterProps {
  isActive: boolean
}

export const SearchFilter = ({ isActive }: SearchFilterProps) => {
  const value = useFileStorageStore(store => store.filteredValue);
  const setValue = useFileStorageStore(store => store.setFilteredValue);

  return (
    <S.Input
      placeholder='Search'
      $isActive={isActive}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => e.stopPropagation()}
    />
  );
}