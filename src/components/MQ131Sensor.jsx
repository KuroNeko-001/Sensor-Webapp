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
import { io } from "socket.io-client"; // <-- นำเข้า Socket.IO

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

// สร้างการเชื่อมต่อ Socket.IO
const socket = io("https://server-bo47.onrender.com/"); // <-- ระบุ URL ของ server ที่มี Socket.IO

function MQ131Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    ozone: [],
    no2: [],
  });

  useEffect(() => {
    // ฟัง event "sensorData" จาก server
    socket.on("sensorData", (data) => {
      console.log("ข้อมูลใหม่จาก socket:", data); // ดูข้อมูลที่ส่งมา

      const timestamp = new Date(data.timestamp).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setSensorData((prevData) => {
        const updatedLabels = [...prevData.labels, timestamp].slice(-5); // เก็บแค่ 5 ค่าใหม่ล่าสุด
        const updatedOzone = [...prevData.ozone, data.ozone ?? 0].slice(-5);
        const updatedNO2 = [...prevData.no2, data.no2 ?? 0].slice(-5);

        return {
          labels: updatedLabels,
          ozone: updatedOzone,
          no2: updatedNO2,
        };
      });
    });

    // เมื่อ component ถูก unmount ให้หยุดรับข้อมูลจาก socket
    return () => {
      socket.off("sensorData");
    };
  }, []);

  const lineData = {
    labels: sensorData.labels,
    datasets: [
      {
        label: "Ozone Level",
        data: sensorData.ozone,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "NO2 Level",
        data: sensorData.no2,
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

  return (
    <div
      className="font-kanit bg-white rounded-lg shadow-md"
      style={{
        paddingTop: "10px",
        paddingLeft: "20px",
        paddingRight: "10px",
        paddingBottom: "20px",
        marginLeft: "512px",
        marginTop: "235px",
        position: "absolute",
      }}
    >
      <h2 className="text-xl text-green-20">MQ131 Sensor</h2>
      <h2 className="text-xl font-bold text-black">ตรวจวัดก๊าซโอโซน (O3)</h2>
      <div
        className=""
        style={{ width: "500px", height: "130px", paddingLeft: "100px" }}
      >
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default MQ131Sensor;
