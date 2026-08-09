import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FileText, Upload, File, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { uploadDocument, getDocuments, deleteDocument } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Documents() {
  const { analysis } = useApp();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    try {
      const res = await getDocuments();
      const mapped = (res.data || []).map(d => ({
        id: d.id,
        name: d.filename,
        size: 0,
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString()
      }));
      setFiles(mapped);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);
    for (const file of selectedFiles) {
      try {
        const result = await uploadDocument(file);
        const doc = result.document;
        setFiles(prev => [
          { 
            id: doc.id, 
            name: doc.filename, 
            size: file.size, 
            status: doc.status || 'uploaded', 
            date: new Date().toLocaleDateString() 
          },
          ...prev
        ]);
      } catch {
        setFiles(prev => [
          { name: file.name, size: file.size, status: 'failed', date: new Date().toLocaleDateString() },
          ...prev
        ]);
      }
    }
    setUploading(false);
  };

  const removeFile = async (fileObj, idx) => {
    if (fileObj.id) {
      try {
        await deleteDocument(fileObj.id);
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
    }
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Header */}
      <motion.div variants={item} className="rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-slate-500" />
          <h2 className="text-xl font-bold text-slate-800">
            Document Management
          </h2>
        </div>
        <p className="text-xs text-slate-450 font-semibold">Upload and manage your startup documents</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={item}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload({ target: { files: e.dataTransfer.files } }); }}
        className="rounded-3xl p-10 border-2 border-dashed border-purple-200/80 bg-violet-50/20 hover:bg-violet-50/40 text-center cursor-pointer transition-colors shadow-sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx" />
        <Upload className="w-11 h-11 text-purple-650 mx-auto mb-4" />
        <h3 className="text-base font-extrabold text-slate-850 mb-1.5">Upload Documents</h3>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">Drag & drop files or click to browse (PDF, DOC, XLSX, PPTX)</p>
      </motion.div>

      {uploading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs font-bold text-purple-650">
          <Loader2 className="w-4 h-4 animate-spin" /> <span>Uploading files...</span>
        </motion.div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <motion.div variants={item} className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-sm font-extrabold text-slate-850">Uploaded Documents ({files.length})</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {files.map((file, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{formatSize(file.size)} • {file.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {file.status === 'uploaded' ? (
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                  ) : (
                    <span className="text-xs text-red-500 font-bold">Failed</span>
                  )}
                  <button onClick={() => removeFile(file, i)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}