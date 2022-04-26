import { useDrop } from "react-dnd";

interface DroppableProps {
  type: string;
  index: number;
  children: React.ReactElement;
}

export function Droppable({ type, index, children }: DroppableProps) {
  const [, drop] = useDrop(
    () => ({
      accept: type,
      drop: () => ({ index }),
    }),
    [index]
  );

  return <div ref={drop}>{children}</div>;
}
