import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthConsumer } from "../store/auth";
//toast
import { toast } from "react-toastify";
import styles from "../styles/SignUp.module.css";

function SignUp() {
  const {storeProfileInLS} = AuthConsumer();
  const navigate = useNavigate();

  const initialVlaue = {
    userName: "",
    email: "",
    phoneNo: "",
    profile: "",
    password: "",
    confirmPassword: "",
  };
  const [userDetails, setUserDetails] = useState(initialVlaue);
  const [formErrors, setFormErrors] = useState({});

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    console.log("outside if block");

    if (name === "profile") {
      console.log("files", files[0]);

      setUserDetails({
        ...userDetails,
        profile: files[0],
      });
    } else {
      setUserDetails({
        ...userDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign up", userDetails);
    try {
      const formData = new FormData();
      formData.append("userName", userDetails.userName);
      formData.append("email", userDetails.email);
      formData.append("phoneNo", userDetails.phoneNo);
      formData.append("profile", userDetails.profile);
      formData.append("password", userDetails.password);
      formData.append("confirmPassword", userDetails.confirmPassword)
      const response = await fetch("http://localhost:3001/auth/registration", {
        method: "POST",
        body: formData,
      });
      console.log("Sign up", response);
      const res_data = await response.json();
      // setMessage(data.message)
      console.log("data", res_data);

      if (response.status === 200) {
        const data = res_data.data
        setUserDetails(initialVlaue);
        setFormErrors({});
        toast.success(res_data.message);
        // window.localStorage.setItem("profile", data.profile)
       storeProfileInLS(data.profile);
        navigate("/login");
      } else if (res_data.error && response.status === 400) {
        const error = res_data.error;
        setFormErrors({
          userName: error.userName,
          email: error.email,
          phoneNo: error.phoneNo,
          password: error.password,
          confirmPassword: error.confirmPassword,
          passwordDoesNotMatchError: error.passwordDoesNotMatchError
        });
      } else if (response.status === 409) {
        toast.error(res_data.error);
      }
    } catch (error) {
      console.log("sign in catch block", error);
    }

    // setUserDetails(initialVlaue)
  };
  return (
    <div className={styles.container}>
      <h1>SignUp</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>
            <span className={styles.inputSpan}>*</span>User Name:{" "}
          </label>
          <input
            className={styles.userInput}
            value={userDetails.userName}
            onChange={handleInput}
            type="text"
            name="userName"
            required
          ></input>
          <p className={styles.error}>{formErrors.userName}</p>
        </div>

        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>
            <span className={styles.inputSpan}>*</span>Email:{" "}
          </label>
          <input
            className={styles.userInput}
            value={userDetails.email}
            onChange={handleInput}
            type="email"
            name="email"
            required
          ></input>
          <p className={styles.error}>{formErrors.email}</p>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>
            <span className={styles.inputSpan}>*</span>Phone No:{" "}
          </label>
          <input
            className={styles.userInput}
            value={userDetails.phoneNo}
            onChange={handleInput}
            type="number"
            name="phoneNo"
            required
          ></input>
          <p className={styles.error}>{formErrors.phoneNo}</p>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>Profile: </label>
          <input
            className={styles.userInput}
            // value={userDetails.profile}
            onChange={handleInput}
            type="file"
            name="profile"
            accept="image/*"
          ></input>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>
            <span className={styles.inputSpan}>*</span>Password:{" "}
          </label>
          <input
            className={styles.userInput}
            value={userDetails.password}
            onChange={handleInput}
            type="password"
            name="password"
            required
          ></input>
          <p className={styles.error}>{formErrors.password}</p>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.inputLabel}>
            <span className={styles.inputSpan}>*</span>Confirm Password:{" "}
          </label>
          <input
            className={styles.userInput}
            value={userDetails.confirmPassword}
            onChange={handleInput}
            type="password"
            name="confirmPassword"
            required
          ></input>
          <p className={styles.error}>{formErrors.confirmPassword} {formErrors.passwordDoesNotMatchError}</p>

        </div>
        <button className={styles.submitButton} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
