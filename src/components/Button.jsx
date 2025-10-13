import { Link } from "react-router-dom";

const Button = ({ text, className = "", onClick, icon, to }) => {
  const baseStyles = `
    relative inline-flex items-center gap-2 justify-center
    px-5 py-2 rounded-md font-medium overflow-hidden
    border border-white text-white btn-slide 
  `;

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${className}`}>
        {icon && <span className="w-5 h-5 z-10">{icon}</span>}
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`}>
      {icon && <span className="w-5 h-5 z-10">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;
