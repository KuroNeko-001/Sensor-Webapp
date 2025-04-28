import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SDS011Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    PM2_5: [],
    PM10: [],
  });


  useEffect(() => {
    const socket = io("https://server-bo47.onrender.com/"); // เชื่อมต่อ socket

    socket.on("connect", () => {
      console.log("Connected to server via Socket.IO");
    });

    socket.on("sensorData", (data) => {
      console.log("Received real-time data:", data);

      if (data) {
        const timestamp = new Date(data.timestamp).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setSensorData((prevData) => {
          const newLabels = [...prevData.labels, timestamp].slice(-5); // เก็บเวลาแค่ 5 ตัวล่าสุด
          const newPM2_5 = [...prevData.PM2_5, data.pm2_5 ?? 0].slice(-5); // เก็บค่า PM2.5 ล่าสุด 5 ตัว
          const newPM10 = [...prevData.PM10, data.pm10 ?? 0].slice(-5); // เก็บค่า PM10 ล่าสุด 5 ตัว

          return {
            labels: newLabels,
            PM2_5: newPM2_5,
            PM10: newPM10,
          };
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect(); // cleanup ตอน unmount
    };
  }, []);

  const lineData = {
    labels: sensorData.labels,
    datasets: [
      {
        label: "PM2.5",
        data: sensorData.PM2_5,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "PM10",
        data: sensorData.PM10,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div
      className="font-kanit bg-white rounded-lg shadow-md"
      style={{
        paddingTop: "10px",
        paddingLeft: "20px",
        paddingRight: "10px",
        marginBottom: "180px",
      }}
    >
      <h2 className="text-xl text-green-20">SDS011 Sensor</h2>
      <h2 className="text-xl font-bold text-black">
        ตรวจค่าฝุ่น PM2.5 และ PM10 (Real-Time)
      </h2>
      <div style={{ width: "500px", height: "180px", paddingLeft: "70px" }}>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default SDS011Sensor
