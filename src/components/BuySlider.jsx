import { useState } from "react";

const BuySlider = ({ coin, balance, onBuy }) => {
  const coinPrice = coin.current_price; // adjust based on your coin API
  const [quantity, setQuantity] = useState(0);

  const maxQuantity = balance / coinPrice;

  return (
    <div className="bg-zinc-800 p-5 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">
        Buy {coin.name} ({coin.symbol?.toUpperCase()})
      </h3>

      {/* Quantity Box */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={0}
          max={maxQuantity}
          step="0.0001"
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
      </div>

      {/* Slider */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Choose Percentage</label>
        <input
          type="range"
          min={0}
          max={100}
          value={(quantity / maxQuantity) * 100 || 0}
          onChange={(e) => setQuantity((e.target.value / 100) * maxQuantity)}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={() => onBuy(quantity)}
        disabled={quantity <= 0}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
      >
        Buy
      </button>
    </div>
  );
};

export default BuySlider;
