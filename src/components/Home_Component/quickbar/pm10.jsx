import { useEffect, useState } from "react";
import { Text } from '@mantine/core';
import { InfluxDB } from '@influxdata/influxdb-client';
import { IconCloud } from '@tabler/icons-react'; // Icon for larger air particles (PM10)

// InfluxDB connection settings
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery =
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "AQI_sensor" ) ';

const QuickBarPM10 = () => {
    const [PM10, setPM10] = useState(null); // Set initial state to null for PM10

    useEffect(() => {
        const fetchData = async () => {
            let newPM10 = null; // Initialize newPM10 as null
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                if (o._field === "pm10") newPM10 = o._value; // Check for PM10 field
            }

            if (newPM10 !== PM10) setPM10(newPM10);
        };

        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, [PM10, queryApi]);

    // Determine icon color based on PM10 value using the new thresholds
    const getIconClass = (pm10Value) => {
        if (pm10Value === null || pm10Value === 0) return "text-gray-500"; // Gray for N/A or 0
        if (pm10Value <= 40) return "text-blue-500"; // 0-40: Blue
        if (pm10Value <= 120) return "text-green-500"; // 41-120: Green
        if (pm10Value <= 350) return "text-yellow-500"; // 121-350: Yellow
        if (pm10Value <= 420) return "text-orange-500"; // 351-420: Orange
        return "text-red-500"; // >420: Red
    };

    return (
        <div className="p-4 flex items-center">
            <div className={`w-12 h-12 rounded-full bg-blue-50 flex justify-center items-center mr-4`}>
                <IconCloud size={24} className={getIconClass(PM10)} />
            </div>

            <div className="flex flex-col items-start">
                <Text size={12} fw={400} c="dimmed">
                    PM10
                </Text>
                <Text size={18} fw={500}>
                    {PM10 === null || PM10 === 0 ? 'N/A' : `${PM10} μg/m³`}
                </Text>
            </div>
        </div>
    );
}

export default QuickBarPM10;
