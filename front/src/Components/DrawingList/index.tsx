import {
  Card,
  CloseButton,
  Group,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { DrawingMetadata } from '../../types/Entity';
import { useEffect, useState } from 'react';

export interface DrawingListProps {
  files: Array<DrawingMetadata>,
  onFileClick: (id: string) => void,
}

const dateAsTimestamp = (date: string) => (
  new Date(date).valueOf()
);


const parseDate = (date: string) => (
  new Date(date).toLocaleDateString()
);

export const DrawingList = ({ files, onFileClick }: DrawingListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [sortedFiles, setSortedFiles] = useState<DrawingMetadata[]>([]);

  useEffect(() => {
    let realFiles: DrawingMetadata[];
    if (!searchQuery) {
      realFiles = [...files];
    } else {
      const lowerSearchQuery = searchQuery.toLocaleLowerCase();
      realFiles = files.filter(
        (f) => f.name.toLocaleLowerCase().indexOf(lowerSearchQuery) >= 0,
      );
    }
    realFiles.sort((a, b) => {
      const tsA = dateAsTimestamp(a.created_at);
      const tsB = dateAsTimestamp(b.created_at);
      return tsB - tsA;
    });
    setSortedFiles(realFiles);
  });

  const Cancel = (
    <CloseButton
      variant="transparent"
      onClick={() => setSearchQuery('')}
      disabled={searchQuery.length === 0}
      sx={{ ':disabled': { color: 'transparent' } }}
    />
  );

  return (
    <>
      <Group style={{ justifyContent: 'center' }}>
        <TextInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder="Search..."
          rightSection={Cancel}
        />
      </Group>
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
            <Text size="sm">{parseDate(file.created_at)}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};
