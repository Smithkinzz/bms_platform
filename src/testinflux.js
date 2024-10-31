import { InfluxDB} from '@influxdata/influxdb-client';

/** Environment variables **/
const url = 'http://172.27.0.1:8086/';
const token = 'BFkn29Q_BpjgPICrVOT0IGiZZRIie2YiOG3vWymHR_KSnRsIP_2n_9oPvMvcPgKvgMZIbKAIPvy4qwKHJExGGQ==';
const org = 'swd';
const bucket = 'BMS';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);
const fluxQuery = 
    'from(bucket:"BMS") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "smart_switch" ) ';

const myQuery  = async () => {
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const o = tableMeta.toObject(values);
        console.log(`${o._time} ${o._measurement} ${o._field}=${o._value}`);
    }
};

/** Execute a query and receive line table metadata and rows. */
myQuery();

export default myQuery;