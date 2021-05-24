import Footer from "components/Footer";
import Header from "components/Header";
import TodoItem from "components/TodoItem";
import { useEventCallback } from "hooks";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTodos } from "services";
import useFilteredTodos from "services/useFilteredTodos";
import { Mode } from "types";

function App() {
  const [mode, setMode] = useState<Mode>("all");

  const { todos, addTodo, setTitle, setCompleted, remove, clearCompleted } =
    useTodos();
  const filteredTodos = useFilteredTodos(todos, mode);
  const handleChangeMode = useEventCallback(() => {
    const hash = document.location.hash;
    const mode = (hash.replace(/#\//g, "") || "all") as Mode;
    setMode(mode);
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
          <ul className="todo-list">
            {filteredTodos.map(({ id, title, completed }) => (
              <TodoItem
                key={id}
                id={id}
                title={title}
                completed={completed}
                onChangeTitle={setTitle}
                onChangeCompleted={setCompleted}
                onRemove={remove}
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
