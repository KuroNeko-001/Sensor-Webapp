import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://server-bo47.onrender.com/"); 

const AQIChart = () => {
  const [aqi, setAqi] = useState(null);
  const [aqiLevel, setAqiLevel] = useState({ color: "", text: "" });
  const [loading, setLoading] = useState(true);

  
  const updateAqiLevel = (value) => {
    if (value <= 0) {
      setAqiLevel({ color: "bg-green-200", text: "Good" });
    } else if (value <= 1) {
      setAqiLevel({ color: "bg-yellow-200", text: "Moderate" });
    } else if (value <= 2) {
      setAqiLevel({
        color: "bg-orange-200",
        text: "Unhealthy for Sensitive Groups",
      });
    } else if (value <= 3) {
      setAqiLevel({ color: "bg-red-200", text: "Unhealthy" });
    } else {
      setAqiLevel({ color: "bg-purple-200", text: "Very Unhealthy" });
    }
  };

  useEffect(() => {
    
    const fetchAQI = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://server-bo47.onrender.com/api/modelresults_engvers"
        );
        const data = await res.json();
        const latest = data[data.length - 1]?.aqi_class ?? 0;
        setAqi(latest);
        updateAqiLevel(latest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAQI();

    
    socket.on("modelResult", (result) => {
      setLoading(false);
      const v = result.aqi_class;
      setAqi(v);
      updateAqiLevel(v);
    });

    return () => {
      socket.off("modelResult");
    };
  }, []);

  return (
    <div
      className="font-kanit bg-white rounded-lg shadow-md"
      style={{
        padding: "10px 20px 20px",
        marginBottom: "230px",
      }}
    >
      <h2 className="text-xl text-green-20">AQI ระดับคุณภาพในอากาศ</h2>
      <h2 className="text-xl text-black">Air Quality Index</h2>

      {loading ? (
        <div className="my-4 text-gray-600 font-bold">Loading...</div>
      ) : (
        <div
          className={`my-4 border font-bold border-gray-300 rounded-lg p-4 ${aqiLevel.color}`}
        >
          <p className="text-gray-600">{aqiLevel.text}</p>
          <p className="text-2xl font-extrabold">AQI: {aqi}</p>
        </div>
      )}

      
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="bg-green-200 text-gray-800 font-bold py-2 px-4 rounded">
          Good
        </button>
        <button className="bg-yellow-200 text-gray-800 font-bold py-2 px-4 rounded">
          Moderate
        </button>
        <button className="bg-orange-200 text-gray-800 font-bold py-2 px-4 rounded">
          Unhealthy for Sensitive Groups
        </button>
        <button className="bg-red-200 text-gray-800 font-bold py-2 px-4 rounded">
          Unhealthy
        </button>
        <button className="bg-purple-200 text-gray-800 font-bold py-2 px-4 rounded">
          Very Unhealthy
        </button>
      </div>
    </div>
  );
};

export default AQIChart;
