import { useEffect, useState } from "react";
import { Text } from '@mantine/core';
import { InfluxDB } from '@influxdata/influxdb-client';
import { IconMist } from '@tabler/icons-react';

// InfluxDB connection settings
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery =
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "AQI_sensor" ) ';

const QuickBarPM25 = () => {
    const [PM25, setPM25] = useState(null); // State variable for PM2.5, null initially

    useEffect(() => {
        const fetchData = async () => {
            let newPM25 = null; // Initialize newPM25 as null
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                if (o._field === "pm25") newPM25 = o._value; // Check for PM2.5 field
            }

            if (newPM25 !== PM25) setPM25(newPM25);
        };

        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, [PM25, queryApi]);

    // Determine icon color based on PM2.5 value using Tailwind classes
    const getIconClass = (pm25Value) => {
        if (pm25Value === null || pm25Value === 0) return "text-gray-500"; // Gray color for N/A or 0
        if (pm25Value <= 25) return "text-blue-500";
        if (pm25Value <= 50) return "text-green-500";
        if (pm25Value <= 100) return "text-yellow-500";
        if (pm25Value <= 200) return "text-orange-500";
        return "text-red-500";
    };

    return (
        <div className="p-4 flex items-center">
            <div className={`w-12 h-12 rounded-full bg-blue-50 flex justify-center items-center mr-4`}>
                <IconMist size={24} className={getIconClass(PM25)} />
            </div>

            <div className="flex flex-col items-start">
                <Text size={12} fw={400} c="dimmed">
                    PM2.5
                </Text>
                <Text size={18} fw={500}>
                    {PM25 === null || PM25 === 0 ? 'N/A' : `${PM25} μg/m³`}
                </Text>
            </div>
        </div>
    );
}

export default QuickBarPM25;
