import React from "react";
import { History } from "lucide-react";

const HistoryLog: React.FC = () => {
  return (
    <div className="flex space-x-2 place-items-center justify-center">
      <History size={24} />
      <div className="font-semibold">History log</div>
    </div>
  );
};

export default HistoryLog;
