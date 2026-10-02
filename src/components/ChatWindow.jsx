import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { greenApi } from '../api/greenApi';
import { MessageInput } from './MessageInput';

const MessageStatus = ({ status }) => {
  if (status === 'read') {
    return (
      <span className="msg-status read" title="Прочитано">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <path
            d="M1 5.5L4.5 9L11 2"
            stroke="#4fc3f7"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 5.5L10.5 9L17 2"
            stroke="#4fc3f7"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="msg-status sent" title="Отправлено">
      <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <path
          d="M1 5.5L4.5 9L11 2"
          stroke="#c8ccd2"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export const ChatWindow = () => {
  const {
    idInstance,
    apiTokenInstance,
    chatId,
    messages,
    addMessage,
    updateMessageStatus,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let isSubscribed = true;

    const pollNotifications = async () => {
      if (!isSubscribed) return;

      try {
        const response = await greenApi.receiveNotification(
          idInstance,
          apiTokenInstance
        );
        const data = response.data;

        if (data) {
          const { receiptId, body } = data;

          await greenApi.deleteNotification(
            idInstance,
            apiTokenInstance,
            receiptId
          );

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            body.messageData?.typeMessage === 'textMessage'
          ) {
            const dialogChatId = body.chatId || body.senderData?.sender;

            if (!chatId || dialogChatId === chatId) {
              addMessage({
                id: body.idMessage,
                text: body.messageData.textMessageData.textMessage,
                type: 'incoming',
                chatId: dialogChatId,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              });
            }
          }

          if (body.typeWebhook === 'outgoingMessageStatus') {
            if (body.status === 'read') {
              updateMessageStatus(body.idMessage, 'read');
            }
          }
        }
      } catch {
        // silent fail — попробуем снова через секунду
      }

      if (isSubscribed) setTimeout(pollNotifications, 1000);
    };

    if (idInstance && apiTokenInstance) pollNotifications();

    return () => {
      isSubscribed = false;
    };
  }, [idInstance, apiTokenInstance, chatId, addMessage, updateMessageStatus]);

  const displayName = chatId ? chatId.replace('@c.us', '') : '';

  return (
    <main className="chat-area">
      <header className="chat-header">
        <div className="chat-header-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{displayName}</div>
          <div className="chat-header-status">Online</div>
        </div>
      </header>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">Нет сообщений. Напишите первым!</div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${
              msg.type === 'outgoing' ? 'outgoing' : 'incoming'
            }`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp}
              {msg.type === 'outgoing' && (
                <MessageStatus status={msg.status || 'sent'} />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </main>
  );
};