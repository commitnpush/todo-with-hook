import produce from "immer";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Storage, Todo } from "types";
import { v4 as uuidv4 } from "uuid";

interface Result {
  todos: Todo[];
  remaining: number;
  addTodo: (title: string) => void;
  remove: (id: string) => void;
  setTitle: (id: string, title: string) => void;
  setCompletedAll: (completed: boolean) => void;
  setCompleted: (id: string, completed: boolean) => void;
  clearCompleted: () => void;
  insertBefore: (sourceId: string, targetId: string) => void;
  isCompletedAll: boolean;
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
  const isCompletedAll = useMemo(
    () => todos.every((todo) => todo.completed),
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
  const remove = useCallback((id: string) => {
    setTodos((draft) => draft.filter((todo) => todo.id !== id));
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
  const clearCompleted = useCallback(() => {
    setTodos((draft) => draft.filter((todo) => !todo.completed));
  }, []);
  const insertBefore = useCallback<Result["insertBefore"]>(
    (sourceId, targetId) => {
      setTodos((draft) =>
        produce(draft, (draft) => {
          const sourceIndex = draft.findIndex(({ id }) => id === sourceId);
          const targetIndex = draft.findIndex(({ id }) => id === targetId);
          const source = draft.splice(sourceIndex, 1);
          draft.splice(targetIndex, 0, source[0]);
        })
      );
    },
    []
  );
  useLayoutEffect(() => {
    if (initialTodos) return;
    const loadedTodos = (storage || localStorage).getItem(storageName);
    if (loadedTodos !== null) {
      setTodos(JSON.parse(loadedTodos));
    }
  }, [initialTodos, storageName, storage]);
  useEffect(() => {
    (storage || localStorage).setItem(storageName, JSON.stringify(todos));
  }, [storage, storageName, todos]);

  return {
    todos,
    remaining,
    isCompletedAll,
    addTodo,
    remove,
    setTitle,
    setCompletedAll,
    setCompleted,
    clearCompleted,
    insertBefore,
  };
};

export default useTodos;

export type { Result };
