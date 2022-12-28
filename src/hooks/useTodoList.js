import dayjs from 'dayjs';
import { useState } from 'react';

const initialTodoList = [
  {
    id: 1,
    content: "운동하기",
    date: dayjs(),
    isDone: true,
  },
  {
    id: 2,
    content: "공부하기",
    date: dayjs(),
    isDone: false,
  },
  {
    id: 3,
    content: "RN 강의 수강하기",
    date: dayjs(),
    isDone: true,
  }
]

export default function useTodoList(selectedDate) {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const length = todoList.length;
    const lastId = length === 0 ? 0 : todoList[length - 1].id;

    const newTodoList = [
      ...todoList,
      {
        id: lastId + 1,
        content: input,
        date: selectedDate,
        isDone: false,
      }
    ]
    setTodoList(newTodoList);
  };

  const removeTodo = (todoId) => {
    const newTodoList = todoList.filter(todo => todo.id !== todoId);
    setTodoList(newTodoList);
  };

  const toggleTodo = (todoId) => {
    const newTodoList = todoList.map(todo => {
      if(todo.id !== todoId) return todo;
      return {
        ...todo,
        isDone: !todo.isDone,
      }
    });
    setTodoList(newTodoList);
  };

  const resetInput = () => setInput("");

  return {
    todoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
  }
}