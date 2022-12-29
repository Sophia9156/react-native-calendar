import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialTodoList = [
  // {
  //   id: 1,
  //   content: "운동하기",
  //   date: dayjs("2022-12-01"),
  //   isDone: true,
  // },
  // {
  //   id: 2,
  //   content: "공부하기",
  //   date: dayjs("2022.12.05"),
  //   isDone: false,
  // },
  // {
  //   id: 3,
  //   content: "RN 강의 수강하기",
  //   date: dayjs("2022.12.05"),
  //   isDone: true,
  // },
  // {
  //   id: 4,
  //   content: "미니언즈 괴롭히기",
  //   date: dayjs("2022.12.28"),
  //   isDone: true,
  // },
  // {
  //   id: 5,
  //   content: "물 엎지르기",
  //   date: dayjs("2022.12.28"),
  //   isDone: false,
  // },
  // {
  //   id: 6,
  //   content: "풍선껌 불기",
  //   date: dayjs("2022.12.28"),
  //   isDone: true,
  // }
];

const TODO_LIST_KEY = 'TODO_LIST_KEY';

export default function useTodoList(selectedDate) {
  const [todoList, setTodoList] = useState([]);
  const [input, setInput] = useState("");

  const saveTodoList = (newTodoList) => {
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList));
  };

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
    ];
    saveTodoList(newTodoList);
  };

  const removeTodo = (todoId) => {
    const newTodoList = todoList.filter(todo => todo.id !== todoId);
    saveTodoList(newTodoList);
  };

  const toggleTodo = (todoId) => {
    const newTodoList = todoList.map(todo => {
      if(todo.id !== todoId) return todo;
      return {
        ...todo,
        isDone: !todo.isDone,
      }
    });
    saveTodoList(newTodoList);
  };

  const resetInput = () => setInput("");

  const filteredTodoList = todoList.filter(todo => {
    const isSameDate = dayjs(todo.date).isSame(selectedDate, 'date');
    return isSameDate;
  });

  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const result = await AsyncStorage.getItem(TODO_LIST_KEY);
    const initialTodoList = result ? JSON.parse(result) : [];
    setTodoList(initialTodoList);
  };

  return {
    todoList,
    filteredTodoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
  }
}