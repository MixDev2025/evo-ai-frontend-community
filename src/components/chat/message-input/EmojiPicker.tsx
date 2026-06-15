import React, { useRef, useEffect } from 'react';
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsDarkClass } from '@/hooks/chat/useIsDarkClass';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose, isOpen }) => {
  const { t } = useLanguage('chat');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Verificar a classe dark diretamente no HTML
  const isDark = useIsDarkClass();

  // Converter tema do sistema para o tema do EmojiPicker
  const emojiTheme = isDark ? Theme.DARK : Theme.LIGHT;

  // Fechar o picker ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Adicionar evento após um pequeno delay para evitar fechar imediatamente
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    // Não fechar automaticamente para permitir múltiplas seleções
    // onClose();
  };

  return (
    <>
      {/* Mobile: Full-screen overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998] sm:hidden"
        onClick={onClose}
      />
      <div
        ref={pickerRef}
        className="fixed bottom-0 left-0 right-0 z-[9999] sm:absolute sm:bottom-full sm:left-0 sm:right-auto sm:mb-2"
        style={{
          minWidth: undefined,
          maxWidth: undefined,
        }}
      >
        <div className="bg-background border-t-2 sm:border-2 border-border sm:rounded-lg shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-t-lg">
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            theme={emojiTheme}
            searchPlaceHolder={t('messageInput.emojiPicker.searchPlaceholder')}
            width="100%"
            height="350px"
            previewConfig={{
              showPreview: false,
            }}
            skinTonesDisabled={false}
            searchDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;
