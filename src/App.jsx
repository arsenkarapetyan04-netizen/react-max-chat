import React, { useState } from 'react';
import { useChatStore } from './store/useChatStore';
import { greenApi } from './api/greenApi';
import { AuthForm } from './components/AuthForm';
import { ChatWindow } from './components/ChatWindow';
import './index.css';

function App() {
  const {
    isAuth,
    chatId,
    setChatId,
    idInstance,
    apiTokenInstance,
    messages,
    logout,
  } = useChatStore();

  const [phoneInput, setPhoneInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!phoneInput) return;

    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }

    setChecking(true);
    setPhoneError('');

    try {
      const response = await greenApi.checkAccount(
        idInstance,
        apiTokenInstance,
        cleanPhone
      );

      if (response.data.exist) {
        setChatId(response.data.chatId);
      } else {
        setPhoneError('На этом номере нет аккаунта в MAX');
      }
    } catch {
      setPhoneError('Ошибка проверки номера. Попробуйте позже.');
    } finally {
      setChecking(false);
    }
  };

  if (!isAuth) return <AuthForm />;

  if (!chatId) {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>Чаты</h1>
          </div>

          <div className="sidebar-list">
            <div className="sidebar-empty">Нет чатов</div>
          </div>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={logout}>
              Выйти
            </button>
          </div>
        </aside>

        <main className="chat-area">
          <div className="chat-setup">
            <h2>Новый чат</h2>
            <p className="subtitle">Введите номер телефона получателя</p>
            <form onSubmit={handleCreateChat}>
              <input
                type="text"
                placeholder="79999999999"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                disabled={checking}
              />
              {phoneError && <div className="error-msg">{phoneError}</div>}
              <button type="submit" disabled={checking} className="primary-btn">
                {checking ? 'Проверка...' : 'Начать чат'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Чаты</h1>
        </div>

        <div className="sidebar-list">
          <div className="sidebar-item active">
            <div className="sidebar-avatar">
              {chatId.replace('@c.us', '').charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-item-info">
              <div className="sidebar-item-name">
                {chatId.replace('@c.us', '')}
              </div>
              <div className="sidebar-item-last">
                {messages.length > 0
                  ? messages[messages.length - 1].text
                  : 'Нет сообщений'}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            Выйти
          </button>
        </div>
      </aside>

      <ChatWindow />
    </div>
  );
}

export default App;