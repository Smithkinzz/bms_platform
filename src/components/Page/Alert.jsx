
import AL_CO2 from '../Alert_Component/Alert_CO2';
import AL_Current from '../Alert_Component/Alert_Current';
import AL_HCHO from '../Alert_Component/Alert_HCHO';
import AL_Humid from '../Alert_Component/Alert_Humid';
import AL_PM10 from '../Alert_Component/Alert_PM10';
import AL_PM25 from '../Alert_Component/Alert_PM25';
import AL_Temp from '../Alert_Component/Alert_Temp';
import AL_TVOC from '../Alert_Component/Alert_TVOC';
import AL_Voltage from '../Alert_Component/Alert_Voltage';


const Alert = () => {


    return (
        <div className="flex-1 min-h-[1070px] bg-blue-50/50 ps-72">
            <div className="px-4 pt-3">

                <div className="fixed backdrop-blur-md bg-white/30 p-4 w-44 z-10">
                    <p className="text-sm">Pages / Alert</p>
                    <h1 className="text-4xl font-bold">Alert</h1>
                </div>

                <div className="pt-28 ps-2">
                    <h2 className="text-2xl font-bold">Power Meter</h2>
                </div>

                <div className="pt-4 flex space-x-4">
                    <AL_Voltage />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_Current />
                </div>
                <div className="pt-4 ps-4">
                    <h2 className="text-2xl font-bold">IAQ Sensors</h2>
                </div>
                <div className="pt-4 flex space-x-4">
                    <AL_CO2 />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_PM25 />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_PM10 />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_HCHO />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_TVOC />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_Temp />
                </div>
                <div className="pt-2 flex space-x-4">
                    <AL_Humid />
                </div>
            </div>
        </div>
    );
};

export default Alert;
