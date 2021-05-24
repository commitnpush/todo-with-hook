import { useMemo } from "react";
import { Mode, Todo } from "types";

function useFilteredTodos(todos: Todo[], mode: Mode) {
  return useMemo(() => {
    switch (mode) {
      case "all":
        return todos;
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
    }
  }, [todos, mode]);
}

export default useFilteredTodos;
