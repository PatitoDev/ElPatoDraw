import { Card, SimpleGrid, Text } from '@mantine/core';
import { DrawingMetadata } from '../../types/Entity';

export interface DrawingListProps {
  files: Array<DrawingMetadata>,
  onFileClick: (id: string) => void,
}

const parseDate = (date: string) => (
  new Date(date).toLocaleDateString()
);

export const DrawingList = ({ files, onFileClick }: DrawingListProps) => {

  return (
    <SimpleGrid sx={{ padding: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(15em, 1fr))' }} spacing="0.75rem">
      {files.map((file) => (
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
