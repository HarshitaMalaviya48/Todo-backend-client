import React from "react";
import styles from "../styles/Todos.module.css";
import { AuthConsumer } from "../store/auth.js";

function Todo({
  item,
  setShouldRefresh,
  todo,
  setTodo,
  setEditId,
  setOriginalTodo,
}) {
  const { token } = AuthConsumer();

  const handleDeleteButton = async (id) => {
    const response = await fetch(`http://localhost:3001/todo/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res_data = await response.json();
    if (response.status === 200) {
      console.log("todo is deleted");
      setShouldRefresh((prev) => !prev);
    }
  };
  console.log("item", item);
  const handleSelectOption = (e, item) => {
    console.log("id", item.id);
    if (e.target.value === "update") {
      handleUpdateOption(item);
    } else if (e.target.value === "updateOnOtherPage") {
      handleUpdateOnOtherPageOption(item);
    }
    e.target.value = "";
  };
  const handleUpdateOnOtherPageOption = (item) => {
    
  };
  const handleUpdateOption = async (item) => {
    console.log("in update btn handler");
    const todoItem = {
      title: item.title,
      description: item.description,
      date: item.date,
    };
    setTodo(todoItem);
    setOriginalTodo(todoItem);
    setEditId(item.id);
  };
  return (
    <>
      <li className={styles.todo}>
        <div className={styles.todoDetails}>
          <p>{item.title}</p>
          <p>{item.description}</p>
          <p>{new Date(item.date).toLocaleDateString()}</p>
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

//   <li className={styles.todo}>
//     <p>{item.title}</p>
//     <p>{item.description}</p>
//     <p>{new Date(item.date).toLocaleDateString()}</p>

//   <select>
//     <option>Update</option>
//     <option>Update On other page</option>
//   </select>
//   <select>
//     <option>Delete</option>
//     <option>Delete On other page</option>
//   </select>
//   </li>
