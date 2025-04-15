import { RefObject } from 'react';

export type Point = { x: number, y: number };
export type Box = {
  start: Point,
  end: Point
}

const getFileUnderMouse = (containerRef: RefObject<HTMLDivElement | null>, e: MouseEvent) => {
  const container = containerRef.current;
  if (container === null) return;

  let fileWithBox: Array<{
    fileId: string,
    box: Box
  }> = [];

  for (const child of container.children) {
    const id = (child as HTMLElement).dataset.id;
    if (!id) continue;

    const rect = child.getBoundingClientRect();
    fileWithBox = [...fileWithBox, {
      fileId: id,
      box: {
        start: { x: rect.left, y: rect.top },
        end: { x: rect.right, y: rect.bottom }
      },
    }];
  }

  const mousePosition = { x: e.clientX, y: e.clientY };

  for (const { box, fileId } of fileWithBox) {
    if (
      (mousePosition.x > box.start.x && mousePosition.x < box.end.x) &&
      (mousePosition.y > box.start.y && mousePosition.y < box.end.y)
    ) return fileId;
  }
};

const getFileIdsInsideBox = (
  x: number,
  y: number,
  width: number,
  height: number,
  itemContainerRef: RefObject<HTMLDivElement | null>
) => {
  const container = itemContainerRef.current;
  if (!container) return [];

  const selectionStartPoint = { x, y };
  const selectionEndPoint = { x: x + width, y: y + height };

  let fileWithBox: Array<{
    fileId: string,
    box: Box
  }> = [];

  const containerBoundingBox = container.getBoundingClientRect();
  for (const child of container.children) {
    const id = (child as HTMLElement).dataset.id;
    if (!id) continue;

    const rect = child.getBoundingClientRect();
    fileWithBox = [...fileWithBox, {
      fileId: id,
      box: {
        start: {
          x: rect.left,
          y: rect.top + container.scrollTop - containerBoundingBox.top
        },
        end: {
          x: rect.right,
          y: rect.bottom + container.scrollTop - containerBoundingBox.top
        }
      },
    }];
  }

  const collidedWith = fileWithBox.filter(({ box }) =>
    (selectionStartPoint.x < box.end.x) && (selectionEndPoint.x > box.start.x) &&
    (selectionStartPoint.y < box.end.y) && (selectionEndPoint.y > box.start.y)
  );

  const selectedIds = collidedWith.map(item => item.fileId);
  return selectedIds;
};

export const utils = {
  getFileUnderMouse,
  getFileIdsInsideBox
};