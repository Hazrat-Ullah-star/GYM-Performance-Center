import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button, Input } from '../ui';

export interface MessageItem {
  id: string | number;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
}

export interface MessagesWidgetProps {
  messages: MessageItem[];
  onSendMessage?: (text: string) => void;
}

export const MessagesWidget: React.FC<MessagesWidgetProps> = ({
  messages: initialMessages,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newText, setNewText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newMsg: MessageItem = {
      id: Date.now(),
      sender: 'You',
      text: newText.trim(),
      time: 'Just now',
    };

    setMessages([...messages, newMsg]);
    if (onSendMessage) onSendMessage(newText.trim());
    setNewText('');
  };

  return (
    <div className="g-glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-warning" />
          <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>
            Community Messages
          </h4>
        </div>

        <div className="d-flex flex-column gap-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-3 ${
                msg.sender === 'You' ? 'bg-orange-500/15 ms-4 border border-orange-500/30' : 'bg-white/[0.03] me-4 border border-white/5'
              }`}
            >
              <div className="d-flex justify-content-between text-xs mb-1">
                <span className="text-warning font-semibold">{msg.sender}</span>
                <span className="text-secondary">{msg.time}</span>
              </div>
              <p className="text-white text-sm mb-0 leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="d-flex gap-2 pt-3 border-top border-white/10">
        <Input
          placeholder="Type a message..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="py-2 text-xs"
        />
        <Button type="submit" variant="primary" size="sm" className="px-3">
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
};

export default MessagesWidget;
