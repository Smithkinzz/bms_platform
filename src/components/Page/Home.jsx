import React, { useEffect } from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import BMS_Office from "../Home_Component/BMS_Office";
import IAQ_graph from '../Home_Component/IAQ_Graph';
import ElectricCost_graph from '../Home_Component/Electric_Cost';
import QuickBarTemp from '../Home_Component/quickbar/temp';
import QuickBarPM25 from '../Home_Component/quickbar/pm25';
import QuickBarPM10 from '../Home_Component/quickbar/pm10';
import QuickBarElectricCost from '../Home_Component/quickbar/electricCost';
import QuickBarActiveEnergy from '../Home_Component/quickbar/activeEnergy';
import IAQ_Status from '../Home_Component/sensor_Status';
import ElectricCostPerHour from '../Home_Component/electricCostPerHour';


const SetInitialPanAndZoom = () => {
  const { camera } = useThree();

  useEffect(() => {
    // ตั้งค่าการเลื่อนกล้องในตอนเริ่มต้น
    camera.position.set(2, 0, 5); // เลื่อนกล้องไปทางขวาและใกล้ขึ้น
    camera.zoom = 1.1;

    camera.updateProjectionMatrix(); // อัปเดตกล้องหลังจากเปลี่ยนค่า
  }, [camera]);

  return null;
};

const Dashboard = () => {
  return (
    <div className="flex-1 min-h-[1450px] bg-blue-50/50 ps-72">
      <div className="px-4 pt-3">
        <div className="fixed backdrop-blur-md bg-white/30 p-4 w-44 z-10">
          <p className="text-sm">Pages / Home</p>
          <h1 className="text-4xl font-bold">Home</h1>
        </div>
      </div>

      <div className="pt-24 px-4 flex space-x-2 ">
        <div className="bg-white rounded-xl w-1/5">
          <QuickBarTemp />
        </div>
        <div className="bg-white rounded-xl w-1/5 h-20">
          <QuickBarPM25 />
        </div>
        <div className="bg-white rounded-xl w-1/5 h-20">
          <QuickBarPM10 />
        </div>
        <div className="bg-white rounded-xl w-1/5 h-20">
          <QuickBarElectricCost />
        </div>
        <div className="bg-white rounded-xl w-1/5 h-20">
          <QuickBarActiveEnergy />
        </div>
      </div>

      <div className="px-4 pt-2 flex space-x-2">
        
        <div className="bg-white rounded-lg w-3/5" >
          <Canvas>
            <SetInitialPanAndZoom />
            <BMS_Office />
          </Canvas>

        </div>
        <div className="w-2/5" >
          
          <div className="bg-white rounded-xl ">
          <IAQ_Status />
        </div>
        <div className=" pt-2 ">
        <div className="bg-white rounded-xl pt-2 ">
          <ElectricCostPerHour />
        </div>
        </div>
        </div>
      </div>

      <div className="px-4 pt-2 h-80">
        <div className="bg-white rounded-xl">
          <ElectricCost_graph />
        </div>
        
      </div>

      <div className="px-4 pt-2 space-x-2  h-80">
        <div className="bg-white rounded-xl ">
          <IAQ_graph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
