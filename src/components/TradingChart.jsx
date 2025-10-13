
import GraphCard from "./GraphCard";


const TradingChart = ({symbol}) => {

  return (
    <div className="bg-zinc-800 rounded p-4 h-[400px]">
      <h2 className="text-lg font-semibold mb-2">Chart - </h2>
      <div className="flex justify-center items-center h-full text-gray-400">
        Trading chart for {symbol} will go here
      </div>
    </div>
  );
}


export default TradingChart;