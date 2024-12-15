import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerPage = ({ userData, onLogout }) => {
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/api/cinema", {
          headers: {
            "x-access-token": userData.accessToken,
          },
        });
        setCustomerData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch customer data");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchCustomerData();
  }, [userData.accessToken]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f0f0f0",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      margin: "0 auto",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    logoutButton: {
      backgroundColor: "white",
      color: "#2563eb",
      border: "none",
      padding: "10px 15px",
      borderRadius: "6px",
      cursor: "pointer",
    },
    content: {
      padding: "20px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      color: "#2563eb",
    },
    errorContainer: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    dataContainer: {
      backgroundColor: "#f9fafb",
      padding: "15px",
      borderRadius: "8px",
      overflowY: "auto",
      maxHeight: "400px",
    },
    dataSection: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    dataTitle: {
      fontWeight: "bold",
      marginBottom: "5px",
    },
    dataItem: {
      flex: 1,
    },
  };

  const renderCustomerData = () => {
    if (!customerData) return null;

    return customerData.map(({ name, time }) => {
      return (
        <div style={styles.dataContainer}>
          <div style={styles.dataSection}>
            <div style={styles.dataTitle}>Name:</div>
            <div style={styles.dataItem}>{name}</div>
          </div>
          <div style={styles.dataSection}>
            <div style={styles.dataTitle}>Time:</div>
            <div style={styles.dataItem}>{time}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>Customer Dashboard</span>
          <button onClick={onLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div style={styles.content}>
          {isLoading ? (
            <div style={styles.loadingContainer}>Loading your data...</div>
          ) : error ? (
            <div style={styles.errorContainer}>{error}</div>
          ) : (
            renderCustomerData()
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
