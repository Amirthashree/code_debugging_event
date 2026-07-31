import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { getSocket } from '../services/socketService';

const ContestContext = createContext();

export const ContestProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [contestStatus, setContestStatus] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/questions');
      setQuestions(res.data);
      if (res.data.length > 0 && !activeQuestion) {
        setActiveQuestion(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchContestStatus = async () => {
    try {
      const res = await API.get('/contest/status');
      setContestStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch contest status:', err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchContestStatus();

    const socket = getSocket();
    socket.on('contest:status_changed', (updatedContest) => {
      setContestStatus(updatedContest);
    });

    socket.on('leaderboard:updated', () => {
      fetchQuestions();
    });

    return () => {
      socket.off('contest:status_changed');
      socket.off('leaderboard:updated');
    };
  }, []);

  return (
    <ContestContext.Provider value={{
      questions,
      activeQuestion,
      setActiveQuestion,
      contestStatus,
      setContestStatus,
      loadingQuestions,
      refreshQuestions: fetchQuestions,
      refreshStatus: fetchContestStatus
    }}>
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => useContext(ContestContext);
