import Chart from "react-apexcharts";

/**
 * GraphCard
 * Props:
 *  - title: string
 *  - series: [{ data: [...] }]
 *  - options: apex options object
 *  - height: number|string
 */
const GraphCard = ({ title, series, options, height = 520, className = "" }) => {
  return (
    <div className={`rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3 border-b border-zinc-600 pb-2 ">
        <h3 className="text-3xl font-bold">{title}</h3>
      </div>

      <div className=" px-4 py-6 sm:py-4 rounded-xl" style={{ width: "100%", height }}>
        {series && options ? (
          <Chart
            options={options}
            series={series}
            type="candlestick"
            height={height}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span>Loading chart...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphCard;
