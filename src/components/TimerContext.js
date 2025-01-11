import React, { createContext, useState, useEffect } from 'react';

// Create the Timer Context
export const TimerContext = createContext();

// Timer Provider Component
export function TimerProvider({ children }) {
  const [timer, setTimer] = useState(60); // 1 minute study time
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerInterval;

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;

          // Switch between study and rest time
          setIsStudyTime((prev) => !prev);
          return isStudyTime ? 300 : 60; // 5 minutes rest or 1 minute study
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [isRunning, isStudyTime]);

  return (
    <TimerContext.Provider value={{ timer, isStudyTime, isRunning, setIsRunning }}>
      {children}
    </TimerContext.Provider>
  );
}
