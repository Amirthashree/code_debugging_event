import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { emitAntiCheatViolation } from '../services/socketService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AntiCheatContext = createContext();

export const AntiCheatProvider = ({ children }) => {
  const { user } = useAuth();
  const [violationsCount, setViolationsCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [lastViolationType, setLastViolationType] = useState('');
  const [autoSubmitTrigger, setAutoSubmitTrigger] = useState(false);

  // Enter Fullscreen helper
  const requestFullscreen = useCallback(() => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  }, []);

  const handleViolation = useCallback(async (type, details = '') => {
    if (!user || user.role === 'admin' || isDisqualified) return;

    setLastViolationType(type);
    setWarningModalOpen(true);

    try {
      const res = await API.post('/admin/violations', { type, details });
      const newCount = res.data.currentViolationsCount;
      setViolationsCount(newCount);

      // Emit real-time telemetry to Socket.io
      emitAntiCheatViolation({
        userId: user.id || user._id,
        username: user.username,
        type,
        details,
        violationsCount: newCount
      });

      if (res.data.isDisqualified || newCount >= 5) {
        setIsDisqualified(true);
        setAutoSubmitTrigger(true);
        toast.error('DISQUALIFIED: Exceeded maximum anti-cheat violation limit (5)!', { duration: 8000 });
      } else {
        toast.error(`⚠️ Anti-Cheat Warning (${newCount}/5): ${type} detected!`, { duration: 4000 });
      }
    } catch (err) {
      console.error('Failed to record violation:', err);
    }
  }, [user, isDisqualified]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;

    // Check Fullscreen Status
    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && !isDisqualified) {
        handleViolation('FULLSCREEN_EXIT', 'Participant exited full-screen mode');
      }
    };

    // Tab switch / Visibility change
    const onVisibilityChange = () => {
      if (document.hidden && !isDisqualified) {
        handleViolation('TAB_SWITCH', 'Participant switched tabs or minimized window');
      }
    };

    // Window Blur
    const onBlur = () => {
      if (!isDisqualified) {
        handleViolation('WINDOW_BLUR', 'Window lost focus');
      }
    };

    // Disable Right-Click
    const onContextMenu = (e) => {
      e.preventDefault();
      handleViolation('RIGHT_CLICK_ATTEMPT', 'Right click context menu attempt');
      return false;
    };

    // Disable Copy/Paste
    const onCopy = (e) => {
      e.preventDefault();
      handleViolation('COPY_PASTE_ATTEMPT', 'Copy action prohibited');
      return false;
    };
    const onPaste = (e) => {
      e.preventDefault();
      handleViolation('COPY_PASTE_ATTEMPT', 'Paste action prohibited');
      return false;
    };

    // Disable DevTools Keyboard Shortcuts (F12, Ctrl+Shift+I/J/C)
    const onKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I', 'i'].includes(e.key))
      ) {
        e.preventDefault();
        handleViolation('DEVTOOLS_ATTEMPT', 'Developer Tools shortcut detected');
        return false;
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [user, isDisqualified, handleViolation]);

  return (
    <AntiCheatContext.Provider value={{
      violationsCount,
      isFullscreen,
      isDisqualified,
      warningModalOpen,
      setWarningModalOpen,
      lastViolationType,
      requestFullscreen,
      autoSubmitTrigger,
      setAutoSubmitTrigger
    }}>
      {children}
    </AntiCheatContext.Provider>
  );
};

export const useAntiCheat = () => useContext(AntiCheatContext);
