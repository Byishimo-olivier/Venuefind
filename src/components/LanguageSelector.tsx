import { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          containerId: string,
        ) => void;
      };
    };
  }
}

const scriptId = 'google-translate-script';
const tempContainerId = 'google-translate-temp-container';

// Fallback languages list in case Google Translate doesn't load properly
const FALLBACK_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'sw', name: 'Swahili' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
];

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="18" height="18">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2c0 0 2 4 2 10s-2 10-2 10M12 2c0 0-2 4-2 10s2 10 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 5h19M2.5 19h19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LanguageSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  const [currentLang, setCurrentLang] = useState('en');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Translate script
    if (!document.getElementById(scriptId)) {
      window.googleTranslateElementInit = () => {
        // Try to get languages from Google Translate if available
        const tempContainer = document.getElementById(tempContainerId);
        if (tempContainer) {
          const select = tempContainer.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (select) {
            const langs: Array<{ code: string; name: string }> = [];
            Array.from(select.options).forEach((option) => {
              if (option.value && option.value !== '') {
                langs.push({
                  code: option.value,
                  name: option.text,
                });
              }
            });
            if (langs.length > 0) {
              setLanguages(langs);
            }
          }
        }
      };

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);

      // Create temp container for Google Translate
      setTimeout(() => {
        if (!document.getElementById(tempContainerId)) {
          const tempDiv = document.createElement('div');
          tempDiv.id = tempContainerId;
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);

          // Initialize Google Translate in temp container
          const googleTranslate = window.google?.translate;
          if (googleTranslate?.TranslateElement) {
            try {
              new googleTranslate.TranslateElement(
                {
                  autoDisplay: false,
                  pageLanguage: 'en',
                },
                tempContainerId,
              );
              window.googleTranslateElementInit?.();
            } catch (e) {
              console.error('Error initializing Google Translate:', e);
            }
          }
        }
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleLanguageSelect = (langCode: string) => {
    setCurrentLang(langCode);

    // Trigger Google Translate
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }

    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        className="language-selector-button"
        aria-label="Select language"
        style={{
          background: '#fff',
          border: '1px solid rgba(27,67,50,0.12)',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(23, 60, 46, 0.1)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(27,67,50,0.12)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <LanguageIcon />
      </button>
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            zIndex: 1001,
            backgroundColor: 'var(--color-bg-cream)',
            border: '1px solid var(--color-light-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '240px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: lang.code === currentLang ? 'rgba(27,67,50,0.1)' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s ease',
                borderBottom: '1px solid var(--color-light-border)',
                fontWeight: lang.code === currentLang ? '600' : '400',
              }}
              onMouseEnter={(e) => {
                if (lang.code !== currentLang) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(27,67,50,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (lang.code !== currentLang) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
