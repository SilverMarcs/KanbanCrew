import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Type } from '@/models/Type';

type TaskTypeDropdownProps = {
  taskId: string;
  currentType: Type;
  setTaskType: React.Dispatch<React.SetStateAction<Type>>;
};

export const TaskTypeDropdown = ({ taskId, currentType, setTaskType }: TaskTypeDropdownProps) => {
  const [selectedType, setSelectedType] = useState<Type>(currentType);

  const handleTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as Type;
    setSelectedType(newType);
    setTaskType(newType);

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { type: newType });
      console.log(`Task ${taskId} updated to type: ${newType}`);
    } catch (error) {
      console.error('Error updating task type:', error);
    }
  };

  return (
    <select
      value={selectedType}
      onChange={handleTypeChange}
      className="border p-2 rounded"
    >
      <option value={Type.UserStory}>{Type.UserStory}</option>
      <option value={Type.Bug}>{Type.Bug}</option>
    </select>
  );
};
