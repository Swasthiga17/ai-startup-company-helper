import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload, Play, CheckCircle, Volume2, Sparkles, AlertCircle, Save, Trash2 } from 'lucide-react';
import { useVoiceCloning } from '../hooks/useVoiceCloning';

export default function VoiceStudio() {
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    customVoiceName,
    voiceSampleUrl,
    saveCustomVoice,
    speak,
    stop,
    isPlaying
  } = useVoiceCloning();

  const [voiceNameInput, setVoiceNameInput] = useState(customVoiceName);
  const [audioFile, setAudioFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(voiceSampleUrl);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [testText, setTestText] = useState("Hello! I am your AI Startup Genie co-founder, cloned with your custom voice profile.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Handle Voice Sample Audio File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Please upload a valid audio file (.mp3, .wav, .m4a)');
        return;
      }
      setAudioFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Micro-recording in browser
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewUrl(event.target.result);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access permission required to record voice sample.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleSaveProfile = () => {
    saveCustomVoice(voiceNameInput, previewUrl, selectedVoice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl relative overflow-hidden shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Voice Cloning & Studio Engine</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">AI Voice Cloning Studio</h1>
          <p className="text-xs text-purple-200 font-medium max-w-2xl leading-relaxed">
            Upload your audio sample or record your voice to create your personalized AI Startup Genie narrator. Your voice will read market reports, pitch deck slides, and SWOT analysis aloud across every page.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Voice Upload & Recorder */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Mic className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-extrabold text-slate-800">1. Voice Sample Input</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Voice Profile Label</label>
            <input
              type="text"
              value={voiceNameInput}
              onChange={(e) => setVoiceNameInput(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. Alex's Startup Founder Voice"
            />
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Upload Voice Audio (.mp3, .wav)</label>
            <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
              <Upload className="w-8 h-8 text-purple-500 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-700">Click to upload voice sample</span>
              <span className="text-[10px] text-slate-400 mt-1">Recommended: 15 to 60 seconds clear audio speech</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">OR RECORD IN BROWSER</span>
          </div>

          {/* Browser Mic Recording Button */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-2">
            {isRecording ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-rose-500/20 cursor-pointer animate-pulse"
              >
                <Mic className="w-4 h-4" />
                <span>Stop Recording ({recordTime}s)</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-purple-900 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-purple-900/20 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-pink-400" />
                <span>Record Voice Sample via Mic</span>
              </motion.button>
            )}
          </div>

          {/* Sample Preview Player */}
          {previewUrl && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 space-y-2">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">Uploaded / Recorded Audio Preview</span>
              <audio controls src={previewUrl} className="w-full text-xs" />
            </div>
          )}
        </div>

        {/* Right Column: Voice Engine Selection & Test */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Volume2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-800">2. Match Neural Voice Engine</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Neural Speech Synthesizer</label>
              <select
                value={selectedVoice ? selectedVoice.voiceURI : ''}
                onChange={(e) => {
                  const match = voices.find(v => v.voiceURI === e.target.value);
                  if (match) setSelectedVoice(match);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Voice Prompt */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Test Text Narration Prompt</label>
              <textarea
                rows={3}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => speak(testText)}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-extrabold rounded-xl transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-purple-700" />
                <span>{isPlaying ? 'Speaking...' : 'Test Voice Output'}</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveProfile}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <Save className="w-4 h-4 text-yellow-300" />
              <span>Save Voice Profile & Enable Page Narrations</span>
            </motion.button>

            {savedSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                <CheckCircle className="w-4 h-4" />
                <span>Voice Profile Saved Successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
