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

function MQ135Sensor() {
  const [sensorData, setSensorData] = useState({
    labels: [],
    SO2:[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/modelresults_engvers");
        const data = await response.json();
        console.log("Data from API:", data); // Debugging

        if (data && data.length > 0) {
          const updatedData = {
            labels: data
              .slice(-5)
              .map((item) =>
                new Date(item.timestamp).toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              ),

            SO2: data
              .slice(-5)
              .map((item) => item.so2 ?? 0), // Reverse SO2 data to match labels
          };

          setSensorData(updatedData);
          console.log("Updated sensorData:", updatedData); // Debugging
        } else {
          console.error("No data received from API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
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
      <h2 className="text-xl font-bold text-black">
      ค่าซัลเฟอร์ไดออกไซด์ (SO2)
      </h2>
      <div
        className=""
        style={{ width: "450px", height: "180px", paddingLeft: "50px" }}
      >
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default MQ135Sensor;
