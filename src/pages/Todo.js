import React from "react";
import styles from "../styles/Todos.module.css";

function Todo({ item }) {
  return (
    <>
     <li className={styles.todo}>
      <div className={styles.todoDetails}>
        <p >{item.title}</p>
        <p >{item.description}</p>
        <p >{new Date(item.date).toLocaleDateString()}</p>
      </div>

      <div className={styles.todoActions}>
        <select className={styles.actionSelect}>
          <option>Update</option>
          <option>Update On other page</option>
        </select>
        <select className={styles.actionSelect}>
          <option>Delete</option>
          <option>Delete On other page</option>
        </select>
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