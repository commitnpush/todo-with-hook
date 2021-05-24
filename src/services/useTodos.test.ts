import { act, renderHook } from "@testing-library/react-hooks";
import { Todo } from "types";
import useTodos from "./useTodos";

const storage = {
  getItem: () => null,
  setItem: () => undefined,
};

function getInitialTodos(resource?: Partial<Todo>) {
  return [
    { id: "a", title: "", completed: false, ...resource },
    { id: "b", title: "", completed: false, ...resource },
    { id: "c", title: "", completed: false, ...resource },
  ];
}

test("initialTodos에 데이터를 전달하면 초기값으로 설정돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  expect(result.current.todos).toEqual(initialTodos);
});

test("addTodo에 책 읽기를 전달하면 할 일이 생성돼야 한다.", () => {
  const { result } = renderHook(() => useTodos({ storage }));
  act(() => result.current.addTodo("책 읽기"));
  expect(result.current.todos.length).toEqual(1);
  expect(result.current.todos[0].title).toEqual("책 읽기");
});

test("setCompletedAll에 true를 전달하면 모든 할 일의 completed가 true로 변경돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  act(() => result.current.setCompletedAll(true));
  expect(result.current.todos.every((todo) => todo.completed)).toBeTruthy();
});

test("setCompleted에 id와 true를 전달하면 해당하는 할 일의 completed가 true로 변경되며 다시 false를 전달하면 해당하는 할 일의 completed가 false로 변경돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  const target = initialTodos[1];
  act(() => result.current.setCompleted(target.id, true));
  expect(
    result.current.todos.find((todo) => todo.id === target.id)?.completed
  ).toBeTruthy();
  act(() => result.current.setCompleted(target.id, false));
  expect(
    result.current.todos.find((todo) => todo.id === target.id)?.completed
  ).toBe(false);
});

test("isCompletedAll은 모든 할 일의 completed가 true 라면 true 여야 한다.", () => {
  const initialTodos = getInitialTodos({ completed: true });
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  expect(result.current.isCompletedAll).toBeTruthy();
});

test("remove에 id를 전달하면 해당하는 할 일이 제거돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  const target = initialTodos[2];
  act(() => result.current.remove(target.id));
  expect(result.current.todos.length).toBe(initialTodos.length - 1);
  expect(
    result.current.todos.some((todo) => todo.id === target.id)
  ).toBeFalsy();
});

test("setTitle에 id와 title을 전달하면 해당하는 할 일의 title이 변경돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  const target = initialTodos[2];
  const newTitle = "d";
  act(() => result.current.setTitle(target.id, newTitle));
  expect(
    result.current.todos.find((todo) => todo.id === target.id)?.title
  ).toBe(newTitle);
});

test("clearCompleted를 호출하면 completed가 true인 할 일이 모두 제거돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  initialTodos[0].completed = true;
  initialTodos[2].completed = true;
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  act(() => result.current.clearCompleted());
  expect(result.current.todos.length).toBe(1);
  expect(result.current.todos[0].id).toBe(initialTodos[1].id);
});

test("storage에 데이터가 있으면 해당 데이터가 초기 할 일 데이터로 설정돼야 한다.", () => {
  const initialTodos = getInitialTodos();
  const customStorage = {
    getItem: () => JSON.stringify(initialTodos),
    setItem: () => undefined,
  };
  const { result } = renderHook(() => useTodos({ storage: customStorage }));
  expect(result.current.todos.length).toBe(3);
});

test("할 일 데이터가 변경될 때 마다 storage에 데이터가 저장돼야 한다.", () => {
  const setItem = jest.fn();
  const customStorage = {
    setItem,
    getItem: () => null,
  };
  const { result } = renderHook(() => useTodos({ storage: customStorage }));
  act(() => {
    result.current.addTodo("책읽기");
  });
  act(() => {
    result.current.setCompletedAll(true);
  });
  console.debug(setItem.mock.calls);
  expect(setItem.mock.calls[1][0]).toEqual("todos");
  expect(setItem.mock.calls[1][1].includes("책읽기")).toBeTruthy();
  expect(setItem.mock.calls[2][1].includes(`"completed":true`)).toBeTruthy();
});

test("exchange에 sourceId와 targetId를 전달하면 source와 target의 index가 서로 바뀌어야 한다.", () => {
  const initialTodos = getInitialTodos();
  const { result } = renderHook(() => useTodos({ initialTodos, storage }));
  act(() => result.current.exchange(initialTodos[0].id, initialTodos[1].id));
  expect(
    result.current.todos.findIndex(({ id }) => id === initialTodos[0].id)
  ).toEqual(1);
  expect(
    result.current.todos.findIndex(({ id }) => id === initialTodos[1].id)
  ).toEqual(0);
});
