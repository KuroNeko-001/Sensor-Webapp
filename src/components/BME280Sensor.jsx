import React, { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { io } from "socket.io-client"; // <-- import socket.io-client

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set up socket connection to the server
const socket = io("https://server-bo47.onrender.com/");

function BME280Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    temperature: [],
    humidity: [],
    latestTemperature: 0,
    latestHumidity: 0,
  });

  useEffect(() => {
    // Listen to the "sensorData" event from the server
    socket.on("sensorData", (data) => {
      console.log("Received data from socket:", data);

      const timestamp = new Date(data.timestamp).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setSensorData((prev) => ({
        labels: [...prev.labels, timestamp].slice(-5), // Keep only the last 5 entries
        temperature: [...prev.temperature, data.temperature ?? 0].slice(-5),
        humidity: [...prev.humidity, data.humidity ?? 0].slice(-5),
        latestTemperature: data.temperature ?? 0,
        latestHumidity: data.humidity ?? 0,
      }));
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("sensorData");
    };
  }, []);

  const lineData = {
    labels: sensorData.labels,
    datasets: [
      {
        label: "Temperature",
        data: sensorData.temperature,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Humidity",
        data: sensorData.humidity,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  const doughnutData = (value, label, color) => ({
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "rgba(0, 0, 0, 0.1)"],
        borderWidth: 0,
      },
    ],
    labels: [label],
  });

  const doughnutOptions = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div
      className="font-kanit bg-white shadow-md rounded-lg"
      style={{
        paddingTop: "10px",
        paddingLeft: "20px",
        paddingRight: "10px",
        paddingBottom: "20px",
      }}
    >
      <h2 className="text-xl text-green-20">BME280 Sensor</h2>
      <h2 className="text-xl font-bold text-black mb-5">
        วัดอุณหภูมิ และ ความชื้นในอากาศ
      </h2>
      <div style={{ width: "450px", height: "200px" }}>
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="flex justify-around">
        <div className="relative h-36 w-36">
          <Doughnut
            data={doughnutData(
              sensorData.latestTemperature,
              "Temperature",
              "rgb(255, 99, 132)"
            )}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-bold">{sensorData.latestTemperature}°C</p>
          </div>
        </div>
        <div className="relative h-36 w-36">
          <Doughnut
            data={doughnutData(
              sensorData.latestHumidity,
              "Humidity",
              "rgb(54, 162, 235)"
            )}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-bold">{sensorData.latestHumidity}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BME280Sensor;
