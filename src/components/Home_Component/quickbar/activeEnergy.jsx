import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import { InfluxDB } from "@influxdata/influxdb-client";
import { IconBolt } from "@tabler/icons-react"; // Icon representing energy

// การตั้งค่าการเชื่อมต่อ InfluxDB
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// ดึงข้อมูลย้อนหลัง 1 นาที
const fluxQuery = `
    from(bucket:"BMS") 
    |> range(start: -1m) 
    |> filter(fn: (r) => r._measurement == "power_meter" and r._field == "active_energy")
`;

const QuickBarActiveEnergy = () => {
    const [activeEnergy, setActiveEnergy] = useState(null); // State for active energy initialized as null

    useEffect(() => {
        const fetchData = async () => {
            let newActiveEnergy = null;
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                newActiveEnergy = o._value; 
            }

            // Update state only if new data is different
            if (newActiveEnergy !== activeEnergy) setActiveEnergy(newActiveEnergy);
        };

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [activeEnergy, queryApi]);

    // Determine icon color based on active energy value
    const getIconColor = (energyValue) => {
        if (energyValue === null || energyValue === 0) return "gray"; // Gray color for N/A or 0
        return "#6D28D9"; // Indigo color for valid energy value
    };

    return (
        <div className="p-4 flex items-center"> {/* Using Tailwind for styling */}
            {/* Create a large circular logo with light gray background */}
            <div className="w-12 h-12 rounded-full bg-blue-50/50 flex justify-center items-center mr-4">
                <IconBolt size={24} color={getIconColor(activeEnergy)} /> {/* Dynamically set icon color */}
            </div>

            <div className="flex flex-col items-start"> {/* Stack active energy and value vertically */}
                <Text size={12} fw={400} c="dimmed">
                    Active Energy
                </Text>
                <Text size={18} fw={500}>
                    {activeEnergy === null || activeEnergy === 0 ? 'N/A' : `${activeEnergy.toFixed(2)} kWh`} {/* Display active energy or N/A */}
                </Text>
            </div>
        </div>
    );
};

export default QuickBarActiveEnergy;
