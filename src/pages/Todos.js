import React, { useState } from "react";
import styles from "../styles/Todos.module.css";
import Todo from "./Todo";

function Todos() {
  const initialTodos = [];
  const initialTodo = {
    title: "",
    description: "",
    date: "",
  };
  const [todo, setTodo] = useState(initialTodo);
  const [todoItems, setTodoItems] = useState(initialTodos);
  const [todoErrors, setTodoErrors] = useState({});

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodo({ ...todo, [name]: value });
  };

  const handleClearBtn = (e) => {
    e.preventDefault();
    setTodo(initialTodo);
  };

  const handleAddButton = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/todo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(todo),
    });
    console.log(response);

    const res_data = await response.json();

    console.log("res data", res_data);
    if (response.status === 200) {
      console.log("Todo created");
      setTodoItems([
        ...todoItems,
        {
          title: res_data.data.title,
          description: res_data.data.description,
          date: res_data.data.date,
        },
      ]);
      console.log(todoItems);
      setTodo(initialTodo);
      setTodoErrors({});
    } else if (res_data.error) {
      setTodoErrors({
        title: res_data.error.title,
        description: res_data.error.description,
        date: res_data.error.date,
      });
      console.log("Todo errors set", todoErrors);

      console.log("Error", res_data.error);
    }

    console.log("todo items", todo);
  };
  return (
    <>
      <div >
        <form onSubmit={handleAddButton} className={styles.form}>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              {" "}
              <span className={styles.inputSpan}>*</span>Title:{" "}
            </label>
            <input
              value={todo.title}
              onChange={handleInput}
              className={styles.userInput}
              type="text"
              name="title"
            ></input>
            <p className={styles.error}>{todoErrors.title}</p>
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              {" "}
              <span className={styles.inputSpan}>*</span>Description:{" "}
            </label>
            <input
              value={todo.description}
              onChange={handleInput}
              className={styles.userInput}
              type="text"
              name="description"
            ></input>
            <p className={styles.error}>{todoErrors.description}</p>
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              {" "}
              <span className={styles.inputSpan}>*</span>Date:{" "}
            </label>
            <input
              value={todo.date}
              onChange={handleInput}
              className={styles.userInput}
              type="text"
              name="date"
              placeholder="yyyy-mm-dd"
            ></input>
            <p className={styles.error}>{todoErrors.date}</p>
          </div>
          <button className={styles.button} type="submit">
            Add
          </button>
          <button className={styles.button} onClick={handleClearBtn}>
            Clear
          </button>
        </form>

        {/* Rendering todo items  */}
        <div className={styles.todoList}>
          <ul className={styles.todoItems} >
          {todoItems.map((item, index) => {
            return <Todo key={index} item={item}/>;
          })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Todos;
