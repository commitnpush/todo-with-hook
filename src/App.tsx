import Footer from "components/Footer";
import Header from "components/Header";
import TodoItem from "components/TodoItem";
import { useEventCallback } from "hooks";
import { DragEvent, useEffect, useLayoutEffect, useState } from "react";
import { useTodos } from "services";
import useFilteredTodos from "services/useFilteredTodos";
import { Mode } from "types";

function App() {
  const [mode, setMode] = useState<Mode>("all");

  const {
    todos,
    addTodo,
    setTitle,
    setCompleted,
    remove,
    clearCompleted,
    insertBefore,
  } = useTodos();
  const filteredTodos = useFilteredTodos(todos, mode);
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);
  const handleChangeMode = useEventCallback(() => {
    const hash = document.location.hash;
    const mode = (hash.replace(/#\//g, "") || "all") as Mode;
    setMode(mode);
  });
  const handleDragEnter = useEventCallback(
    (event: DragEvent<HTMLUListElement>) => {
      const targetId = (event.target as HTMLLIElement).dataset.id;
      console.debug(targetId);
      if (!targetId) return;
      insertBefore(draggedTodoId!, targetId);
    }
  );
  const handleDragOver = useEventCallback((event: DragEvent) => {
    event.preventDefault();
  });
  const handleDragStart = useEventCallback((id: string) => {
    setDraggedTodoId(id);
  });
  const handleDragEnd = useEventCallback(() => {
    setDraggedTodoId(null);
  });
  useLayoutEffect(() => {
    handleChangeMode();
  }, [handleChangeMode]);
  useEffect(() => {
    window.addEventListener("popstate", handleChangeMode);
    return () => {
      window.removeEventListener("popstate", handleChangeMode);
    };
  }, [handleChangeMode]);

  return (
    <main>
      <section className="todoapp">
        <Header onCreate={addTodo} />
        <section className="main">
          <ul
            className="todo-list"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
          >
            {filteredTodos.map(({ id, title, completed }) => (
              <TodoItem
                key={id}
                id={id}
                title={title}
                completed={completed}
                onChangeTitle={setTitle}
                onChangeCompleted={setCompleted}
                onRemove={remove}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ul>
        </section>
        <Footer
          currentMode={mode}
          remaining={todos.filter((t) => !t.completed).length}
          showClearButton={todos.filter((t) => t.completed).length > 0}
          onClearCompleted={clearCompleted}
        />
      </section>
    </main>
  );
}

export default App;
