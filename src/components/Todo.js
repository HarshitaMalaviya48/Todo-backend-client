import React from "react";
import styles from "../styles/Todos.module.css";
import { AuthConsumer } from "../store/auth.js";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

function Todo({
  item,
  setShouldRefresh,
  todo,
  setTodo,
  setEditId,
  setOriginalTodo,
  setIsUpdateMode,
}) {
  const navigate = useNavigate();
  const { token } = AuthConsumer();

  const handleDeleteButton = async (id) => {
    const isConfirmed = window.confirm("Do you want to Delete this Todo");
    if(!isConfirmed){
      return;
    }
    const response = await fetch(`http://localhost:3001/todo/delete/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const res_data = await response.json();
    if (response.status === 200) {
      console.log("todo is deleted");
      setShouldRefresh((prev) => !prev);
    }else if(response.status === 401){
      toast.error(res_data.message);
    }else if(response.status === 404){
      toast.error(res_data.message);
    }
  };
  console.log("item", item);
  const handleSelectOption = (e, item) => {
    console.log("id", item.id);
    if (e.target.value === "update") {
      handleUpdateOption(item);
    } else if (e.target.value === "updateOnOtherPage") {
      // handleUpdateOnOtherPageOption(item);
      navigate(`/edit/${item.id}`);

    }
    e.target.value = "";
  };
  // const handleUpdateOnOtherPageOption = (item) => {
    
  // };
  const handleUpdateOption = async (item) => {
    console.log("in update btn handler");
    const todoItem = {
      title: item.title,
      description: item.description,
      date: item.date,
    };

    console.log("in todo todoItem for update", todoItem);
    
    setTodo(todoItem);
    setOriginalTodo(todoItem);
    setEditId(item.id);
     setIsUpdateMode(true);
  };
  return (
    <>
      <li className={styles.todo}>
        <div className={styles.todoDetails}>
          <p>{item.title}</p>
          <p>{item.description}</p>
          <p>{item.date}</p>
          {/* <p>{new Date(item.date).toLocaleDateString()}</p> */}
        </div>

        <div className={styles.todoActions}>
          <select
            name="select"
            onChange={(e) => handleSelectOption(e, item)}
            className={styles.actionSelect}
          >
            <option value="">-- Select option --</option>
            <option value="update" onSelect={() => handleUpdateOption(item)}>
              Update
            </option>
            <option value="updateOnOtherPage">Update On other page</option>
          </select>
          <button
            className={styles.button}
            onClick={() => handleDeleteButton(item.id)}
          >
            Delete
          </button>
        </div>
      </li>
    </>
  );
}

export default Todo;

