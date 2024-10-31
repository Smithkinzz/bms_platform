import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Text } from "@mantine/core";

// การตั้งค่าการเชื่อมต่อ InfluxDB
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// ดึงข้อมูลย้อนหลัง 3 ชั่วโมง โดยแสดงข้อมูล PM25 และ PM10 เป็นช่วงๆละ 1 นาที
const fluxQuery = `
    from(bucket:"BMS") 
    |> range(start: -3h) 
    |> filter(fn: (r) => r._measurement == "AQI_sensor" and (r._field == "pm25" or r._field == "pm10"))
    |> aggregateWindow(every: 10m, fn: mean, createEmpty: false)
`;

const IAQ_graph = () => {
    const [data, setData] = useState([]);

    // Fetch data every second
    useEffect(() => {
        const fetchData = async () => {
            const tempData = {}; // เก็บข้อมูลแบบกลางโดยใช้เวลาเป็น key

            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                const timeKey = new Date(o._time).toISOString(); // ใช้ ISO string สำหรับ time key

                // ถ้าไม่มีค่าใน timeKey นี้ ให้สร้าง object ใหม่
                if (!tempData[timeKey]) {
                    tempData[timeKey] = {
                        time: new Date(o._time).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                }

                // เพิ่มค่า PM25 และ PM10 ลงใน timeKey ที่ตรงกัน
                if (o._field === "pm25") tempData[timeKey]["PM2.5"] = o._value;
                if (o._field === "pm10") tempData[timeKey].PM10 = o._value;
            }

            // เปลี่ยนจาก object เป็น array แล้วจัดเรียงตามเวลา
            const newData = Object.values(tempData).sort(
                (a, b) => new Date(a.time) - new Date(b.time)
            );

            // อัพเดต state ด้วยข้อมูลที่จัดเรียงแล้ว
            setData(newData);
        };

        // Set interval to fetch data every second
        const interval = setInterval(fetchData, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [queryApi]);

    // Custom Legend Component for centering the dots
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} style={{ listStyleType: 'none', display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                        {/* Circle Icon */}
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            marginRight: '5px',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }}></div>
                        {/* Text */}
                        <span>{entry.dataKey === "PM2.5" ? "PM2.5" : entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-5 pe-12">
            <Text fw={900} size={17} style={{ marginBottom: '20px' }}>
                Particulate Matter
            </Text>

            <ResponsiveContainer width="100%" height={230}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" tick={{ fill: "black" }} />
                    <YAxis
                        tick={{ fill: "#000000" }}
                        tickFormatter={(value) => `${value} `}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                        }}
                        itemStyle={{ color: "#000" }}
                        cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
                        labelFormatter={(label) => `Time: ${label}`}
                        formatter={(value, name) => {
                            if (typeof value === "number") {
                                return [
                                    `${value.toFixed(2)} μg/m³`,
                                    `${name}`,
                                ];
                            } else {
                                return [value, name];
                            }
                        }}
                    />
                    {/* Custom Legend */}
                    <Legend content={renderLegend} verticalAlign="bottom" align="center" iconSize={10} />

                    {/* เส้นเชื่อมระหว่างจุด พร้อมจุดแสดง */}
                    <Line
                        type="monotone"
                        dataKey="PM2.5"
                        stroke="#6D28D9" // สีใหม่สำหรับ PM2.5
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#6D28D9" }} // ทำให้จุดเป็นทึบ
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="PM10"
                        stroke="#6366F1" // สีใหม่สำหรับ PM10
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#6366F1" }} // ทำให้จุดเป็นทึบ
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IAQ_graph;
