import React from 'react';
import BME280Sensor from './components/BME280Sensor';
import MQ7Sensor from './components/MQ7Sensor';
import SDS011Sensor from './components/SDS011Sensor';
import MQ135Sensor from './components/MQ135Sensor';
import MQ131Sensor from './components/MQ131Sensor';
import AirQualityIndex from './components/AirQualityIndex';
import TotalAir from './components/TotalAirQuality';

function App() {
  return (
    <div className="flex font-inter bg-blue-10">
      <div className="bg-green-10 w-40"></div> {/* เปลี่ยน p-20 เป็น w-20 */}
      <div className="flex-1">
        <div className="flex items-center ">
          <h1 className="font-inter text-black-10 font-bold ml-7 mr-5">Dashboard</h1>
          <h1 className="text-green-20 font-bold">SmartClassroom</h1>
        </div>
        <div className=" flex flex-wrap mt-5 ml-7 mb-20 gap-8">
          <BME280Sensor />
          <MQ7Sensor />
          <MQ131Sensor />
          <TotalAir/>
          <MQ135Sensor />
          <SDS011Sensor />
          <AirQualityIndex />
        </div>
      </div>
    </div>
  );
}

export default App;