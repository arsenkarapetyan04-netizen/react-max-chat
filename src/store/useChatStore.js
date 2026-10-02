import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set) => ({
      idInstance: '',
      apiTokenInstance: '',
      isAuth: false,

      chatId: '',
      messages: [],

      isLoading: false,
      error: null,

      setAuth: (id, token) =>
        set({ idInstance: id, apiTokenInstance: token, isAuth: true }),

      setChatId: (id) => set({ chatId: id }),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      updateMessageStatus: (id, status) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        })),

      setLoading: (val) => set({ isLoading: val }),
      setError: (err) => set({ error: err }),
      clearError: () => set({ error: null }),

      logout: () =>
        set({
          idInstance: '',
          apiTokenInstance: '',
          isAuth: false,
          chatId: '',
          messages: [],
          error: null,
        }),
    }),
    {
      name: 'max-chat-storage',
      partialize: (state) => ({
        idInstance: state.idInstance,
        apiTokenInstance: state.apiTokenInstance,
        isAuth: state.isAuth,
        chatId: state.chatId,
        messages: state.messages,
      }),
    }
  )
);