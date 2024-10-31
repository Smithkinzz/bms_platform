import { useEffect, useState } from "react";
import { Text } from '@mantine/core';
import { InfluxDB } from '@influxdata/influxdb-client';
import { IconTemperature } from '@tabler/icons-react'; // Import thermometer icon

// การตั้งค่าการเชื่อมต่อ InfluxDB
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery =
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "AQI_sensor" ) ';

const QuickBarTemp = () => {
    const [Temp, setTemp] = useState(null); // Change initial state to null

    // Fetch data every second
    useEffect(() => {
        const fetchData = async () => {
            let newTemp = null; // Set default value to null
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                if (o._field === "temp") newTemp = o._value; // Assign newTemp if temp field is found
            }

            // Update state only if new data is different
            if (newTemp !== Temp) setTemp(newTemp);
        };

        // Set interval to fetch data every second
        const interval = setInterval(fetchData, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [Temp, queryApi]);

    // Determine icon color based on Temp value
    const getIconColor = (tempValue) => {
        if (tempValue === null || tempValue === 0) return "gray"; // Gray color for N/A
        return "#6D28D9"; // Tailwind hex color for purple-700
    };
   
    return (
        <div className="p-4 flex items-center"> {/* Using Tailwind for styling */} 
            {/* Create a large circular logo with light gray background */}
            <div className="w-12 h-12 rounded-full bg-blue-50/50 flex justify-center items-center mr-4">
                <IconTemperature size={24} color={getIconColor(Temp)} /> {/* Dynamically set icon color */}
            </div>

            <div className="flex flex-col items-start"> {/* Stack Temp and value vertically */}
                <Text size={12} fw={400} c="dimmed">
                    Temp
                </Text>
                <Text size={18} fw={500}>
                    {Temp === null || Temp === 0 ? 'N/A' : `${Temp} °C`}
                </Text>
            </div>
        </div>
    );
}

export default QuickBarTemp;
