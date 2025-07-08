import { useState } from "react";

import styles from "../styles/Navbar.module.css";
import { NavLink } from "react-router-dom";
import { AuthConsumer } from "../store/auth";

function Navbar() {
  const { isLoggedIn,  userprofilePicture} = AuthConsumer();
  const imageUrl = userprofilePicture;
  console.log("in navbar", userprofilePicture);
  
  const [showDropDown, setShowDropDown] = useState(false);

  const handleProfileClick = () => {
    setShowDropDown((prev) => !prev);
  };
  return (
    <>
      <header className={styles.container}>
        <div className={styles.appName}>Todo App</div>
        <nav>
          <ul className={styles.links}>
            <li>
              <NavLink to="/" className={styles.link}>
                Home
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/todos" className={styles.link}>
                    Todos
                  </NavLink>
                </li>
                <li className={styles.profileContainer}>
                  <div className={styles.imageDiv} onClick={handleProfileClick}>
                    <img src={imageUrl} className={styles.image}></img>
                  </div>
                  {showDropDown && (
                    <div className={styles.dropDown}>
                      <NavLink to="/update-Profile" className={styles.link}>Update Profile</NavLink>
                      <NavLink to="/logout" className={styles.link} >Logout</NavLink>
                      <NavLink to="/delete-Profile" className={styles.link} >Delete Profile</NavLink>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/register" className={styles.link}>
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className={styles.link}>
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
