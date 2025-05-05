import styled from 'styled-components';
import { useMemo } from 'react';

import { useFileStore } from '@/Store/useFileStore';


export interface ItemNameLabelProps {
  itemName: string
}

interface ItemNamePart {
  value: string,
  isFilteredSection: boolean
};

const FilteredNamePart = styled.span`
  background-color: ${({ theme }) => theme.colors.foreground };
  color: ${({ theme }) => theme.colors.background};
`;

export const ItemNameLabel = ({ itemName }: ItemNameLabelProps) => {
  const filteredRegexValue = useFileStore(store => store.filteredRegexValue);
  const isFilterActive = useFileStore(store => store.isFilterActive);

  const itemNameMapped: Array<ItemNamePart> = useMemo(() => {
    if (filteredRegexValue === null || !isFilterActive) return [{
      isFilteredSection: false,
      value: itemName
    }];

    const nameSplit = itemName.split(filteredRegexValue);

    return nameSplit.map(value => ({
      value,
      isFilteredSection: filteredRegexValue.test(value)
    } satisfies ItemNamePart));
  }, [itemName, filteredRegexValue, isFilterActive]);

  return itemNameMapped.map((namePart, index) => (
    namePart.isFilteredSection ?
      (<FilteredNamePart key={index}>{namePart.value}</FilteredNamePart>) :
      (<span key={index}>{namePart.value}</span>)
  ));
};