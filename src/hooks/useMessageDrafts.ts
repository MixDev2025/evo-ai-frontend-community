import { useCallback } from 'react';

const DRAFT_PREFIX = 'crm-chat-draft-';

export function useMessageDrafts() {
  const saveDraft = useCallback((conversationId: string | number | undefined, content: string) => {
    if (conversationId == null) return;
    const key = `${DRAFT_PREFIX}${conversationId}`;
    if (!content.trim()) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, content);
    }
  }, []);

  const loadDraft = useCallback((conversationId: string | number | undefined): string => {
    if (conversationId == null) return '';
    try {
      return localStorage.getItem(`${DRAFT_PREFIX}${conversationId}`) || '';
    } catch {
      return '';
    }
  }, []);

  const clearDraft = useCallback((conversationId: string | number | undefined) => {
    if (conversationId == null) return;
    localStorage.removeItem(`${DRAFT_PREFIX}${conversationId}`);
  }, []);

  return { saveDraft, loadDraft, clearDraft };
}
