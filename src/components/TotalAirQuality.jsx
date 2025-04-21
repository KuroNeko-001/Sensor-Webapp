import React, { useEffect, useState } from "react";
import image1 from "../assets/images/Smiling Face Emoji with Blushed Cheeks.png";
import image2 from "../assets/images/Neutral Face Emoji.png";
import image3 from "../assets/images/Very Sad Emoji.png";

const AirQualityDisplay = () => {
  const [latestAqi, setLatestAqi] = useState(null);
  const [aqiClass, setAqiClass] = useState(null);

  useEffect(() => {
    // ดึงข้อมูล AQI จาก API
    const fetchAQI = async () => {
      try {
        const response = await fetch("https://server-bo47.onrender.com/api/modelresults_engvers");
        const data = await response.json();
        const latestData = data[data.length - 1]; // เก็บเฉพาะค่าล่าสุด
        setLatestAqi(latestData);
        setAqiClass(latestData.aqi_class); // เก็บค่า aqi_class
      } catch (error) {
        console.error("Failed to fetch AQI data:", error);
      }
    };

    fetchAQI();
  }, []);

  if (!latestAqi) {
    return <p>Loading...</p>; // แสดงข้อความ Loading ขณะรอข้อมูล
  }

  let qualityLevel;
  let imageSrc;
  let description;
  let textColor;

  if (aqiClass <= 0) {
    textColor = "green";
    qualityLevel = "ดี";
    imageSrc = image1;
    description = "คุณภาพอากาศดีมาก";
  } else if (aqiClass <= 2) {
    qualityLevel = "ปานกลาง";
    imageSrc = image2;
    description = "คุณภาพอากาศปานกลาง";
    textColor = "orange";
  } else {
    qualityLevel = "แย่";
    imageSrc = image3;
    description = "คุณภาพอากาศไม่ดีต่อสุขภาพ";
    textColor = "red";
  }

  return (
    <div
      className={"font-kanit rounded-md shadow-md bg-white"}
      style={{
        paddingTop: "10px",
        paddingLeft: "20px",
        paddingRight: "96px",
        paddingBottom: "30px",
        border: "1px solid #ddd",
      }}
    >
      <div>
        <h2 className="text-xl text-green-20">Total Air Quality</h2>
        <h2 className="text-xl font-bold text-black mb-10">
          สภาพอากาศในห้องเรียนโดยรวม
        </h2>
        <img
          src={imageSrc}
          alt={description}
          className=""
          style={{
            marginBottom: "60px",
            marginLeft: "130px",
            width: "200px",
            height: "200px",
          }}
        />
        <h1
          className=""
          style={{ fontSize: 27, fontWeight: "bold", marginLeft: "90px" }}
        >
          ระดับคุณภาพ: <span style={{ color: textColor }}>{qualityLevel}</span>
        </h1>
        <h2
          className="text-lg font-bold text-black mt-5"
          style={{ marginLeft: "90px" }}
        >
        </h2>
      </div>
    </div>
  );
};

export default AirQualityDisplay;
