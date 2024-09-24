// src/components/TimeLogEditor.tsx
import React, { useState } from "react";
import { TimeLog } from "@/models/Task";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TimeLogEditorProps {
  timeLogs?: TimeLog[]; // Make the prop optional
  onSave: (timeLogs: TimeLog[]) => void;
}

const TimeLogEditor: React.FC<TimeLogEditorProps> = ({ timeLogs = [], onSave }) => {
  const [logs, setLogs] = useState<TimeLog[]>(timeLogs); // Initialize with an empty array if undefined

  const addTimeLog = () => {
    setLogs([...logs, { date: new Date(), hours: 0 }]);
  };

  const updateTimeLog = (index: number, updatedLog: TimeLog) => {
    const newLogs = logs.map((log, i) => (i === index ? updatedLog : log));
    setLogs(newLogs);
  };

  const saveLogs = () => {
    onSave(logs);
  };

  return (
    <div>
      <h3 className="text-lg font-bold">Time Logs</h3>
      {logs.map((log, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Calendar
            mode="single"
            selected={log.date}
            onSelect={(date) => date && updateTimeLog(index, { ...log, date })}
          />
          <input
            type="number"
            value={log.hours}
            onChange={(e) =>
              updateTimeLog(index, { ...log, hours: Number(e.target.value) })
            }
            className="border rounded px-2 py-1"
          />
          <span>{format(log.date, "P")}</span>
        </div>
      ))}
      <Button onClick={addTimeLog}>Add Time Log</Button>
      <Button onClick={saveLogs}>Save Logs</Button>
    </div>
  );
};

export default TimeLogEditor;