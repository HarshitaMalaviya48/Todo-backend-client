import React, { useState, useEffect } from "react";
import styles from "../styles/Todos.module.css";
import Todo from "../components/Todo";
import TodoForm from "../components/TodoForm";
import { AuthConsumer } from "../store/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Todos() {
  const navigate = useNavigate();
  const { token, setToken, setIsLoggedIn } = AuthConsumer();
  // console.log("token", token);

  const initialTodos = [];
  const initialTodo = {
    title: "",
    description: "",
    date: "",
  };
  const [todo, setTodo] = useState(initialTodo);
  const [originalTodo, setOriginalTodo] = useState({});
  const [todoItems, setTodoItems] = useState(initialTodos);
  const [todoErrors, setTodoErrors] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    console.log("In todos page useeffect");

    const getTodoItems = async () => {
      const response = await fetch("http://localhost:3001/todo/readTodos", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const res_data = await response.json();
      console.log("in useEffect todos", res_data);

      if (response.status === 200) {
        setTodoItems(res_data.data);
      } else if (response.status === 404) {
        setTodoItems([]);
      }else if(response.status === 401){
        toast.error(res_data.error);
        setToken("")
        navigate("/login");  
      }
    };
    getTodoItems();
  }, [token, shouldRefresh]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodo({ ...todo, [name]: value });
  };

  const handleClearBtn = (e) => {
    e.preventDefault();
    setTodo(initialTodo);
    setTodoErrors({});
    setIsUpdateMode(false);
  };

  const handleAddButton = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/todo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    });
    console.log(response);

    const res_data = await response.json();

    console.log("res data", res_data);
    if (response.status === 200) {
      setShouldRefresh((prev) => !prev);
      console.log("Todo created");
      console.log("todo items", todoItems);
      setTodo(initialTodo);
      setTodoErrors({});
    } else if (response.status === 400) {
      setTodoErrors({
        title: res_data.error.title,
        description: res_data.error.description,
        date: res_data.error.date,
      });
      console.log("Todo errors set", todoErrors);

      console.log("Error", res_data.error);
    } else if (response.status === 401) {
      setIsLoggedIn(false);
      toast.error(res_data.error);
      navigate("/login");
      setToken("");
    }
  };

  const handleUpdateBtn = async (e) => {
    e.preventDefault();
    if (editId === null) {
      toast.error("First select todo to update");
      return;
    }
    let isEdited = false;
    for (let key in todo) {
      if ( todo[key] !== "" && todo[key] !== originalTodo[key]) {
        isEdited = true;
      }
    }

    if (!isEdited) {
      toast.error("Nothing is Edited");
      return;
    }

    const response = await fetch(
      `http://localhost:3001/todo/update/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(todo),
      }
    );

    const res_data = await response.json();
    console.log("response in handleUpdateOption", response);
    console.log("res_data in handleUpdateOption", res_data);
    if (response.status === 200) {
      toast.success(res_data.message);
      setShouldRefresh((prev) => !prev);
      console.log("Todo updated");
      console.log("todo items", todoItems);
      setTodo(initialTodo);
      setTodoErrors({});
      setEditId(null);
        setIsUpdateMode(false);
     
    } else if (response.status === 400) {
      setTodoErrors({
        date: res_data.error,
      });
      console.log("Todo errors set", todoErrors);

      console.log("Error", res_data.error);
    } else if (response.status === 401) {
      setIsLoggedIn(false);
      toast.error(res_data.error);
      navigate("/login");
      setToken("");
    }
  
  };
  return (
    <>
      <div className={styles.todosContainer}>
        {/* <form onSubmit={handleAddButton} className={styles.form}>
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
          <button className={styles.button} onClick={handleUpdateBtn}>
            Update
          </button>
        </form> */}
        <TodoForm
          handleAddButton={handleAddButton}
          handleInput={handleInput}
          todo={todo}
          todoErrors={todoErrors}
          handleClearBtn={handleClearBtn}
          handleUpdateBtn={handleUpdateBtn}
          shouldShowAddAndClearBtn = {true}
          isUpdateMode={isUpdateMode}
          handleBackButton={null}
        ></TodoForm>

        {/* Rendering todo items  */}
        <div className={styles.todoList}>
          <ul className={styles.todoItems}>
            {todoItems.length > 0 ? (
              todoItems.map((item, index) => (
                <Todo
                  key={item.id}
                  item={item}
                  todo={todo}
                  setShouldRefresh={setShouldRefresh}
                  setTodo={setTodo}
                  setEditId={setEditId}
                  setOriginalTodo={setOriginalTodo}
                  setIsUpdateMode={setIsUpdateMode}
                />
              ))
            ) : (
              <p className={styles.noTodoFoundMessage}>No todos found</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Todos;
