import React, { useState, useEffect } from "react";
import axios from "axios";

export const AdminPage = ({ userData }) => {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [formData, setFormData] = useState({ name: "", time: "" });
  const [isCreating, setIsCreating] = useState(false);

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#f4f4f4",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      backgroundColor: "white",
    },
    tableHeader: {
      backgroundColor: "#007bff",
      color: "white",
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
    },
    tableCell: {
      padding: "10px",
      textAlign: "left",
    },
    button: {
      padding: "8px 12px",
      margin: "0 5px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    editButton: {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white", 
      border: "none",
    },
    createButton: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "10px 15px",
      marginBottom: "15px",
    },
    form: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    formButtons: {
      display: "flex",
      justifyContent: "space-between",
    }
  };

  // Fetch cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cinema", {
          headers: { "x-access-token": userData.accessToken }
        });
        setCinemas(response.data);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    fetchCinemas();
  }, [userData.accessToken]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle edit cinema
  const handleEdit = (cinema) => {
    setSelectedCinema(cinema);
    setFormData({ name: cinema.name, time: cinema.time });
    setIsCreating(false);
  };

  // Handle delete cinema
  const handleDelete = async (cinemaId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cinema/${cinemaId}`, {
        headers: { "x-access-token": userData.accessToken }
      });
      setCinemas(cinemas.filter(cinema => cinema.id !== cinemaId));
    } catch (error) {
      console.error("Error deleting cinema:", error);
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isCreating) {
        // Create new cinema
        const response = await axios.put("http://localhost:8080/api/cinema", formData, {
          headers: { "x-access-token": userData.accessToken }
        });
        setCinemas([...cinemas, response.data]);
      } else {
        // Update existing cinema
        const response = await axios.post(
          `http://localhost:8080/api/cinema/${selectedCinema.id}`, 
          formData,
          {
            headers: { "x-access-token": userData.accessToken }
          }
        );
        console.log(response.data)
        setCinemas(cinemas.map(cinema => 
          cinema.id === selectedCinema.id ? response.data.cinema : cinema
        ));
      }
      
      // Reset form and selection
      setSelectedCinema(null);
      setFormData({ name: "", time: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Error submitting cinema:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cinema Management</h1>

      {/* Create New Cinema Button */}
      <button 
        style={{...styles.button, ...styles.createButton}}
        onClick={() => {
          setIsCreating(true);
          setSelectedCinema(null);
          setFormData({ name: "", time: "" });
        }}
      >
        Create New Cinema
      </button>

      {/* Cinema List */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Time</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((cinema) => (
            <tr key={cinema.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{cinema.name}</td>
              <td style={styles.tableCell}>{cinema.time}</td>
              <td style={styles.tableCell}>
                <button 
                  style={{...styles.button, ...styles.editButton}}
                  onClick={() => handleEdit(cinema)}
                >
                  Edit
                </button>
                <button 
                  style={{...styles.button, ...styles.deleteButton}}
                  onClick={() => handleDelete(cinema.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create/Edit Form */}
      {(selectedCinema || isCreating) && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.header}>
            {isCreating ? "Create New Cinema" : "Edit Cinema"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Cinema Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="time"
            placeholder="Cinema Time"
            value={formData.time}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={styles.formButtons}>
            <button 
              type="submit" 
              style={{...styles.button, ...styles.editButton}}
            >
              {isCreating ? "Create" : "Update"}
            </button>
            <button 
              type="button" 
              style={{...styles.button, ...styles.deleteButton}}
              onClick={() => {
                setSelectedCinema(null);
                setIsCreating(false);
                setFormData({ name: "", time: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminPage;