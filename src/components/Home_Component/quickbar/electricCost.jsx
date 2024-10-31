import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import { InfluxDB } from "@influxdata/influxdb-client";
import { IconCoinBitcoin } from "@tabler/icons-react"; // Icon representing cost or money

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
    |> filter(fn: (r) => r._measurement == "power_meter" and r._field == "electric_cost")
`;

const QuickBarElectricCost = () => {
    const [electricCost, setElectricCost] = useState(null); // State for electric cost initialized as null

    // Fetch data every second
    useEffect(() => {
        const fetchData = async () => {
            let newElectricCost = null;
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                newElectricCost = o._value; // Get electric_cost value
            }

            // Update state only if new data is different
            if (newElectricCost !== electricCost) setElectricCost(newElectricCost);
        };

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [electricCost, queryApi]);

    // Determine icon color based on electric cost value
    const getIconColor = (costValue) => {
        if (costValue === null || costValue === 0) return "gray"; // Gray color for N/A or 0
        return "#6D28D9"; // Indigo color for valid cost value
    };

    return (
        <div className="p-4 flex items-center"> {/* Using Tailwind for styling */}
            {/* Create a large circular logo with light gray background */}
            <div className="w-12 h-12 rounded-full bg-blue-50/50 flex justify-center items-center mr-4">
                <IconCoinBitcoin size={24} color={getIconColor(electricCost)} /> {/* Dynamically set icon color */}
            </div>

            <div className="flex flex-col items-start"> {/* Stack electric cost and value vertically */}
                <Text size={12} fw={400} c="dimmed">
                    Electric Cost
                </Text>
                <Text size={18} fw={500}>
                    {electricCost === null || electricCost === 0 ? 'N/A' : `${electricCost.toFixed(2)} THB`} {/* Display electric cost or N/A */}
                </Text>
            </div>
        </div>
    );
};

export default QuickBarElectricCost;
