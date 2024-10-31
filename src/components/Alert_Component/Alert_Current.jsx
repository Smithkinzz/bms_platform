import { useState, useEffect } from 'react';
import { Switch, Grid, Text, Button, TextInput, Select } from '@mantine/core';
import axios from 'axios';
import { InfluxDB } from '@influxdata/influxdb-client';

// InfluxDB connection details
const url = "http://172.27.0.1:8086/";
const token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg==";
const org = "swd";
const bucket = 'BMS';
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// Flux query for current alert data
const fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -7d)
    |> filter(fn: (r) => r._measurement == "current_alert")
    |> filter(fn: (r) => r._field == "formValue" or r._field == "groupValue" or r._field == "priorityValue" or r._field == "switchValue" or r._field == "toValue")
    |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
    |> yield(name: "last")
`;

const AL_Current = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formValue, setFormValue] = useState(30);
  const [toValue, setToValue] = useState(240);
  const [groupValue, setGroupValue] = useState('Maintenance');
  const [priorityValue, setPriorityValue] = useState('High');
  const [switchValue, setSwitchValue] = useState(false);

  // Fetch data from InfluxDB
  const fetchData = async () => {
    try {
      for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const row = tableMeta.toObject(values);
        if (row._field === 'formValue') setFormValue(row._value);
        if (row._field === 'toValue') setToValue(row._value);
        if (row._field === 'groupValue') setGroupValue(row._value);
        if (row._field === 'priorityValue') setPriorityValue(row._value);
        if (row._field === 'switchValue') setSwitchValue(row._value === 'true' || row._value === true);
      }
    } catch (error) {
      console.error('Error fetching data from InfluxDB:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle switch toggle and update state and InfluxDB
  const handleSwitchChange = (event) => {
    const newSwitchValue = event.currentTarget.checked;
    setSwitchValue(newSwitchValue);

    const data = `current_alert switchValue=${newSwitchValue}`;
    axios.post(`${url}api/v2/write`, data, {
      params: { org, bucket },
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'text/plain',
      },
    })
      .then(() => {
        console.log('Switch value saved successfully');
      })
      .catch((error) => {
        console.error('Error writing switch value to InfluxDB', error);
      });
  };

  const handleSave = () => {
    setIsEditing(false);
    const data = `
      current_alert formValue=${formValue},toValue=${toValue},switchValue=${switchValue},groupValue="${groupValue}",priorityValue="${priorityValue}"
    `;
    axios.post(`${url}api/v2/write`, data, {
      params: { org, bucket },
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'text/plain',
      },
    })
      .then(() => {
        console.log('Data saved successfully');
      })
      .catch((error) => {
        console.error('Error writing data to InfluxDB', error);
      });
  };

  return (
    <div className="bg-white rounded-xl w-full p-4">
      <Grid columns={24} justify="flex-start" align="center" style={{ height: '100%' }}>
        <Grid.Col span={2}>
          <div className="pb-4">
            <Switch
              color="violet"
              checked={switchValue}
              onChange={handleSwitchChange} // Save the switch value on toggle
            />
          </div>
        </Grid.Col>

        <Grid.Col span={4}>
          <div>
            <Text color="gray" size="sm" style={{ fontWeight: 300 }}>
              Name
            </Text>
            <Text color="black" size="lg" weight={500}>
              Current
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={5}>
          <Text color="gray" size="sm" style={{ fontWeight: 300 }}>
            Group
          </Text>
          {isEditing ? (
            <Select
              value={groupValue}
              onChange={setGroupValue}
              data={[
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Manager', label: 'Manager' },
              ]}
            />
          ) : (
            <Text color="black" size="lg" weight={500}>
              {groupValue}
            </Text>
          )}
        </Grid.Col>

        <Grid.Col span={4}>
          <Text color="gray" size="sm" style={{ fontWeight: 300 }}>
            Priority
          </Text>
          {isEditing ? (
            <Select
              value={priorityValue}
              onChange={setPriorityValue}
              data={[
                { value: 'Critical', label: 'Critical' },
                { value: 'High', label: 'High' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Low', label: 'Low' },
                { value: 'Informational', label: 'Informational' },
              ]}
            />
          ) : (
            <Text color="black" size="lg" weight={500}>
              {priorityValue}
            </Text>
          )}
        </Grid.Col>

        <Grid.Col span={3}>
          <Text color="gray" size="sm" style={{ fontWeight: 300 }}>
            Form
          </Text>
          {isEditing ? (
            <TextInput value={formValue} onChange={(e) => setFormValue(e.currentTarget.value)} type="number" />
          ) : (
            <Text color="black" size="lg" weight={500}>
              {formValue}A
            </Text>
          )}
        </Grid.Col>

        <Grid.Col span={3}>
          <Text color="gray" size="sm" style={{ fontWeight: 300 }}>
            To
          </Text>
          {isEditing ? (
            <TextInput value={toValue} onChange={(e) => setToValue(e.currentTarget.value)} type="number" />
          ) : (
            <Text color="black" size="lg" weight={500}>
              {toValue}A
            </Text>
          )}
        </Grid.Col>

        <Grid.Col span={2}>
          <Button
            variant="outline"
            color="violet"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.white,
                color: theme.colors.violet[6],
                borderColor: theme.colors.violet[6],
                borderStyle: 'dashed',
                width: '120px',
              },
            })}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default AL_Current;
