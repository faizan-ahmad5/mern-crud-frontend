import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'; // Importing CircularProgress for loading spinner

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users. Please try again later.'); // Notify user of error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleClickOpen = (index) => {
    setCurrentIndex(index);
    setNewName(users[index].name);
    setNewEmail(users[index].email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!newName || !newEmail) {
      alert('Please fill out both fields!'); // Simple validation
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      alert('Please enter a valid email address!');
      return;
    }

    const user = { name: newName, email: newEmail };
    setLoading(true); // Set loading to true
    try {
      if (currentIndex !== null) {
        await axios.put(`${API_URL}/${users[currentIndex]._id}`, user); // Updated for MongoDB
      } else {
        await axios.post(API_URL, user);
      }
      fetchUsers();
      alert('User saved successfully!'); // Success message
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.'); // Notify user of error
    } finally {
      setLoading(false); // Set loading to false
    }
    handleClose();
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true); // Set loading to true
      try {
        await axios.delete(`${API_URL}/${users[index]._id}`); // Updated for MongoDB
        fetchUsers();
        alert('User deleted successfully!'); // Success message
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.'); // Notify user of error
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };

  const handleAddUser = () => {
    setCurrentIndex(null);
    setNewName('');
    setNewEmail('');
    setOpen(true);
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>User Management</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddUser} 
        style={{ margin: '20px', marginLeft: '25%' }}
        disabled={loading} // Disable button during loading
      >
        Add User
      </Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} style={{ width: '50%' }}>
          <Table sx={{ minWidth: 200 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? ( // Show loading indicator while loading
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress /> {/* Display loading spinner */}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row, index) => (
                  <TableRow key={row._id}> {/* Updated key to use _id from MongoDB */}
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleClickOpen(index)} 
                        style={{ marginRight: '10px' }}
                        disabled={loading} // Disable button during loading
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleDelete(index)}
                        disabled={loading} // Disable button during loading
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentIndex !== null ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentIndex !== null ? 'Edit the details of the user.' : 'Enter the details of the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading}> {/* Disable button during loading */}
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
