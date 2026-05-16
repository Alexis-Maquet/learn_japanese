import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KanjiList } from '../types';
import { logger } from '../utils/logger';

interface ListStore {
  lists: KanjiList[];
  createList: (name: string, description: string) => KanjiList;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string, description: string) => void;
  addKanjiToList: (listId: string, kanji: string) => void;
  removeKanjiFromList: (listId: string, kanji: string) => void;
  getList: (id: string) => KanjiList | undefined;
  isKanjiInList: (listId: string, kanji: string) => boolean;
}

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      lists: [],

      createList: (name, description) => {
        const list: KanjiList = {
          id: crypto.randomUUID(),
          name,
          description,
          kanjis: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ lists: [...s.lists, list] }));
        logger.info('listStore', `Liste créée : "${name}"`, { id: list.id });
        return list;
      },

      deleteList: (id) => {
        logger.info('listStore', `Liste supprimée`, { id });
        set((s) => ({ lists: s.lists.filter((l) => l.id !== id) }));
      },

      renameList: (id, name, description) => {
        logger.info('listStore', `Liste renommée : "${name}"`, { id });
        set((s) => ({
          lists: s.lists.map((l) => (l.id === id ? { ...l, name, description, updatedAt: Date.now() } : l)),
        }));
      },

      addKanjiToList: (listId, kanji) => {
        logger.debug('listStore', `Kanji ajouté à la liste`, { listId, kanji });
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId && !l.kanjis.includes(kanji)
              ? { ...l, kanjis: [...l.kanjis, kanji], updatedAt: Date.now() }
              : l
          ),
        }));
      },

      removeKanjiFromList: (listId, kanji) => {
        logger.debug('listStore', `Kanji retiré de la liste`, { listId, kanji });
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId ? { ...l, kanjis: l.kanjis.filter((k) => k !== kanji), updatedAt: Date.now() } : l
          ),
        }));
      },

      getList: (id) => get().lists.find((l) => l.id === id),

      isKanjiInList: (listId, kanji) => {
        const list = get().lists.find((l) => l.id === listId);
        return list ? list.kanjis.includes(kanji) : false;
      },
    }),
    { name: 'kanji-lists' }
  )
);
