import {
  memo,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  DragEvent,
} from "react";
import cc from "classcat";
import { useEventCallback } from "hooks";

interface Props {
  id: string;
  title: string;
  completed: boolean;
  onChangeTitle?: (id: string, title: string) => void;
  onChangeCompleted?: (id: string, completed: boolean) => void;
  onRemove?: (id: string) => void;
}

const TodoItem = ({
  id,
  title,
  completed,
  onChangeTitle,
  onChangeCompleted,
  onRemove,
}: Props) => {
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const handleDoubleClick = useEventCallback(() => {
    setEditing(true);
  });
  const handleChangeTitle = useEventCallback(() => {
    const value = editInputRef.current!.value.trim();
    onChangeTitle?.(id, value);
  });
  const handleKeyDown = useEventCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.code === "Escape") {
        setEditing(false);
      } else if (event.code === "Enter") {
        handleSubmit();
      }
    }
  );
  const handleChangeCompleted = useEventCallback(() => {
    onChangeCompleted?.(id, !completed);
  });
  const handleSubmit = useEventCallback(() => {
    const value = editInputRef.current!.value.trim();
    if (value) {
      onChangeTitle?.(id, value);
    } else {
      onRemove?.(id);
    }
    setEditing(false);
  });
  const handleRemove = useEventCallback(() => {
    onRemove?.(id);
  });
  const handleDragStart = (event: DragEvent<HTMLLIElement>) => {
    setDragging(true);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("sourceId", id);
  };
  const handleDragEnd = (event: DragEvent<HTMLLIElement>) => {
    setDragging(false);
  };
  useEffect(() => {
    editInputRef.current![editing ? "focus" : "blur"]();
  }, [editing]);
  return (
    <li
      className={cc({ completed, editing })}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ backgroundColor: dragging ? "#ddd" : "#fff" }}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={completed}
          onChange={handleChangeCompleted}
        />
        <label data-id={id} onDoubleClick={handleDoubleClick}>
          {title}
        </label>
        <button className="destroy" onClick={handleRemove} />
      </div>
      <input
        ref={editInputRef}
        className="edit"
        value={title}
        onBlur={handleSubmit}
        onChange={handleChangeTitle}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default memo(TodoItem);
