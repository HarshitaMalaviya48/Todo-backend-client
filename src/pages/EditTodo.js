import React, { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import { useNavigate, useParams } from "react-router-dom";
import { AuthConsumer } from "../store/auth";
import { toast } from "react-toastify";

function EditTodo() {
  const { id } = useParams();
  const { token, setIsLoggedIn, setToken } = AuthConsumer();
  const navigate = useNavigate();

  const initialTodo = {
    todo: "",
    description: "",
    date: "",
  };

  const [todo, setTodo] = useState(initialTodo);
  const [originalTodo, setOriginalTodo] = useState(initialTodo);
  const [todoErrors, setTodoErrors] = useState({});
  const [isTodoUpdated, setIsTodoUpdated] = useState(true);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodo({ ...todo, [name]: value });
  };

  const handleBackButton = (e) => {
    e.preventDefault()
    navigate("/todos");
  }

  useEffect(() => {
    const fetchTodo = async () => {
      const response = await fetch(
        `http://localhost:3001/todo/readTodo/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res_data = await response.json();

      if (response.status === 200) {
        const data = res_data.data;
        const todoItem = {
          title: data.title,
          description: data.description,
          date: data.date,
        };
        setTodo(todoItem);
        setOriginalTodo(todoItem);
      } else if (response.status === 401) {
        alert(res_data.message);
        navigate(-1)
      } else if (response.status === 404) {
        alert(res_data.message);
        navigate(-1)
      }
    };
    fetchTodo();
  }, [token, id, navigate]);

  useEffect(() => {
    for (let key in todo) {
      if (todo[key] !== "" && todo[key] !== originalTodo[key]) {
        setIsTodoUpdated(false);
      }
    }
  },[todo, originalTodo])

  const handleUpdateBtn = async (e) => {
    console.log("in handle update btn");

    e.preventDefault();

    // let isEdited = false;
    // for (let key in todo) {
    //   if (todo[key] !== "" && todo[key] !== originalTodo[key]) {
    //     isEdited = true;
    //   }
    // }

    // if (!isEdited) {
    //   toast.error("Nothing is Edited");
    //   return;
    // }

    const response = await fetch(`http://localhost:3001/todo/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    });
    const res_data = await response.json();
    console.log("response in handleUpdateOption", response);
    console.log("res_data in handleUpdateOption", res_data);
    if (response.status === 200) {
      navigate("/todos");
      toast.success(res_data.message);
      //   setShouldRefresh((prev) => !prev);
      console.log("Todo updated");
      //   console.log("todo items", todoItems);
      setTodo(initialTodo);
      setTodoErrors({});
      //   setEditId(null);
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
    <TodoForm
      todo={todo}
      todoErrors={todoErrors}
      handleUpdateBtn={handleUpdateBtn}
      handleInput={handleInput}
      handleAddButton={null}
      handleClearBtn={null}
      shouldShowAddAndClearBtn={false}
      handleBackButton={handleBackButton}
      isTodoUpdated={isTodoUpdated}
    ></TodoForm>
  );
}

export default EditTodo;
