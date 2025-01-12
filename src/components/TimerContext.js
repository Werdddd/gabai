import React, { createContext, useState, useEffect } from 'react';


export const TimerContext = createContext();


export function TimerProvider({ children }) {
  const [timer, setTimer] = useState(1800); 
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerInterval;

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;

          setIsStudyTime((prev) => !prev);
          return isStudyTime ? 300 : 1800;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval); 
  }, [isRunning, isStudyTime]);

  return (
    <TimerContext.Provider value={{ timer, isStudyTime, isRunning, setIsRunning }}>
      {children}
    </TimerContext.Provider>
  );
}
