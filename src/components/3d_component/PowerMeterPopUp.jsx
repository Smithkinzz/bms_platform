import { Html } from "@react-three/drei";
import { Popover, Text, Space, Grid, ActionIcon, Divider } from '@mantine/core';
import { useState } from "react";
import { IconBolt, IconRefresh } from '@tabler/icons-react';
import { InfluxDB } from '@influxdata/influxdb-client';

// การตั้งค่าการเชื่อมต่อ InfluxDB
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery =
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "power_meter" ) ';

const PowerMeterPopUp = () => {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [voltage, setVoltage] = useState(0);
    const [current, setCurrent] = useState(0);
    const [activeEnergy, setActiveEnergy] = useState(0);
    const [electricCost, setElectricCost] = useState(0);
    const [updatedAt, setUpdatedAt] = useState(""); // State สำหรับเก็บเวลาที่ fetch ข้อมูลมา

    const fetchData = async () => {
        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            const o = tableMeta.toObject(values);
            if (o._field === "voltage") setVoltage(o._value);
            if (o._field === "current") setCurrent(o._value);
            if (o._field === "active_energy") setActiveEnergy(o._value);
            if (o._field === "electric_cost") setElectricCost(o._value);
        }

        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        setUpdatedAt(now.toLocaleString('en-GB', options));
    };

    const handleButtonClick = () => {
        if (!popoverOpened) {
            fetchData();
        }

        setPopoverOpened(!popoverOpened); // Toggle the popover's open state
    };

    const handleRefreshClick = () => {
        fetchData();
    };

    // ฟังก์ชันเพื่อเช็คและแสดง N/A ถ้าค่าที่ได้เป็น 0
    const displayValue = (value) => {
        return value === 0 ? 'N/A' : value;
    };

    return (
        <>
            <Html position={[-2.3, 0.9, -1.6]}>
                <Popover
                    width={240}
                    position="top"
                    withArrow
                    shadow="md"
                    opened={popoverOpened}
                    onClose={() => setPopoverOpened(false)}
                    radius={14}
                >
                    <Popover.Target>
                        <ActionIcon variant="light" color="orange" radius="xl" aria-label="Settings" onClick={handleButtonClick}>
                            <IconBolt style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown >
                        <Text
                            fw={900}
                            size={17}
                            variant="gradient"
                            gradient={{ from: 'orange', to: 'yellow', deg: 90 }}>
                            Power Consumption
                        </Text>
                        <Space h={4} />
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size={14}>Voltage</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(voltage)} {voltage !== 0 && "V"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size={14}>Current</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(current)} {current !== 0 && "A"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size={14}>Active Energy</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(activeEnergy)} {activeEnergy !== 0 && "kWh"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={1} />
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size={14}>Electric Cost</Text>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Text size={14} fw={500}>{displayValue(electricCost)} {electricCost !== 0 && "THB"}</Text>
                            </Grid.Col>
                        </Grid>
                        <Space h={8} />
                        <Divider size="xs" />
                        <Space h={8} />
                        <Grid justify="space-between" align="center">
                            <Grid.Col span={2}>
                                <ActionIcon onClick={handleRefreshClick} variant="transparent" color="gray" radius="xl" aria-label="Refresh" size="sm">
                                    <IconRefresh size={16} />
                                </ActionIcon>
                            </Grid.Col>
                            <Grid.Col span={10}>
                                <Text size={11}>Updated at:<br />  {updatedAt}</Text>
                            </Grid.Col>
                        </Grid>
                    </Popover.Dropdown>
                </Popover>
            </Html>
        </>
    );
}

export default PowerMeterPopUp;
