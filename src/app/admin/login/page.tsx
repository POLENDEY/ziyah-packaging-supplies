import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />
    </div>
  );
}
