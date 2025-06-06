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
import { io } from "socket.io-client"; // <-- เพิ่ม

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

// สร้าง connection ไปที่ Socket.IO server
const socket = io("https://server-bo47.onrender.com/");

function MQ7Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    CO: [],
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

      setSensorData((prev) => ({
        labels: [...prev.labels, timestamp].slice(-5),     // เก็บแค่ 5 ค่าสุดท้าย
        CO:      [...prev.CO, data.co ?? 0].slice(-5),     // data.co มาจาก server
      }));
    });

    // ทำความสะอาด listener เมื่อ component unmount
    return () => {
      socket.off("sensorData");
    };
  }, []);

  const lineData = {
    labels: sensorData.labels,
    datasets: [
      {
        label: "CO Level",
        data: sensorData.CO,
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
        marginBottom: "230px",
      }}
    >
      <h2 className="text-xl text-green-20">MQ7 Sensor</h2>
      <h2 className="text-xl font-bold text-black">
        ตรวจวัดก๊าซคาร์บอนมอนอกไซด์ (CO)
      </h2>
      <div style={{ width: "500px", height: "130px", paddingLeft: "100px" }}>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default MQ7Sensor
