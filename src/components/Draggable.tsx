import { useDrag } from "react-dnd";
import { TalkingPoint } from "../types";

interface DraggableProps {
  talkingPoint: TalkingPoint;
  type: string;
  children: any;
  onMove(talkingPoint: TalkingPoint, index: number): void;
}

export function Draggable({
  talkingPoint,
  type,
  children,
  onMove,
}: DraggableProps) {
  const [collected, drag, dragPreview] = useDrag<
    TalkingPoint,
    { index: number },
    any
  >(() => ({
    type,
    item: talkingPoint,
    end: (talkingPoint, monitor) => {
      const result = monitor.getDropResult<{ index: number }>();
      if (!result) return;
      onMove(talkingPoint, result.index);
    },
  }));

  return collected.isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <div ref={drag} {...collected}>
      {children}
    </div>
  );
}
