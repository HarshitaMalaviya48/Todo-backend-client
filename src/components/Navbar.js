import styles from "../styles/Navbar.module.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
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
                <li>
                  <NavLink to="/logout" className={styles.link}>
                    <div style={{width: "50px", height: "50px", border: "2px solid black", borderRadius: "50%"}}></div>
                  </NavLink>
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
