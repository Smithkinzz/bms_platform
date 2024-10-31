import React, { useState, useEffect } from 'react';
import { InfluxDB } from '@influxdata/influxdb-client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Text } from '@mantine/core'; // Importing Text from Mantine

// InfluxDB connection configuration
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// Query to fetch 10-minute aggregated electric cost data
const fluxQuery = `
    from(bucket: "BMS")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "power_meter") 
    |> filter(fn: (r) => r._field == "electric_cost") 
    |> aggregateWindow(every: 10m, fn: last) 
    |> yield(name: "last")
`;

const ElectricCostPerHour = () => {
    const [data, setData] = useState([]);
    const [latestElectricCost, setLatestElectricCost] = useState(0.0); // Set initial value to 0.0
    const [fallbackElectricCost, setFallbackElectricCost] = useState(0.0); // Fallback value

    const fetchData = async () => {
        try {
            const chartData = [];
            let previousCost = null; // Track the previous value
            let latestCost = null; // Track the latest electric cost

            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                const currentCost = o._value;

                // Track the latest valid electric cost for fallback
                if (currentCost > 0) {
                    setFallbackElectricCost(currentCost);
                }

                if (previousCost !== null) {
                    const costDifference = currentCost - previousCost;

                    // Add condition to ignore negative values (or handle them differently)
                    if (costDifference >= 0) {
                        chartData.push({
                            time: new Date(o._time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                            electric_cost_difference: costDifference
                        });
                    }
                }

                // Update the previous cost with the current cost
                previousCost = currentCost;
                latestCost = currentCost; // Keep track of the latest cost
            }

            // Set the latest electric cost, fallback to the latest valid cost if it's zero
            setLatestElectricCost(latestCost !== null ? latestCost : fallbackElectricCost);

            // Limit the data to the last 12 entries
            const lastTwelveEntries = chartData.slice(-12);
            setData(lastTwelveEntries);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        // Fetch data initially
        fetchData();

        // Set interval to refresh data every 1 minute (60000 milliseconds)
        const interval = setInterval(() => {
            fetchData();
        }, 60000); // 60,000ms = 1 minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Custom Tooltip to display value with 2 decimal places and THB unit
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #6366F1', padding: '10px' }}>
                    <p>{`Time: ${payload[0].payload.time}`}</p>
                    <p>{`Electric Cost: ${payload[0].value.toFixed(2)} THB`}</p>
                </div>
            );
        }
        return null;
    };

    // Custom legend to display a circle with text
    const renderLegend = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6366F1', marginRight: '10px' }}></div>
                <Text fw={500} size={16} color="black">Electric cost per hour</Text>
            </div>
        );
    };

    return (
        <div className="py-5">
            <div className="ps-5">
                <Text fw={900} size={17} color="black">Electric Cost</Text> {/* Text is now black */}
            </div>

            {/* Display latest electric cost */}
            <div className="ps-5">
                <Text fw={700} size={24} color="#6366F1">
                    {latestElectricCost !== 0 ? `${latestElectricCost.toFixed(2)} THB` : `${fallbackElectricCost.toFixed(2)} THB`}
                </Text> {/* Display fallback cost if latestElectricCost is zero */}
            </div>

            <div className="h-44 pe-7 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: 'black' }} /> {/* Axis color updated to #9CA3AF with black ticks */}
                        <YAxis stroke="#9CA3AF" tick={{ fill: 'black' }} /> {/* Axis color updated to #9CA3AF with black ticks */}
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="electric_cost_difference" fill="#6366F1" barSize={38} /> {/* Added barSize to make the bars thinner */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Custom legend with a circle */}
            <div className="ps-5">{renderLegend()}</div>
        </div>
    );
};

export default ElectricCostPerHour;
