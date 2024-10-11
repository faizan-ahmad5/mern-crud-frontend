// src/components/App.js
import React from 'react';

const App = () => {
  const [users, setUsers] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users. Please try again later.');
    }
  };

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
