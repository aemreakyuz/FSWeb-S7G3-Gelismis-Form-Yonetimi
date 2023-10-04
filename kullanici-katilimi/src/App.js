import "./App.css";
import UyelikFormu from "./pages/UyelikFormu";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div className="App">
      <header className="App-header">Üye Olmak için Formu Doldurun</header>
      <UyelikFormu handleAddUser={addUser} />
    </div>
  );
}

export default App;
