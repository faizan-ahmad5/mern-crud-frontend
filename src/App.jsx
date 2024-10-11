// src/components/App.js
import React from 'react';

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div>
      <h1>User Management</h1>
    </div>
  );
};

export default App;
