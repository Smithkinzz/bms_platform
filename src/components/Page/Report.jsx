import React, { useState, useEffect } from 'react';
import { Button, SegmentedControl, Grid, Text, Space, Pagination } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { InfluxDB } from '@influxdata/influxdb-client';
import Papa from 'papaparse';

// InfluxDB setup
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// Main Component
const Report = () => {
    const [groupedSensorData, setGroupedSensorData] = useState([]);
    const [sensorStatus, setSensorStatus] = useState('Offline');
    const [timeRange, setTimeRange] = useState('-30m');
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [selectedReport, setSelectedReport] = useState('IAQ Sensor'); // Track selected report type
    const itemsPerPage = 20; // Define items per page

    // Define queries based on the selected report type
    const iaqQuery = `from(bucket:"BMS") |> range(start: ${timeRange}) |> filter(fn: (r) => r._measurement == "AQI_sensor")`;
    const powerMeterQuery = `from(bucket:"BMS") |> range(start: ${timeRange}) |> filter(fn: (r) => r._measurement == "power_meter")`;

    // Fetch data based on the selected report type and time range
    useEffect(() => {
        const fetchData = async () => {
            const sensorData = {};
            let isDataFetched = false;
            const query = selectedReport === 'IAQ Sensor' ? iaqQuery : powerMeterQuery;  // Use correct query based on report type

            for await (const { values, tableMeta } of queryApi.iterateRows(query)) {
                const o = tableMeta.toObject(values);
                const time = o._time;

                if (!sensorData[time]) {
                    sensorData[time] = { time };
                }

                // Different fields for IAQ and Power Meter
                if (selectedReport === 'IAQ Sensor') {
                    if (o._field === "co2") sensorData[time].co2 = o._value;
                    if (o._field === "pm25") sensorData[time].pm25 = o._value;
                    if (o._field === "pm10") sensorData[time].pm10 = o._value;
                    if (o._field === "hcho") sensorData[time].hcho = o._value;
                    if (o._field === "tvoc") sensorData[time].tvoc = o._value;
                    if (o._field === "temp") sensorData[time].temp = o._value;
                    if (o._field === "humid") sensorData[time].humid = o._value;
                } else if (selectedReport === 'Power Meter') {
                    if (o._field === "voltage") sensorData[time].voltage = o._value;
                    if (o._field === "current") sensorData[time].current = o._value;
                    if (o._field === "active_energy") sensorData[time].activeEnergy = o._value;
                    if (o._field === "electric_cost") sensorData[time].electricCost = o._value;
                }

                isDataFetched = true;
            }

            if (isDataFetched) {
                setGroupedSensorData(Object.values(sensorData));
                setSensorStatus('Online');
            } else {
                setSensorStatus('Offline');
            }
        };

        fetchData();
    }, [timeRange, selectedReport]); // Added selectedReport to the dependency array

    // Function to format time to "20/09/2024, 09:53:29"
    const formatTime = (time) => {
        const date = new Date(time);
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    };

    // Handle SegmentedControl change for time range and report type
    const handleTimeRangeChange = (value) => {
        setCurrentPage(1); // Reset to first page when time range changes
        switch (value) {
            case '30 Minutes':
                setTimeRange('-30m');
                break;
            case '1 Hour':
                setTimeRange('-1h');
                break;
            case '1 Day':
                setTimeRange('-1d');
                break;
            case '1 Week':
                setTimeRange('-1w');
                break;
            default:
                setTimeRange('-30m');
        }
    };

    // Handle SegmentedControl change for report type
    const handleReportChange = (value) => {
        setSelectedReport(value); // Update selected report type
        setCurrentPage(1); // Reset to first page when report type changes
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = groupedSensorData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Download CSV file
    const downloadCSV = () => {
        // Mapping for readable time range
        const timeRangeMapping = {
            '-30m': '30m',
            '-1h': '1h',
            '-1d': '1d',
            '-1w': '1w'
        };

        const readableTimeRange = timeRangeMapping[timeRange] || '30m'; // Default to 30m if not matched

        const csv = Papa.unparse(groupedSensorData.map((data) => ({
            Time: data.time ? formatTime(data.time) : 'N/A',
            ...(selectedReport === 'IAQ Sensor' ? {
                CO2: data.co2 ? `${data.co2} ` : 'N/A',
                PM25: data.pm25 ? `${data.pm25} ` : 'N/A',
                PM10: data.pm10 ? `${data.pm10} ` : 'N/A',
                HCHO: data.hcho ? `${data.hcho} ` : 'N/A',
                TVOC: data.tvoc ? `${data.tvoc}` : 'N/A',
                Temp: data.temp ? `${data.temp} ` : 'N/A',
                Humidity: data.humid ? `${data.humid}` : 'N/A',
            } : {
                Voltage: data.voltage ? `${data.voltage} ` : 'N/A',
                Current: data.current ? `${data.current} ` : 'N/A',
                ActiveEnergy: data.activeEnergy ? `${data.activeEnergy} ` : 'N/A',
                ElectricCost: data.electricCost ? `${data.electricCost} ` : 'N/A',
            })
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${selectedReport}_report_${readableTimeRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="flex-1 min-h-[890px]   bg-blue-50/50 ps-72">
            <div className="px-4 pt-3">
                <div className="fixed backdrop-blur-md bg-white/30 p-4 w-44 z-10">
                    <p className="text-sm">Pages / Report</p>
                    <h1 className="text-4xl font-bold">Report</h1>
                </div>
            </div>
            <div className="pt-24">
                <div className="flex items-center justify-between pe-6">
                    <SegmentedControl
                        withItemsBorders={false}
                        color="violet"
                        data={['IAQ Sensor', 'Power Meter',]}
                        value={selectedReport}

                        onChange={handleReportChange} // Handle report change
                        className="ml-6 "
                    />
                    <div className="flex items-center space-x-4">
                        <SegmentedControl
                            withItemsBorders={false}
                            color="violet"
                            data={['30 Minutes', '1 Hour', '1 Day', '1 Week']}
                            onChange={handleTimeRangeChange}
                        />
                        <Button
                            variant="filled"
                            color="violet"
                            size="sm"
                            leftIcon={<IconDownload size={16} />}
                            onClick={downloadCSV} // Download CSV on click
                        >
                            Download
                        </Button>
                    </div>
                </div>
                <div className="py-4 px-4">
                    <div className="bg-white rounded-xl w-auto px-6 pt-4 ">
                        <Grid columns={9} align="center" justify="center">
                            <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                <Text size="xs" color="gray">Time</Text>
                            </Grid.Col>
                            {selectedReport === 'IAQ Sensor' ? (
                                <>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">CO₂</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">PM2.5</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">PM10</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">HCHO</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">TVOC</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Temp.</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Humid.</Text>
                                    </Grid.Col>
                                </>
                            ) : (
                                <>
                                    <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Voltage</Text>
                                    </Grid.Col>
                                    <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Current</Text>
                                    </Grid.Col>
                                    <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Active Energy</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                        <Text size="xs" color="gray">Electric Cost</Text>
                                    </Grid.Col>
                                </>
                            )}
                        </Grid>

                        <hr className="border-t-1 border-gray-100 mt-2" />
                        <Space h={10} />
                        {currentItems.map((data, index) => (
                            <Grid key={index} columns={9} align="center" justify="center">
                                <Grid.Col span={2} style={{ textAlign: 'Left' }}>
                                    <Text size="sm">{data.time ? formatTime(data.time) : 'N/A'}</Text>
                                </Grid.Col>
                                {selectedReport === 'IAQ Sensor' ? (
                                    <>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.co2 ? `${data.co2} ppm` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.pm25 ? `${data.pm25} µg/m³` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.pm10 ? `${data.pm10} µg/m³` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.hcho ? `${data.hcho} mg/m³` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.tvoc ? `${data.tvoc} ppm` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.temp ? `${data.temp} °C` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.humid ? `${data.humid} %` : 'N/A'}</Text>
                                        </Grid.Col>
                                    </>
                                ) : (
                                    <>
                                        <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.voltage ? `${data.voltage} V` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.current ? `${data.current} A` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={2} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.activeEnergy ? `${data.activeEnergy} kWh` : 'N/A'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={1} style={{ textAlign: 'left' }}>
                                            <Text size="sm">{data.electricCost ? `${data.electricCost} THB` : 'N/A'}</Text>
                                        </Grid.Col>
                                    </>
                                )}
                            </Grid>
                        ))}

                        {/* Pagination Controls */}
                        <Space h={20} />
                        <Pagination
                            total={Math.ceil(groupedSensorData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="violet"
                            position="right"
                            size="sm"
                        />
                        <Space h={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
