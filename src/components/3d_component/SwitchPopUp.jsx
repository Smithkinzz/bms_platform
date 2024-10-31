import { Html } from "@react-three/drei";
import { Popover, Text, Space, Grid, ActionIcon, Divider, Switch } from '@mantine/core';
import { useState } from "react";
import { IconToggleLeftFilled, IconRefresh } from '@tabler/icons-react';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const bucket = 'BMS';
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const writeApi = influxDB.getWriteApi(org, bucket, 'ns'); 
writeApi.useDefaultTags({ location: 'office' }); 

const fluxQuery = 
    'from(bucket:"BMS") |> range(start: -7d) |> filter(fn: (r) => r._measurement == "smart_switch" ) |> last()';

const SwichPopUp = () => {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [switch1, setSwitch1] = useState(false);
    const [switch2, setSwitch2] = useState(false);
    const [updatedAt, setUpdatedAt] = useState(""); 

    const fetchData = async () => {
        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            const o = tableMeta.toObject(values);
            if (o._field === "switch_1") setSwitch1(o._value);
            if (o._field === "switch_2") setSwitch2(o._value);
        }


        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        setUpdatedAt(now.toLocaleString('en-GB', options)); 
    };

    const handleButtonClick = () => {
        if (!popoverOpened) {
            fetchData();  
        }
        setPopoverOpened(!popoverOpened);
    };

    const handleRefreshClick = () => {
        fetchData(); h
    };

    const writeData = (switchName, value) => {
        const point = new Point('smart_switch')
            .tag('location', 'office')
            .booleanField(switchName, value);

        writeApi.writePoint(point);
        writeApi.flush();
    };

    const handleSwitch1Change = () => {
        const newValue = !switch1;
        setSwitch1(newValue);
        writeData('switch_1', newValue); // เขียนข้อมูล switch_1 กลับไปที่ InfluxDB
    };

    const handleSwitch2Change = () => {
        const newValue = !switch2;
        setSwitch2(newValue);
        writeData('switch_2', newValue); // เขียนข้อมูล switch_2 กลับไปที่ InfluxDB
    };

    return (
        <>
            <Html position={[-2.3, 0, 0.5]}>
                <Popover
                    width={181}
                    position="top"
                    withArrow
                    shadow="md"
                    opened={popoverOpened}
                    onClose={() => setPopoverOpened(false)}
                    radius={14}
                >
                    <Popover.Target>
                        <ActionIcon variant="light" color="blue" radius="xl" aria-label="Settings" onClick={handleButtonClick}>
                            <IconToggleLeftFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown >
                        <Text
                            fw={900}
                            size={17}
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'green', deg: 90 }}>
                            Smart Switch
                        </Text>
                        <Space h={1} />
                        <Switch 
                            label="Smart Switch" 
                            color="indigo" 
                            checked={switch1} // แสดงสถานะ switch 1
                            labelPosition="left" 
                            size="sm" 
                            onChange={handleSwitch1Change} // เปลี่ยนสถานะเมื่อกด และเขียนข้อมูล
                        />
                        {/* <Switch 
                            label="Smart Switch 2" 
                            color="indigo" 
                            checked={switch2} // แสดงสถานะ switch 2
                            labelPosition="left" 
                            size="sm" 
                            onChange={handleSwitch2Change} // เปลี่ยนสถานะเมื่อกด และเขียนข้อมูล
                        /> */}
                        
                        <Space h={12} />
                        <Divider size="xs" />
                        <Space h={4} />
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

export default SwichPopUp;
