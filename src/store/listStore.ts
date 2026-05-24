import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KanjiList } from '@/types';
import { logger } from '@/utils/logger';

interface ListStore {
  lists: KanjiList[];
  createList: (name: string, description: string) => KanjiList;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string, description: string) => void;
  addKanjiToList: (listId: string, kanji: string) => void;
  addKanjisToList: (listId: string, kanjis: string[]) => void;
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
        set((s) => ({ lists: [...s.lists, list].sort((a, b) => a.name.localeCompare(b.name, 'fr')) }));
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
          lists: s.lists
            .map((l) => (l.id === id ? { ...l, name, description, updatedAt: Date.now() } : l))
            .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
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

      addKanjisToList: (listId, kanjis) => {
        logger.debug('listStore', `${kanjis.length} kanjis ajoutés à la liste`, { listId });
        set((s) => ({
          lists: s.lists.map((l) => {
            if (l.id !== listId) return l;
            const toAdd = kanjis.filter((k) => !l.kanjis.includes(k));
            if (toAdd.length === 0) return l;
            return { ...l, kanjis: [...l.kanjis, ...toAdd], updatedAt: Date.now() };
          }),
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
    {
      name: 'kanji-lists',
      onRehydrateStorage: () => (state) => {
        if (state) state.lists = state.lists.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      },
    }
  )
);
