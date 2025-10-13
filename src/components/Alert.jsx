export default function Alert({ message, type = "error", onClose }) {
  const baseStyle = "p-3 rounded text-white flex justify-between items-center";
  const typeStyle =
    type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">×</button>
    </div>
  );
}
