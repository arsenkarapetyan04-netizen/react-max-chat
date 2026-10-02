import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { greenApi } from '../api/greenApi';

export const MessageInput = () => {
  const [text, setText] = useState('');
  const { idInstance, apiTokenInstance, chatId, addMessage } = useChatStore();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    const messageText = text.trim();
    setText('');

    const tempId = Date.now().toString();
    addMessage({
      id: tempId,
      text: messageText,
      type: 'outgoing',
      status: 'sent',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    try {
      await greenApi.sendMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        messageText
      );
    } catch {
      // silent fail — сообщение остаётся в UI
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSend}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Сообщение"
        disabled={!chatId}
      />
      <button type="submit" disabled={!text.trim() || !chatId} title="Отправить">
        ➤
      </button>
    </form>
  );
};