import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { greenApi } from '../api/greenApi';

export const AuthForm = () => {
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { setAuth, setLoading, isLoading } = useChatStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.trim() || !token.trim()) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await greenApi.getSettings(id.trim(), token.trim());
      setAuth(id.trim(), token.trim());
    } catch {
      setError('Неверный idInstance или apiTokenInstance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-letter">M</span>
        </div>

        <h2>Вход в MAX Chat</h2>
        <p className="auth-subtitle">
          Введите данные из личного кабинета GREEN-API
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>idInstance</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Например: 1101000000"
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label>apiTokenInstance</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ваш токен"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" disabled={isLoading} className="auth-btn">
            {isLoading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};