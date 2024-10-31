from flask import Flask, jsonify
from influxdb_client import InfluxDBClient
from flask_cors import CORS
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from dateutil import parser
from datetime import datetime
import pytz

app = Flask(__name__)
CORS(app)

# InfluxDB connection settings
url = "http://172.27.0.1:8086/"
token = "Trx73_hnQw7NYAAWTXhM0-DNsfr7Iwye2l6MrNit5LxAxShJ54YXF3OtCqt-bZjgXFh9hmXdUu0Bkru8QjmGGg=="
org = "swd"
bucket = "BMS"

client = InfluxDBClient(url=url, token=token, org=org)
query_api = client.query_api()

# Fetch electric cost data from the last 2 hours
def get_electric_cost_data():
    query = '''
    from(bucket: "{}")
    |> range(start: -2h)
    |> filter(fn: (r) => r._measurement == "power_meter" and r._field == "electric_cost")
    |> aggregateWindow(every: 10m, fn: last, createEmpty: false)
    |> yield(name: "last")
    '''.format(bucket)
    
    try:
        result = query_api.query(org=org, query=query)
        electric_cost_data = []
        for table in result:
            for record in table.records:
                electric_cost_data.append({
                    "time": record.get_time().isoformat(),
                    "electric_cost": record.get_value()
                })
        return electric_cost_data
    except Exception as e:
        print(f"Error fetching data from InfluxDB: {e}")
        return []

def forecast_electric_cost(data):
    try:
        # Convert the data into a Pandas DataFrame
        df = pd.DataFrame(data)

        # Convert the time strings to datetime objects and set frequency
        df['time'] = df['time'].apply(lambda x: parser.isoparse(x))
        df.set_index('time', inplace=True)
        df = df.asfreq('10T')  # Set the frequency to 10 minutes

        # Fill missing data points with forward fill
        df['electric_cost'].fillna(method='ffill', inplace=True)

        # Print the data to check before fitting the model
        print("Data before ARIMA:")
        print(df.tail())

        # ARIMA model (simplified parameters)
        model = ARIMA(df['electric_cost'], order=(1, 1, 1))
        model_fit = model.fit()

        # Forecast for the next 1 hour (6 steps of 10 minutes each)
        forecast = model_fit.forecast(steps=6)  # 6 steps of 10 minutes each

        # Print forecast values to debug
        print(f"Forecast values: {forecast}")

        # Generate forecast timestamps in GMT+7
        current_time = pd.Timestamp.now(pytz.timezone('Asia/Bangkok'))
        next_time = (current_time + pd.Timedelta(minutes=10)).round('10min')
        forecast_times = pd.date_range(next_time, periods=6, freq='10T')

        # Format forecast data into a list of dictionaries, same as actual data
        forecast_data = [{
            "time": t.astimezone(pytz.timezone('Asia/Bangkok')).strftime('%H:%M'),  # Convert to HH:mm format in GMT+7
            "electric_cost": f,
            "isForecast": True  # Mark this as forecast data
        } for t, f in zip(forecast_times, forecast)]

        return forecast_data

    except Exception as e:
        print(f"Error during forecasting: {e}")
        return []

@app.route('/api/getElectricCost', methods=['GET'])
def get_electric_cost():
    # Fetch the actual data (last 2 hours)
    data = get_electric_cost_data()

    if data:
        # Generate the forecast data for the next 1 hour
        forecast_data = forecast_electric_cost(data)

        # Convert time strings in actual data to readable format (e.g., HH:mm)
        for entry in data:
            entry['time'] = parser.isoparse(entry['time']).astimezone(pytz.timezone('Asia/Bangkok')).strftime('%H:%M')
            entry['isForecast'] = False  # Set flag to False for actual data

        # Print actual data for debugging
        print("Actual Data (last 2 hours):")
        for entry in data:
            print(entry)

        # Print forecast data for debugging
        print("Forecast Data (next 1 hour):")
        for entry in forecast_data:
            print(entry)

        # Combine actual and forecast data
        combined_data = data + forecast_data

        # Prepare the response
        response_data = {
            "actual": data,           # Actual data from the last 2 hours
            "forecast": forecast_data, # Forecast for the next 1 hour
            "combined": combined_data  # Actual + Forecast
        }

        return jsonify({"data": response_data})

    else:
        return jsonify({"data": {"actual": [], "forecast": [], "combined": []}})

if __name__ == '__main__':
    app.run(debug=True)
