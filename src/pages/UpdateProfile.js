import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthConsumer } from "../store/auth";
import styles from "../styles/UpdateProfile.module.css";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const {
    token,
    setToken,
    setIsLoggedIn,
    userprofilePicture,
    setUserprofilePicture,
  } = AuthConsumer();
  const navigate = useNavigate();

  // console.log("toke in update profile", token);

  const initialFormValue = {
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
    profile: "",
  };
  const [originalDetails, setOriginalDetails] = useState({});
  const [displayData, setDisplayData] = useState({});
  const [formData, setFormData] = useState(initialFormValue);
  const [formError, setFormError] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetchdata");

        const response = await fetch("http://localhost:3001/user/get-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res_data = await response.json();

        if (response.status === 200 && res_data.data) {
          const data = res_data.data;
          const userDetails = {
            userName: data.userName || "",
            email: data.email || "",
            phoneNo: data.phoneNo || "",
            profile: data.profile || "",
          };

          setDisplayData(userDetails);
          setOriginalDetails(userDetails);
        } else if (res_data.redirectToLogin) {
          navigate("/login");
          setToken("");
          setIsLoggedIn(false);
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Something went wrong while fetching user data");
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, shouldRefresh]);

  const handleInputFocus = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    console.log("in handleInputChange");

    console.log(name, value, files);

    if (name === "profile") {
      console.log("setting profile");

      setFormData({
        ...formData,
        profile: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleupdatebutton = async (e) => {
    e.preventDefault();
    const updatedField = {};
    console.log("form to send data", formData);
    console.log("originaldetails", originalDetails);
    for (let key in formData) {
      if (
        (key === "profile" && formData[key] instanceof File) ||
        (originalDetails[key] !== formData[key] && formData[key] !== "")
      ) {
        updatedField[key] = formData[key];
      }
    }

    if (Object.keys(updatedField).length === 0) {
      toast.error("Nothing is provided");
      setFormError({})
      return;
    }

    const formTosend = new FormData();
    for (let key in updatedField) {
      formTosend.append(key, updatedField[key]);
    }
    console.log("form data", formData);

    console.log("form to send data", formTosend);

    const response = await fetch("http://localhost:3001/user/update", {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formTosend,
    });
    console.log("in update user1", userprofilePicture);

    const res_data = await response.json();

    console.log("in update user2", userprofilePicture);

    if (response.status === 200) {
      const data = res_data.data;
      setShouldRefresh((prev) => !prev);
      if (data.profile) {
        setUserprofilePicture(data.profile);
      }

      toast.success(res_data.message);
      setFormData(initialFormValue);
      setFormError({});
      setDisplayData(data);
      setOriginalDetails(data);
      if (res_data.redirectToLogin === true) {
        navigate("/login");
        setToken("");
        setIsLoggedIn(false);
      }
    } else if (response.status === 400 && res_data.error) {
      const error = res_data.error;
      setFormError({
        userName: error.userName,
        email: error.email,
        phoneNo: error.phoneNo,
        password: error.password,
      });
    } else if (response.status === 409 && res_data.error) {
      toast.error(res_data.error);
    }

    console.log("in update button handler", response);
    console.log("in update button handler", res_data);
  };
  return (
    <div className={styles.updateContainer}>
      <div className={styles.container}>
        <h1>Update Profile</h1>
        <form onSubmit={handleupdatebutton} className={styles.form} noValidate>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              <span className={styles.inputSpan}>*</span>User Name:{" "}
            </label>
            <input
              className={styles.userInput}
              type="text"
              name="userName"
            
              value={formData.userName}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("userName")}
              required
            ></input>
            <p className={styles.error}>{formError.userName}</p>
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              <span className={styles.inputSpan}>*</span>Email:{" "}
            </label>
            <input
              className={styles.userInput}
              type="email"
              name="email"
            
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("email")}
              required
            ></input>
            <p className={styles.error}>{formError.email}</p>
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              <span className={styles.inputSpan}>*</span>Phone No:{" "}
            </label>
            <input
              className={styles.userInput}
              type="number"
              name="phoneNo"
         
              value={formData.phoneNo}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("phoneNo")}
              required
            ></input>
            <p className={styles.error}>{formError.phoneNo}</p>
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>Profile: </label>
            <input
              className={styles.userInput}
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.inputLabel}>
              <span className={styles.inputSpan}>*</span>Password:{" "}
            </label>
            <input
              className={styles.userInput}
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("password")}
              required
            ></input>
            <p className={styles.error}>{formError.password}</p>
          </div>
          <button className={styles.submitButton} type="submit">
            Update
          </button>
        </form>
      </div>
      <div className={styles.profileContainer}>
        <h2>Current Profile Data</h2>
        <p>
          <strong>User Name:</strong> {displayData.userName}
        </p>
        <p>
          <strong>Email:</strong> {displayData.email}
        </p>
        <p>
          <strong>Phone No:</strong> {displayData.phoneNo}
        </p>
        {displayData.profile && typeof displayData.profile === "string" ? (
          <p>
            {" "}
            <strong>Profile Picture:</strong>{" "}
            {displayData.profile.split("/").pop().split("_").pop()}
          </p>
        ) : (
          <p>
            <strong>Profile Picture:</strong> Not uploaded
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdateProfile;
