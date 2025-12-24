"use client";

const STORAGE_KEY = 'new_year_card_draft';

export const storage = {
    saveDraft: (tpl: string, params: Record<string, string>) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ tpl, params, time: Date.now() }));
        } catch (e) {
            console.error("Storage error:", e);
        }
    },
    loadDraft: (): { tpl: string; params: Record<string, string> } | null => {
        if (typeof window === 'undefined') return null;
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },
    clearDraft: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
};
