import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Square, Play, Pause, FastForward, Mic, Settings, X, ChevronUp, Sparkles } from 'lucide-react';
import { useVoiceCloning } from '../hooks/useVoiceCloning';

export default function VoicePlayerBar({ textToRead, title = 'Page Narration' }) {
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    isPlaying,
    rate,
    setRate,
    speak,
    stop,
    pause,
    resume,
    customVoiceName,
    voiceSampleUrl
  } = useVoiceCloning();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [gradiumAudioUrl, setGradiumAudioUrl] = useState(null);
  const [isGradiumLoading, setIsGradiumLoading] = useState(false);

  const fetchGradiumVoice = async (pageName = 'dashboard') => {
    try {
      setIsGradiumLoading(true);
      const res = await fetch('http://localhost:8000/get-voice-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageName.toLowerCase().replace(/\s+/g, '-'), text: textToRead })
      });
      const data = await res.json();
      if (data.audio_url) {
        setGradiumAudioUrl(`http://localhost:8000${data.audio_url}`);
        const audio = new Audio(`http://localhost:8000${data.audio_url}`);
        audio.play();
      }
    } catch (err) {
      console.error('Gradium API Error:', err);
    } finally {
      setIsGradiumLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis.paused) {
        resume();
      } else {
        speak(textToRead);
      }
    }
  };

  if (!textToRead) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Voice Settings Modal Popup */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-80 bg-white rounded-2xl p-5 border border-purple-100 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Voice Synthesis Studio</h4>
                  <p className="text-[9px] text-slate-400 font-semibold">{customVoiceName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Audio Sample Player */}
            {voiceSampleUrl && (
              <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100/50 space-y-1.5">
                <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">Cloned Sample Preview</span>
                <audio controls src={voiceSampleUrl} className="w-full h-7 rounded-lg text-xs" />
              </div>
            )}

            {/* Select Voice Engine */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Synthetic Voice Engine</label>
              <select
                value={selectedVoice ? selectedVoice.voiceURI : ''}
                onChange={(e) => {
                  const match = voices.find(v => v.voiceURI === e.target.value);
                  if (match) setSelectedVoice(match);
                }}
                className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Playback Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Speed Rate</span>
                <span className="text-purple-600 font-black">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="2"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Audio Bar */}
      <motion.div
        layout
        className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-2.5 px-4 rounded-2xl shadow-xl border border-purple-500/20 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md ${isPlaying ? 'animate-pulse' : ''}`}>
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left pr-2">
            <h5 className="text-xs font-black tracking-tight leading-tight flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[8px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 uppercase">Voice AI</span>
            </h5>
            <p className="text-[9px] text-purple-300 font-semibold truncate max-w-[130px]">
              {selectedVoice ? selectedVoice.name.split(' ')[0] : 'Voice Genie'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <button
            onClick={() => fetchGradiumVoice(title)}
            disabled={isGradiumLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-[11px] font-extrabold rounded-xl shadow transition cursor-pointer disabled:opacity-50"
            title="Enable Voice Guidance with Gradium Cloned Voice"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{isGradiumLoading ? 'Generating...' : 'Enable Voice Guidance'}</span>
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold shadow transition cursor-pointer"
            title={isPlaying ? 'Pause Narration' : 'Play Narration'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={stop}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Stop Audio"
          >
            <Square className="w-3.5 h-3.5 fill-current text-rose-300" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Voice Cloning & Settings"
          >
            <Settings className="w-3.5 h-3.5 text-purple-300" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
