import React, { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, User, Stethoscope } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';
interface ChatPanelProps {
  requestId: string;
  patientName: string;
  doctorName: string;
}
export const ChatPanel: React.FC<ChatPanelProps> = ({
  requestId,
  patientName,
  doctorName
}) => {
  const { messages, sendMessage, currentUserId, currentRole } = useAppContext();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestMessages = messages.
  filter((m) => m.requestId === requestId).
  sort(
    (a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [requestMessages]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const senderName =
    currentRole === 'patient' ?
    patientName :
    currentRole === 'doctor' ?
    doctorName :
    'Admin';
    sendMessage(requestId, inputText, currentUserId, senderName, currentRole);
    setInputText('');
  };
  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {currentRole === 'patient' ?
          <Stethoscope size={18} className="text-medical-blue" /> :

          <User size={18} className="text-slate-500" />
          }
          {currentRole === 'patient' ?
          `Chat with ${doctorName}` :
          `Chat with ${patientName}`}
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Secure Connection
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {requestMessages.length === 0 ?
        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Stethoscope size={32} className="opacity-20" />
            <p className="text-sm">No messages yet. Start the conversation.</p>
          </div> :

        requestMessages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-500">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  </span>
                </div>
                <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-medical-blue text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                
                  {msg.text}
                </div>
              </div>);

        })
        }
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <button
            type="button"
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            
            <Paperclip size={20} />
          </button>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-medical-blue focus-within:ring-1 focus-within:ring-medical-blue transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a secure message..."
              className="w-full max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }} />
            
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-medical-blue text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-medical-blue transition-colors flex-shrink-0">
            
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>);

};