import warnings
from influxdb_client import InfluxDBClient
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.model_selection import ParameterGrid
from statsmodels.tools.sm_exceptions import ConvergenceWarning


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=ConvergenceWarning)


url = "http://172.27.0.1:8086/"
token = "BFkn29Q_BpjgPICrVOT0IGiZZRIie2YiOG3vWymHR_KSnRsIP_2n_9oPvMvcPgKvgMZIbKAIPvy4qwKHJExGGQ=="
org = "swd"
bucket = "BMS"

client = InfluxDBClient(url=url, token=token, org=org)
query_api = client.query_api()


def get_electric_cost_data():
    query = f'''
    from(bucket: "{bucket}")
    |> range(start: -2h)
    |> filter(fn: (r) => r._measurement == "power_meter" and r._field == "electric_cost")
    |> aggregateWindow(every: 10m, fn: last, createEmpty: false)
    |> yield(name: "last")
    '''
    
    result = query_api.query(org=org, query=query)
    
    time_data = [record.get_time() for table in result for record in table.records]
    cost_data = [record.get_value() for table in result for record in table.records]
    
    df = pd.DataFrame({'Time': pd.to_datetime(time_data), 'Electric Cost': cost_data}).set_index('Time')
    return df.asfreq('10T')

# Fit ARIMA model and return AIC
def fit_arima_model(df, p, d, q):
    try:
        model = ARIMA(df['Electric Cost'], order=(p, d, q))
        return model.fit().aic
    except:
        return np.inf

# Perform grid search to find the best (p,d,q) and return the best AIC
def grid_search_arima(df, p_values, d_values, q_values):
    param_grid = ParameterGrid({'p': p_values, 'd': d_values, 'q': q_values})
    best_params, best_aic = None, np.inf

    print(f"{'p':<5} {'d':<5} {'q':<5} {'AIC':<10}")
    print("=" * 25)

    for params in param_grid:
        p, d, q = params['p'], params['d'], params['q']
        aic = fit_arima_model(df, p, d, q)
        print(f"{p:<5} {d:<5} {q:<5} {aic:<10.4f}")
        if aic < best_aic:
            best_aic, best_params = aic, (p, d, q)

    return best_params, best_aic

# Fetch data and perform ARIMA grid search
df = get_electric_cost_data()
best_params, best_aic = grid_search_arima(df, range(0, 3), range(0, 2), range(0, 3))

# Print the best ARIMA model and AIC
print(f"\nBest ARIMA model: ARIMA{best_params} with AIC: {best_aic:.4f}")
