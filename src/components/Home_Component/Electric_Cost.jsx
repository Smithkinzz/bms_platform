import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

// Custom legend with circular dots
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            listStyleType: 'none',
            display: 'flex',
            alignItems: 'center',
            margin: '0 10px'
          }}
        >
          {/* Circle Icon */}
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: entry.color,
              marginRight: '5px',
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          ></div>
          {/* Text */}
          <span>{entry.dataKey === "PM2.5" ? "PM2.5" : entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const ElectricCostGraph = () => {
  const [data, setData] = useState([]);

  // Fetch the data from the Flask API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getElectricCost");
        if (response.data && response.data.data) {
          // Merge actual and forecast data to ensure continuity
          const combinedData = response.data.data.combined.map((entry) => {
            return {
              ...entry,
              electric_cost_forecast: entry.isForecast ? entry.electric_cost : null, // Display forecast only when it's a forecast
              electric_cost_actual: entry.isForecast ? null : entry.electric_cost, // Display actual only when it's not a forecast
            };
          });
          setData(combinedData);
        }
      } catch (error) {
        console.error("Error fetching electric cost data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 pe-12">
      <Text fw={900} size={17}>
        Electric Cost{" "}
        <Text
          component="span"
          variant="gradient"
          gradient={{ from: "blue", to: "violet", deg: 45 }}
          fw={900}
          size={17}
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          AI forecast
        </Text>
      </Text>

      {/* Render the Recharts LineChart */}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: "black" }} /> {/* X-axis labels in black */}
          <YAxis tick={{ fill: "black" }} /> {/* Y-axis labels in black */}
          <Tooltip />
          <Legend content={renderLegend} /> {/* Custom legend with circular dots */}

     

          {/* Line for actual data */}
          <Line 
            type="monotone" 
            dataKey="electric_cost_actual" 
            stroke="#6D28D9" 
            name="Actual" 
            dot={false} 
            isAnimationActive={true}
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            strokeOpacity={1}
          />

               {/* Line for forecast data */}
               <Line
            type="monotone"
            dataKey="electric_cost"
            stroke="#6366F1"
            name="AI forecast"  // Changed label here
            strokeDasharray="5 5"  // Dashed line
            dot={false}
            isAnimationActive={true}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            strokeOpacity={0.5}
          />
          
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectricCostGraph;
