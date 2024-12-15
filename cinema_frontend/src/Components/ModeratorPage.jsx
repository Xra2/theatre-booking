import React, { useState, useEffect } from "react";
import axios from "axios";

const ModeratorPage = ({ userData }) => {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [formData, setFormData] = useState({ name: "", time: "" });

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    error: {
      color: "red",
      marginBottom: "15px",
    },
    success: {
      color: "green",
      marginBottom: "15px",
    },
    button: {
      padding: "10px 15px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      margin: "5px",
    },
    cinemaList: {
      listStyle: "none",
      padding: 0,
    },
    cinemaItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #eee",
    },
  };

  // Fetch all cinemas
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cinema", {
          headers: { "x-access-token": userData.accessToken },
        });
        setCinemas(response.data);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    fetchCinemas();
  }, [userData.accessToken]);

  // Handle edit button click
  const handleEditClick = (cinema) => {
    setSelectedCinema(cinema);
    setFormData({
      name: cinema.name,
      time: cinema.time,
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCinema) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/cinema/${selectedCinema.id}`,
        formData,
        {
          headers: { "x-access-token": userData.accessToken },
        }
      );
      console.log("Update successful:", response.data);

      // Update the cinema list locally
      setCinemas((prevCinemas) =>
        prevCinemas.map((cinema) =>
          cinema.id === selectedCinema.id ? { ...cinema, ...formData } : cinema
        )
      );

      // Reset form and selected cinema
      setSelectedCinema(null);
      setFormData({ name: "", time: "" });
    } catch (error) {
      console.error("Error updating cinema:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Moderator Page</h1>

      {/* Cinema list */}
      <div>
        <h2 style={styles.header}>Cinema List</h2>
        <ul style={styles.cinemaList}>
          {cinemas.map((cinema) => (
            <li key={cinema.id} style={styles.cinemaItem}>
              <span>{cinema.name} - {cinema.time}</span>
              <button 
                style={styles.button} 
                onClick={() => handleEditClick(cinema)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit form */}
      {selectedCinema && (
        <div>
          <h2 style={styles.header}>Edit Cinema</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name:</label>
              <input
                style={styles.input}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Time:</label>
              <input
                style={styles.input}
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            <div>
              <button 
                style={styles.button} 
                type="submit"
              >
                Save Changes
              </button>
              <button 
                style={styles.button} 
                type="button" 
                onClick={() => setSelectedCinema(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ModeratorPage;