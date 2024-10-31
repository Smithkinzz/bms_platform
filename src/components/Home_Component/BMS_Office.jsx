import { OrbitControls} from '@react-three/drei'
import BMS_Model from "../3d_component/BMS-project";
import PowerMeterPopUp from '../3d_component/PowerMeterPopUp';
import IAQPopUp from '../3d_component/IAQPopUp';
import SwichPopUp from '../3d_component/SwitchPopUp';
const BMS_Office = () => {
    return (
        <>
        <OrbitControls 
            maxPolarAngle={Math.PI / 2}  
            minPolarAngle={Math.PI / 4} 
            maxAzimuthAngle={Math.PI / 2}  
            minAzimuthAngle={-Math.PI / 2}  
            enableZoom={true}  
            enablePan={true}  
        />    
        <hemisphereLight color="white" groundColor="blue" intensity={0.75} />
        <pointLight position={[-1.3, 1, 0]} intensity={3} />
        <pointLight position={[0, 1, 0]} intensity={1.5} />
        <pointLight position={[1.3, 1, 0]} intensity={3} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="red" castShadow />
        <BMS_Model />
        <PowerMeterPopUp />
        <IAQPopUp />
        <SwichPopUp />
        </>
    )
}

export default BMS_Office;