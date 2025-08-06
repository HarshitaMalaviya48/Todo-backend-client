import  { useState } from "react";
import styles from "../styles/SignUp.module.css";
import { AuthConsumer } from "../store/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate()
  const { storeTokenInLS, setIsLoggedIn, setToken } = AuthConsumer();
  const initialValue = {
    email: "",
    password: "",
  };
  const [logInDetails, setLogInDetails] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const handleInput = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    setLogInDetails({
      ...logInDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login", logInDetails);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInDetails),
      });
      console.log(response);
      const res_data = await response.json();
      console.log(res_data);
      if (response.status === 200) {
        storeTokenInLS(res_data.token);
        setToken(res_data.token);
       setIsLoggedIn(true)
        setLogInDetails(initialValue);
        setFormErrors({});
        toast.success(res_data.message);
        navigate("/todos")
      } else if (res_data.error) {
        setFormErrors({
          email: res_data.error.email,
          password: res_data.error.password,
          credentialError: res_data.error.credentialError,
        });
      }
    } catch (error) {
      console.log("In login catch block", error);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Log In</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel} htmlFor="email">
            <span className={styles.inputSpan}>*</span>Email:{" "}
          </label>
          <input
            className={styles.userInput}
            value={logInDetails.email}
            onChange={handleInput}
            type="email"
            name="email"
            required
          ></input>
          <p className={styles.error}>{formErrors.email}</p>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel} htmlFor="password">
            <span className={styles.inputSpan}>*</span>Password:{" "}
          </label>
          <input
            className={styles.userInput}
            value={logInDetails.password}
            onChange={handleInput}
            type="password"
            name="password"
            required
          ></input>
          <p className={styles.error}>{formErrors.password}</p>
          <p className={styles.error}>{formErrors.credentialError}</p>
        </div>
       
        <button className={styles.submitButton} type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
