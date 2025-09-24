import { useState, useRef, useCallback } from 'react';

export const useDndList = <T,>(initialItems: T[]) => {
  const [items, setItems] = useState(initialItems);
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    dragItemIndex.current = index;
    setDraggingIndex(index);
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverItemIndex.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null) {
      const newItems = [...items];
      const dragItemContent = newItems.splice(dragItemIndex.current, 1)[0];
      newItems.splice(dragOverItemIndex.current, 0, dragItemContent);
      setItems(newItems);
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
  }, [items]);

  const getDraggableProps = (index: number) => ({
    draggable: true,
    onDragStart: () => handleDragStart(index),
    onDragEnter: () => handleDragEnter(index),
    onDragEnd: handleDragEnd,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    style: {
      cursor: 'grab',
      opacity: draggingIndex === index ? 0.5 : 1,
    },
    isDragging: draggingIndex === index,
  });
  
  const getContainerProps = () => ({
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
  });

  return { items, setItems, getDraggableProps, getContainerProps };
};