
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState({
    cpu: 0,
    ram: 0,
    disk: 0
  });

  const [lastUpdated, setLastUpdated] = useState("");

  const fetchHealth = async () => {

  try {

    const res = await axios.get("http://localhost:5000/api/health");

    setHealth(res.data);

    const currentTime = new Date().toLocaleTimeString();

    const newLog = `[${currentTime}] Health metrics updated | CPU: ${res.data.cpu}% | RAM: ${res.data.ram}% | Disk: ${res.data.disk}%`;

    setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)]);
    
    setLastUpdated(currentTime);

  } catch (error) {

    const errorTime = new Date().toLocaleTimeString();

    const errorLog = `[${errorTime}] ERROR: Monitoring service failed`;

    setLogs((prevLogs) => [errorLog, ...prevLogs.slice(0, 9)]);

    console.log(error);

  }
};

  useEffect(() => {

    fetchHealth();

    const interval = setInterval(fetchHealth, 5000);

    return () => clearInterval(interval);

  }, []);

  const getStatus = (value) => {

    if (value > 80) return "Critical";
    if (value > 60) return "Warning";

    return "Healthy";
  };

  const getBorderColor = (value) => {

    if (value > 80) return "red";
    if (value > 60) return "orange";

    return "green";
  };

  const overallStatus = () => {

    if (
      health.cpu > 80 ||
      health.ram > 80 ||
      health.disk > 80
    ) {
      return "CRITICAL";
    }

    if (
      health.cpu > 60 ||
      health.ram > 60 ||
      health.disk > 60
    ) {
      return "WARNING";
    }

    return "HEALTHY";
  };

  const incidents = [
    {
      title: "High CPU Usage",
      severity: "P2",
      status: "Open"
    },
    {
      title: "Disk Space Warning",
      severity: "P3",
      status: "Monitoring"
    }
  ];

  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>InfraWatch Lite</h1>

      <div style={styles.statusContainer}>
        <h2>System Status: {overallStatus()}</h2>
        <p>Last Updated: {lastUpdated}</p>
      </div>

      <div style={styles.cardContainer}>

        <div
          style={{
            ...styles.card,
            border: `3px solid ${getBorderColor(health.cpu)}`
          }}
        >
          <h2>Production CPU Utilization</h2>
          <h1>{health.cpu}%</h1>
          <p>Status: {getStatus(health.cpu)}</p>
        </div>

        <div
          style={{
            ...styles.card,
            border: `3px solid ${getBorderColor(health.ram)}`
          }}
        >
          <h2>Memory Utilization</h2>
          <h1>{health.ram}%</h1>
          <p>Status: {getStatus(health.ram)}</p>
        </div>

        <div
          style={{
            ...styles.card,
            border: `3px solid ${getBorderColor(health.disk)}`
          }}
        >
          <h2>Disk Utilization</h2>
          <h1>{health.disk}%</h1>
          <p>Status: {getStatus(health.disk)}</p>
        </div>

      </div>

      <div style={styles.section}>

        <h2>Active Alerts</h2>

        {health.cpu > 80 && (
          <div style={styles.alertCritical}>
            HIGH CPU USAGE DETECTED
          </div>
        )}

        {health.ram > 80 && (
          <div style={styles.alertCritical}>
            HIGH MEMORY USAGE DETECTED
          </div>
        )}

        {health.disk > 80 && (
          <div style={styles.alertWarning}>
            DISK SPACE WARNING
          </div>
        )}

        {
          health.cpu <= 80 &&
          health.ram <= 80 &&
          health.disk <= 80 && (
            <div style={styles.noAlert}>
              No active alerts
            </div>
          )
        }

      </div>

      <div style={styles.section}>

        <h2>Recent Incidents</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Incident</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident, index) => (
              <tr key={index}>
                <td>{incident.title}</td>
                <td>{incident.severity}</td>
                <td>{incident.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div style={styles.section}>

        <h2>System Logs</h2>

        <div style={styles.logBox}>

        {logs.slice(0,3).map((log, index) => (
          <p key={index}>{log}</p>
        ))}

        </div>

      </div>  

    </div>
  );
}

const styles = {

  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "30px",
    fontFamily: "Arial"
  },

  heading: {
    marginBottom: "10px"
  },

  statusContainer: {
    marginBottom: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px"
  },

  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "12px",
    width: "280px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)"
  },

  section: {
    marginTop: "40px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },

  alertCritical: {
    background: "#7f1d1d",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px"
  },

  alertWarning: {
    background: "#78350f",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px"
  },

  noAlert: {
    background: "#14532d",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },

  logBox: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px"
  }
};

export default App;
