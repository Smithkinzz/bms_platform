import { Html } from "@react-three/drei";
import { Popover, Text, Space, Grid, ActionIcon, Divider } from '@mantine/core';
import { useState } from "react";
import { IconCloud, IconRefresh } from '@tabler/icons-react';
import { InfluxDB } from '@influxdata/influxdb-client';


const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery =
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "AQI_sensor" ) ';

const IAQPopUp = () => {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [CO2, setCO2] = useState(null);
    const [PM25, setPM25] = useState(null);
    const [PM10, setPM10] = useState(null);
    const [HCHO, setHCHO] = useState(null);
    const [TVOC, setTVOC] = useState(null);
    const [Temp, setTemp] = useState(null);
    const [Humid, setHumid] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(""); 

    const fetchData = async () => {
        try {
            for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values);
                if (o._field === "co2") setCO2(o._value);
                if (o._field === "pm25") setPM25(o._value);
                if (o._field === "pm10") setPM10(o._value);
                if (o._field === "hcho") setHCHO(o._value);
                if (o._field === "tvoc") setTVOC(o._value);
                if (o._field === "temp") setTemp(o._value);
                if (o._field === "humid") setHumid(o._value);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

       
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        setUpdatedAt(now.toLocaleString('en-GB', options)); // ใช้ toLocaleString แค่ครั้งเดียว
    };

    const handleButtonClick = () => {
        if (!popoverOpened) {
            fetchData();  // Fetch data when the popup is opened
        }
        setPopoverOpened(!popoverOpened);
    };

    // ฟังก์ชันสำหรับรีเฟรชข้อมูลเมื่อกดปุ่ม IconRefresh
    const handleRefreshClick = () => {
        fetchData(); // Fetch ข้อมูลใหม่เมื่อคลิกปุ่ม Refresh
    };

    // ฟังก์ชันเพื่อเช็คและแสดง N/A ถ้าค่าที่ได้เป็น null หรือ undefined
    const displayValue = (value) => {
        return value == null ? 'N/A' : value; // เช็คทั้ง null และ undefined
    };

    return (
        <>
            <Html position={[1.4, 0, -1.6]}>
                <Popover
                    width={200}
                    position="top"
                    withArrow
                    shadow="md"
                    opened={popoverOpened}
                    onClose={() => setPopoverOpened(false)}
                    radius={14}
                >
                    <Popover.Target>
                        <ActionIcon variant="light" color="green" radius="xl" aria-label="Settings" onClick={handleButtonClick}>
                            <IconCloud style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown >
                        <Text
                            fw={900}
                            size={17}
                            variant="gradient"
                            gradient={{ from: 'green', to: 'cyan', deg: 40 }}>
                            IAQ Sensors
                        </Text>
                        <Space h={3} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>CO2</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(CO2)} {CO2 != null && "ppm"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>PM2.5</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(PM25)} {PM25 != null && "μg/m³"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>PM10</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(PM10)} {PM10 != null && "μg/m³"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>HCHO</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(HCHO)} {HCHO != null && "ppm"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>TVOC</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(TVOC)}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>Temp</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(Temp)} {Temp != null && "°C"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={5}>
                                <Text size={14}>Humid</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(Humid)} {Humid != null && "%RH"}</Text>
                            </Grid.Col>
                        </Grid>
                        
                        <Space h={8} />
                        <Divider size="xs" />
                        <Space h={8} />
                        <Grid justify="space-between" align="center">
                            <Grid.Col span={2}>
                                <ActionIcon onClick={handleRefreshClick} variant="transparent" color="gray" radius="xl" aria-label="Refresh" size="sm">
                                    <IconRefresh size={16} /> {/* ลดขนาดของไอคอนลง */}
                                </ActionIcon>
                            </Grid.Col>
                            <Grid.Col span={10}>
                                <Text size={11}>Updated at:<br />  {updatedAt}</Text> {/* แสดงเวลาที่ดึงข้อมูลมา */}
                            </Grid.Col>
                        </Grid>
                    </Popover.Dropdown>
                </Popover>
            </Html>
        </>
    );
}

export default IAQPopUp;
