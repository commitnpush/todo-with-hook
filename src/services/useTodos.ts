import produce from "immer";
import { useCallback, useMemo, useState } from "react";
import { Storage, Todo } from "types";
import { v4 as uuidv4 } from "uuid";

interface Result {
  todos: Todo[];
  remaining: number;
  addTodo: (title: string) => void;
  setTitle: (id: string, title: string) => void;
  setCompletedAll: (completed: boolean) => void;
  setCompleted: (id: string, completed: boolean) => void;
  // clearCompleted: () => void;
  // isCompletedAll: boolean;
  // remove: (id: string) => void;
}

interface Options {
  initialTodos?: Todo[];
  storage?: Storage;
  storageName?: string;
}

const useTodos = (options?: Options): Result => {
  const { initialTodos, storage, storageName = "todos" } = options || {};
  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const remaining = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );
  const addTodo = useCallback((title: string) => {
    if (title === "") {
      throw new Error("할 일을 입력해 주세요.");
    }
    setTodos((draft) =>
      draft.concat({ title, id: uuidv4(), completed: false })
    );
  }, []);
  const setTitle = useCallback((id: string, title: string) => {
    setTodos((draft) =>
      produce(draft, (draft) => {
        const target = draft.find((todo) => todo.id === id);
        if (!target) {
          throw new Error("존재하지 않는 아이디 입니다.");
        }
        target.title = title;
      })
    );
  }, []);
  const setCompletedAll = useCallback((completed: boolean) => {
    setTodos((draft) => draft.map((todo) => ({ ...todo, completed })));
  }, []);
  const setCompleted = useCallback((id, completed) => {
    setTodos((draft) =>
      produce(draft, (draft) => {
        const target = draft.find((todo) => todo.id === id);
        if (!target) {
          throw new Error("존재하지 않는 아이디 입니다.");
        }
        target.completed = completed;
      })
    );
  }, []);

  return { todos, remaining, addTodo, setTitle, setCompletedAll, setCompleted };
};

export default useTodos;

export type { Result };
