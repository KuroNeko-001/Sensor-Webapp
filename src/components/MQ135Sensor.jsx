import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
import { io } from "socket.io-client"; // <-- เพิ่มตรงนี้

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

const socket = io("https://server-bo47.onrender.com/"); // <-- Connect socket server

function MQ135Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    SO2: [],
  });

  useEffect(() => {
    // ฟัง event "sensorData" จาก server
    socket.on("sensorData", (data) => {
      console.log("ข้อมูลใหม่จาก socket:", data);

      const timestamp = new Date(data.timestamp).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setSensorData((prevData) => {
        const newLabels = [...prevData.labels, timestamp].slice(-5);
        const newSO2 = [...prevData.SO2, data.so2 ?? 0].slice(-5);

        return {
          labels: newLabels,
          SO2: newSO2,
        };
      });
    });

    // ตอน component unmount ให้ปิด socket listener
    return () => {
      socket.off("sensorData");
    };
  }, []);

  const lineData = {
    labels: sensorData.labels,
    datasets: [
      {
        label: "SO2 Level",
        data: sensorData.SO2,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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
      <h2 className="text-xl text-green-20">MQ135 Sensor</h2>
      <h2 className="text-xl font-bold text-black">ค่าซัลเฟอร์ไดออกไซด์ (SO2)</h2>
      <div
        style={{ width: "450px", height: "180px", paddingLeft: "50px" }}
      >
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default MQ135Sensor;
