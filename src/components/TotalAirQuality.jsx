import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import image1 from "../assets/images/Smiling Face Emoji with Blushed Cheeks.png";
import image2 from "../assets/images/Neutral Face Emoji.png";
import image3 from "../assets/images/Very Sad Emoji.png";

// สร้างการเชื่อมต่อ Socket.IO
const socket = io("https://server-bo47.onrender.com/");

const AirQualityDisplay = () => {
  const [latestAqi, setLatestAqi] = useState(null);
  const [aqiClass, setAqiClass] = useState(null);

  useEffect(() => {
    // 1) Fetch ค่า AQI แรกเข้าไว้เหมือนเดิม (optional)
    const fetchAQI = async () => {
      try {
        const response = await fetch(
          "https://server-bo47.onrender.com/api/modelresults_engvers"
        );
        const data = await response.json();
        const latestData = data[data.length - 1];
        setLatestAqi(latestData);
        setAqiClass(latestData.aqi_class);
      } catch (error) {
        console.error("Failed to fetch AQI data:", error);
      }
    };
    fetchAQI();

    // 2) ติด Listener รอรับอีเวนต์ใหม่ชื่อ "modelResult"
    socket.on("modelResult", (newResult) => {
      // สมมติ server emit มาเป็น object ที่มี aqi_class และ timestamp, aqi_label
      setLatestAqi(newResult);
      setAqiClass(newResult.aqi_class);
    });

    return () => {
      socket.off("modelResult");
    };
  }, []);

  if (!latestAqi) return <p>Loading...</p>;

  let qualityLevel, imageSrc, description, textColor;
  if (aqiClass <= 0) {
    textColor = "green";
    qualityLevel = "ดี";
    imageSrc = image1;
    description = "คุณภาพอากาศดีมาก";
  } else if (aqiClass <= 2) {
    textColor = "orange";
    qualityLevel = "ปานกลาง";
    imageSrc = image2;
    description = "คุณภาพอากาศปานกลาง";
  } else {
    textColor = "red";
    qualityLevel = "แย่";
    imageSrc = image3;
    description = "คุณภาพอากาศไม่ดีต่อสุขภาพ";
  }

  return (
    <div
      className="font-kanit rounded-md shadow-md bg-white"
      style={{
        padding: "10px 20px 30px",
        border: "1px solid #ddd",
      }}
    >
      <h2 className="text-xl text-green-20">Total Air Quality</h2>
      <h2 className="text-xl font-bold text-black mb-10">
        สภาพอากาศในห้องเรียนโดยรวม
      </h2>
      <img
        src={imageSrc}
        alt={description}
        style={{
          margin: "0 auto 60px",
          display: "block",
          width: 200,
          height: 200,
        }}
      />
      <h1 style={{ fontSize: 27, fontWeight: "bold", textAlign: "center" }}>
        ระดับคุณภาพ:{" "}
        <span style={{ color: textColor }}>{qualityLevel}</span>
      </h1>
    </div>
  );
};

export default AirQualityDisplay;
