import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: 'rgba(8, 12, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className={`g-glass-card p-4 p-md-5 w-100 ${maxWidthClasses}`}
        style={{ background: '#0f1419' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            {title && (
              <h3 className="text-white fw-bold mb-1" style={{ fontFamily: 'Oswald', fontSize: '24px' }}>
                {title}
              </h3>
            )}
            {description && <p className="text-secondary text-sm mb-0">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="btn btn-link text-secondary p-1 hover-orange text-decoration-none"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="my-4">{children}</div>

        {footer && <div className="pt-3 border-top border-white/10 d-flex gap-3 justify-content-end">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
