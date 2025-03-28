import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function PriceHistoryChart({ data }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
{/* 
          type="monotone" ------->	Defines the type of curve for the line. "monotone" ensures a smooth curve. Other values: "linear", "basis", "step", etc.
          dataKey="bestbuy"	-----> Specifies the data field from the dataset that this line will represent. It maps to the bestbuy field in your data object.
          name="Best Buy"	------->The label used in the tooltip and legend for this line. It makes it more readable for users.
          stroke="hsl(var(--secondary, 280 100% 70%))" ----->	Defines the color of the line. Uses an HSL (Hue, Saturation, Lightness) CSS variable for dynamic theming.
          strokeWidth={2} ------->	Sets the thickness of the line. A value of 2 means it's slightly bold.
          activeDot={{ r: 8 }}--->	Defines the appearance of the dot when hovering over a data point. { r: 8 } means the radius is 8px.
 */}

          <Line
            type="monotone"
            dataKey="amazon"
            name="Amazon"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="bestbuy"
            name="Best Buy"
            stroke="hsl(var(--secondary, 280 100% 70%))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="walmart"
            name="Walmart"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="hsl(var(--muted))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

