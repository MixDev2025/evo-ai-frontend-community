import { useEffect } from 'react';

const DEFAULT_TITLE = 'ChatMix';

export function useUnreadTabTitle(totalUnread: number) {
  useEffect(() => {
    const prevTitle = document.title;

    if (totalUnread > 0) {
      document.title = `(${totalUnread}) ${DEFAULT_TITLE}`;
    } else {
      document.title = DEFAULT_TITLE;
    }

    return () => {
      document.title = prevTitle;
    };
  }, [totalUnread]);
}
