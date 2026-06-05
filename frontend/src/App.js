import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login onLogin={setUser} onSwitch={() => setPage("register")} />
      ) : (
        <Register onSwitch={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;