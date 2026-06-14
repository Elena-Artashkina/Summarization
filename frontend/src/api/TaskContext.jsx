// frontend/src/context/TaskContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { checkSummarizeStatus } from '../api/summarize';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [activeTask, setActiveTask] = useState(null); // { taskId, inputText }
  const [taskResult, setTaskResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTaskInput, setCompletedTaskInput] = useState(null); // Сохраняем исходный текст завершённой задачи
  const pollInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const startTask = (taskId, inputText) => {
    setActiveTask({ taskId, inputText });
    setTaskResult(null);
    setCompletedTaskInput(null);
    setIsLoading(true);
    
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
    
    pollInterval.current = setInterval(async () => {
      try {
        const status = await checkSummarizeStatus(taskId);
        
        if (status.status === 'completed') {
          setTaskResult(status.result);
          setCompletedTaskInput(inputText); // Сохраняем исходный текст
          setActiveTask(null);
          setIsLoading(false);
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        } else if (status.status === 'failed') {
          console.error('Ошибка:', status.error);
          setActiveTask(null);
          setIsLoading(false);
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        }
      } catch (err) {
        console.error('Ошибка проверки статуса:', err);
      }
    }, 1000);
  };

  const clearTask = () => {
    setActiveTask(null);
    setTaskResult(null);
    setCompletedTaskInput(null);
    setIsLoading(false);
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  return (
    <TaskContext.Provider value={{ 
      activeTask, 
      taskResult, 
      completedTaskInput,
      isLoading, 
      startTask, 
      clearTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};