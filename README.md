# MAX Chat — тестовое задание

SPA-приложение на React для обмена текстовыми сообщениями в мессенджере MAX через GREEN-API.

## Стек

- **React 18** + **Vite**
- **Zustand** — управление состоянием + persist в localStorage
- **Axios** — HTTP-клиент
- **Vanilla CSS** — стилизация в тёмной теме MAX

## Возможности

- Авторизация по `idInstance` и `apiTokenInstance` из GREEN-API
- Сохранение сессии в `localStorage` (не выкидывает при перезагрузке)
- Проверка существования аккаунта MAX по номеру телефона (`checkAccount`)
- Отправка текстовых сообщений (`sendMessage`)
- Получение входящих сообщений через Long Polling (`receiveNotification` + `deleteNotification`)
- Тёмная тема в стиле MAX

## Локальный запуск

### Требования

- Node.js 18+
- npm

### Установка

```bash
git clone https://github.com/arsenkarapetyan04-netizen/react-max-chat.git
cd react-max-chat
npm install

### Запуск dev-сервера

```bash
npm run dev
```

Открой http://localhost:5173

### Сборка

```bash
npm run build
