import { FaCheck, FaTimes, FaMinus } from "react-icons/fa";

const ScoreTest = () => {
  const items = [
    { icon: <FaCheck />, label: "True", value: 20, color: "primary" },
    { icon: <FaTimes />, label: "False", value: 20, color: "destructive" },
    { icon: <FaMinus />, label: "Missed", value: 20, color: "chart-5" },
  ];

  return (
    <div className="flex flex-row gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 border border-${item.color} text-${item.color} rounded-[30px] px-[15px] py-[5px]`}
        >
          {item.icon}
          <span>{item.label}:</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreTest;
