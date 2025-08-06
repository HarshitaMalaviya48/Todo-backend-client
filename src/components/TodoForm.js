import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Todos.module.css";

function TodoForm({
  handleAddButton,
  handleInput,
  todo,
  todoErrors,
  handleClearBtn,
  handleUpdateBtn,
  shouldShowAddAndClearBtn,
  isUpdateMode,
  handleBackButton,
  isTodoUpdated,
}) {
  const originalTodo = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  
  // console.log("in todoFprm originalTodo", originalTodo);
  useEffect(() => {
    if (isUpdateMode && todo) {
      originalTodo.current = { ...todo };
    }
  }, [isUpdateMode]);

  useEffect(() => {
    if (isUpdateMode && originalTodo.current) {
     console.log("in todoFprm originalTodo", originalTodo);
      
      const hasChanges = Object.keys(todo).some(
        (key) => todo[key] !== originalTodo.current[key]
      );
      console.log("in todoform hasChanges", !hasChanges);
      
      setIsButtonDisabled(!hasChanges);
    } else {
      const hasValues = Object.values(todo).some(
        (value) => value.trim() !== ""
      );
      console.log("in todoForm hasVlaue", hasValues);
      setIsButtonDisabled(!hasValues);
    }
  }, [todo, isUpdateMode]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isUpdateMode) {
          handleUpdateBtn(e);
        } else {
          handleAddButton(e);
        }
      }}
      className={styles.form}
    >
      <div className={styles.inputDiv}>
        <label className={styles.inputLabel}>
          <span className={styles.inputSpan}>*</span>Title:
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
          type="date"
          name="date"
        ></input>
        <p className={styles.error}>{todoErrors.date}</p>
      </div>
      {/* Show Add/Update and Clear only if shouldShowAddAndClearBtn */}
      {shouldShowAddAndClearBtn && (
        <>
          <button
            className={styles.button}
            type="submit"
            disabled={isButtonDisabled}
          >
            {isUpdateMode ? "Update" : "Add"}
          </button> 
          <button
            className={styles.button}
            onClick={handleClearBtn}
            disabled={!isUpdateMode && isButtonDisabled}
          >
            Clear
          </button>
        </>
      )}
      {/* Show Update and Back for EditTodo */}

      {!shouldShowAddAndClearBtn && (
        <>
          <button
            className={styles.button}
            onClick={handleUpdateBtn}
            disabled={isTodoUpdated}
          >
            Update
          </button>
          <button
            className={styles.button}
            onClick={handleBackButton}
            disabled={isButtonDisabled}
          >
            Back
          </button>
        </>
      )}
    </form>
  );
}

export default TodoForm;
