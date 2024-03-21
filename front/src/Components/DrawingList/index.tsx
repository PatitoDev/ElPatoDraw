import { Card, SimpleGrid, Text } from '@mantine/core';
import { DrawingMetadata } from '../../types/Entity';

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

  const sortedFiles = [...files];
  sortedFiles.sort((a, b) => {
    const tsA = dateAsTimestamp(a.created_at);
    const tsB = dateAsTimestamp(b.created_at);
    return tsB - tsA;
  });

  return (
    <SimpleGrid sx={{ padding: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(15em, 1fr))' }} spacing="0.75rem">
      {sortedFiles.map((file) => (
        <Card
          sx={{
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: 'inset 0 0 0 0px rgb(193 194 197 / 0%)',
            ':hover' : {
              cursor: 'pointer',
              boxShadow: 'inset 0 0 0 3px rgb(193 194 197 / 100%)',
              transform: 'scale(1.03)'
            }
          }}
          key={file.id} 
          onClick={() => onFileClick(file.id)}>
          <Text weight='bold'>{file.name}</Text>
          <Text size="sm">{parseDate(file.created_at)}</Text>
        </Card>
      ))}
    </SimpleGrid>
  );
};
