import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Text } from '@mantine/core';
import 'chart.js/auto';

const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const fluxQuery = `
  from(bucket: "BMS")
  |> range(start: -1m)
  |> filter(fn: (r) => r["_measurement"] == "AQI_sensor" or r["_measurement"] == "power_meter")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
  |> yield(name: "mean")
`;

const PowerMeterCard = () => {
    const [onlineCount, setOnlineCount] = useState(0);
    const [offlineCount, setOfflineCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let online = 0;
                let totalDevices = 11; // กำหนดค่า 11 เป็นจำนวนทั้งหมดของอุปกรณ์

                for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                    const row = tableMeta.toObject(values);

                    if (row._value !== null) {
                        online++;
                    }
                }

                const offline = totalDevices - online; // คำนวณค่า offline จากจำนวนที่ขาด
                setOnlineCount(online);
                setOfflineCount(offline >= 0 ? offline : totalDevices); // ถ้าลบแล้ว < 0 ให้ค่าเป็น offline ทั้งหมด

            } catch (error) {
                setOnlineCount(0);
                setOfflineCount(11); // ถ้ามี error ให้ค่า offline ทั้งหมด
            }
        };

        const interval = setInterval(fetchData, 1000); // Fetch ข้อมูลทุกๆ 1 วินาที
        return () => clearInterval(interval);
    }, []);

    const data = {
        labels: ['Online', 'Offline'],
        datasets: [
            {
                label: 'Device Status',
                data: [onlineCount, offlineCount],
                backgroundColor: ['#42bd41', '#EF4444'], // สีเขียวและสีแดง
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                align: 'center',
                labels: {
                    boxWidth: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    color: '#000000',
                },
            },
            title: {
                display: false,
            },
        },
        cutout: '70%',
    };

    return (
        <div style={{ padding: '20px' }}>
            <Text fw={900} size={20}>Sensors Status</Text>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '240px', height: '200px' }}>
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default PowerMeterCard;
