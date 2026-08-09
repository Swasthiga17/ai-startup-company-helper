import React, { useState, useEffect } from 'react';

// Store current audio playback state globally so speech can be controlled anywhere
let currentUtterance = null;

export const useVoiceCloning = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [customVoiceName, setCustomVoiceName] = useState(() => {
    return localStorage.getItem('genie_voice_name') || 'My Cloned Voice Profile';
  });
  const [voiceSampleUrl, setVoiceSampleUrl] = useState(() => {
    return localStorage.getItem('genie_voice_sample') || null;
  });

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Restore saved voice preference or pick a default clear English voice
        const savedVoiceURI = localStorage.getItem('genie_voice_uri');
        if (savedVoiceURI) {
          const match = availableVoices.find(v => v.voiceURI === savedVoiceURI);
          if (match) {
            setSelectedVoice(match);
            return;
          }
        }
        
        const defaultVoice = availableVoices.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
        ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const saveCustomVoice = (name, sampleDataUrl, voiceObj) => {
    setCustomVoiceName(name);
    localStorage.setItem('genie_voice_name', name);
    
    if (sampleDataUrl) {
      setVoiceSampleUrl(sampleDataUrl);
      localStorage.setItem('genie_voice_sample', sampleDataUrl);
    }

    if (voiceObj) {
      setSelectedVoice(voiceObj);
      localStorage.setItem('genie_voice_uri', voiceObj.voiceURI);
    }
  };

  const speak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // stop previous speech

    if (!text || text.trim() === '') return;

    const cleanedText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  return {
    voices,
    selectedVoice,
    setSelectedVoice: (v) => {
      setSelectedVoice(v);
      if (v) localStorage.setItem('genie_voice_uri', v.voiceURI);
    },
    isPlaying,
    rate,
    setRate,
    pitch,
    setPitch,
    customVoiceName,
    voiceSampleUrl,
    saveCustomVoice,
    speak,
    stop,
    pause,
    resume
  };
};
