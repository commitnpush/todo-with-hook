import { act, renderHook } from "@testing-library/react-hooks";
import useTodos from "./useTodos";

const storage = {
  getItem: () => null,
  setItem: () => undefined,
};

test("addTodo에 책 읽기를 전달하면 할 일이 생성돼야 한다.", () => {
  const { result } = renderHook(() => useTodos({ storage }));
  act(() => result.current.addTodo("책 읽기"));
  expect(result.current.todos.length).toEqual(1);
  expect(result.current.todos[0].title).toEqual("책 읽기");
});
