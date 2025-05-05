import { Icon } from '@iconify/react';

import * as S from './styles';
import { useFileStore } from '@Store/useFileStore';
import { ButtonIcon } from '@Components/Core/ButtonIcon';


export const SearchToolbar = () => {
  const isActive = useFileStore(store => store.isFilterActive);
  const value = useFileStore(store => store.filteredValue);
  const setValue = useFileStore(store => store.setFilteredValue);
  const filterOptions = useFileStore(store => store.filterOptions);
  const setFilterOptions = useFileStore(store => store.setFilterOptions);

  return (
    <S.Container $isActive={isActive}>
      <ButtonIcon
        title='Case Sensitive'
        aria-checked={filterOptions.caseSensitive}
        type='button'
        $isActive={filterOptions.caseSensitive}
        onClick={() => {
          setFilterOptions({ caseSensitive: !filterOptions.caseSensitive });
        }}
      >
        <Icon aria-hidden icon='mingcute:font-size-line' />
      </ButtonIcon>
      <input
        name='File filter'
        type='text'
        placeholder='Search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={(e) => e.stopPropagation()}
      />
    </S.Container>
  );
};