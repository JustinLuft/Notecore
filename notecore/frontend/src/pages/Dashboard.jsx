import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Zap } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('SYNCED');
  const [dirty, setDirty] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const editorRef = useRef(null);

  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'GUEST';
  const userId = localStorage.getItem('userId');
  const API = `${import.meta.env.VITE_API_URL}/notes`;

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 8000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    if (!userId) return navigate('/');
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      });
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Load note when selected
  useEffect(() => {
    if (currentNote) {
      const note = notes.find((n) => n.id === currentNote);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setDirty(false);
        setSaveStatus('SYNCED');
      }
    } else {
      setTitle('');
      setContent('');
      setDirty(false);
      setSaveStatus('SYNCED');
    }
  }, [currentNote, notes]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setDirty(true);
    setSaveStatus('UNSAVED');
  };

  const createNewNote = async () => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ title: 'UNTITLED_FILE.txt', content: '' }),
      });
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setCurrentNote(newNote.id);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const saveNote = async () => {
    if (!currentNote) return;
    setSaveStatus('UPLOADING...');
    try {
      const res = await fetch(`${API}/${currentNote}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('Failed to save note');
      setNotes((prev) =>
        prev.map((note) =>
          note.id === currentNote ? { ...note, title, content } : note
        )
      );
      setSaveStatus('SYNCED');
      setDirty(false);
    } catch (err) {
      console.error(err);
      setSaveStatus('ERROR');
    }
  };

  // Delete flow
  const requestDeleteNote = (id) => setConfirmDelete(id);
  const confirmDeleteNote = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${API}/${confirmDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((note) => note.id !== confirmDelete));
      if (currentNote === confirmDelete) setCurrentNote(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  };

  const downloadPDF = () => {
    if (!currentNote) return;
    const doc = new jsPDF();
    doc.setFont('courier', 'normal');
    doc.setFontSize(14);
    doc.text(title, 10, 20);
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 30);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading)
    return <div className="text-cyan-400 p-10 font-mono">Loading notes...</div>;

  // Apply toolbar formatting commands
  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setDirty(true);
    setSaveStatus('UNSAVED');
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-80 bg-black border-r-2 border-cyan-500 flex flex-col relative z-10">
        <div className="p-4 border-b-2 border-cyan-500">
          <div className="text-cyan-400 font-mono text-xs mb-3 flex items-center gap-2">
            <Zap size={14} className="animate-pulse" /> NEURAL INTERFACE v2.077
          </div>
          <button
            onClick={createNewNote}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-all"
          >
            <Plus size={20} /> NEW_FILE.exe
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between mb-1">
                <button
                  onClick={() => setCurrentNote(note.id)}
                  className={`w-full text-left px-3 py-3 transition-all font-mono text-sm border-l-2 ${
                    currentNote === note.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                      : 'border-transparent text-gray-400 hover:bg-gray-900 hover:border-cyan-600 hover:text-cyan-500'
                  }`}
                >
                  <div className="font-bold truncate flex items-center gap-2">
                    <FileText size={14} />
                    {note.title}
                  </div>
                  <div className="text-xs opacity-70 truncate mt-1">
                    {note.content.replace(/<[^>]+>/g, '').substring(0, 40) ||
                      '>>> EMPTY FILE'}
                  </div>
                </button>
                <button
                  onClick={() => requestDeleteNote(note.id)}
                  className="text-red-500 px-2 font-bold hover:text-red-400 transition-all"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Header */}
        <div className="bg-black border-b-2 border-cyan-500 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex-1">
            {currentNote && (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className={`text-xl font-bold font-mono bg-transparent text-cyan-400 outline-none border-none ${
                  glitchEffect ? 'glitch' : ''
                }`}
                placeholder="FILENAME.txt"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-xs font-mono px-2 py-1 rounded ${
                saveStatus === 'SYNCED'
                  ? 'bg-green-950 text-green-400'
                  : saveStatus === 'UNSAVED'
                  ? 'bg-red-950 text-red-400 animate-pulse'
                  : saveStatus === 'UPLOADING...'
                  ? 'bg-yellow-950 text-yellow-400 animate-pulse'
                  : 'bg-gray-950 text-gray-400'
              }`}
            >
              {saveStatus}
            </span>

            <span className="text-cyan-400 font-mono text-sm">{username}</span>

            <button
              onClick={saveNote}
              className="px-2 py-1 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-all text-xs"
            >
              SAVE
            </button>

            <button
              onClick={downloadPDF}
              className="px-2 py-1 bg-purple-500 text-black font-mono font-bold rounded hover:bg-purple-400 transition-all text-xs"
            >
              DOWNLOAD PDF
            </button>

            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-red-500 text-black font-mono font-bold rounded hover:bg-red-400 transition-all text-xs"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6 overflow-y-auto bg-black flex flex-col">
          {currentNote ? (
            <>
              {/* 🧰 Toolbar */}
              <div className="flex gap-2 mb-4 border-b border-cyan-700 pb-3">
                <button
                  onClick={() => execCmd('bold')}
                  className="px-3 py-1 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 text-xs"
                >
                  BOLD
                </button>
                <button
                  onClick={() => execCmd('italic')}
                  className="px-3 py-1 bg-cyan-500 text-black font-mono italic rounded hover:bg-cyan-400 text-xs"
                >
                  ITALIC
                </button>
                <select
                  onChange={(e) => execCmd('foreColor', e.target.value)}
                  className="bg-black border border-cyan-600 text-cyan-400 text-xs font-mono rounded px-2"
                >
                  <option value="#00ff00">Green</option>
                  <option value="#00ffff">Cyan</option>
                  <option value="#ff00ff">Magenta</option>
                  <option value="#ff0000">Red</option>
                  <option value="#ffffff">White</option>
                </select>
                <select
                  onChange={(e) => execCmd('fontSize', e.target.value)}
                  className="bg-black border border-cyan-600 text-cyan-400 text-xs font-mono rounded px-2"
                >
                  <option value="2">Small</option>
                  <option value="3">Normal</option>
                  <option value="4">Large</option>
                  <option value="5">XL</option>
                  <option value="6">XXL</option>
                </select>
              </div>

              {/* 🧾 Editable content area (fixed typing glitch) */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  setContent(e.currentTarget.innerHTML);
                  setDirty(true);
                  setSaveStatus('UNSAVED');
                }}
                onBlur={() => saveNote()}
                className="flex-1 min-h-96 outline-none bg-transparent text-green-400 font-mono text-sm leading-relaxed overflow-y-auto p-2 border border-cyan-800 rounded"
                style={{
                  textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                  caretColor: '#00ff00',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-start pt-6 text-center text-cyan-400 font-mono">
              <FileText size={80} className="mx-auto mb-6 opacity-30" />
              <p className="text-xl neon-text">NO FILE SELECTED</p>
              <p className="text-sm text-gray-600">
                Initialize a new session or access existing files
              </p>
            </div>
          )}
        </div>

        {/* 🔥 Delete Confirmation Overlay */}
        {confirmDelete && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="border-2 border-cyan-500 bg-black p-6 rounded-2xl shadow-[0_0_20px_#00ffff55] font-mono text-center w-80">
              <p className="text-cyan-400 mb-4 text-sm">
                CONFIRM DELETION OF FILE?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDeleteNote}
                  className="px-4 py-2 bg-red-500 text-black font-bold rounded hover:bg-red-400 transition-all"
                >
                  DELETE
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-700 text-cyan-300 font-bold rounded hover:bg-gray-600 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
