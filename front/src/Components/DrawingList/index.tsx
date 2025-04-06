import {
  Card,
  SimpleGrid,
  Text
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { Toolbar } from './Toolbar';
import { Folder } from '../../types/File';

export interface DrawingListProps {
  onFileClick: (id: string) => void,
  folder: Folder,
}

const dateAsTimestamp = (date: string) => (
  new Date(date).valueOf()
);

const parseDate = (date: string) => (
  new Date(date).toLocaleDateString()
);

export const DrawingList = ({ folder, onFileClick }: DrawingListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sortedFiles = useMemo(() => {
    const searchValue = searchQuery.trim().toLocaleLowerCase();

    const filteredResult = folder.files
      .filter(f => f.name.toLocaleLowerCase().indexOf(searchValue) >= 0);

    return filteredResult.sort((a, b) => {
      const tsA = dateAsTimestamp(a.createdAt);
      const tsB = dateAsTimestamp(b.createdAt);
      return tsB - tsA;
    });

  }, [folder, searchQuery]);

  return (
    <>
      <Toolbar currentSearch={searchQuery} onChangeSearch={setSearchQuery} />
      <SimpleGrid
        sx={{
          padding: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(15em, 1fr))',
        }}
        spacing="0.75rem"
      >
        {sortedFiles.map((file) => (
          <Card
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: 'inset 0 0 0 0px rgb(193 194 197 / 0%)',
              ':hover': {
                cursor: 'pointer',
                boxShadow: 'inset 0 0 0 3px rgb(193 194 197 / 100%)',
                transform: 'scale(1.03)',
              },
            }}
            key={file.id}
            onClick={() => onFileClick(file.id)}
          >
            <Text weight="bold">{file.name}</Text>
            <Text size="sm">{parseDate(file.createdAt)}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};
