'use client';

interface ControlButton {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface ControlSection {
  title: string;
  buttons: ControlButton[];
}

interface ControlPanelProps {
  sections: ControlSection[];
  onAction?: (action: string) => void;
}

export default function ControlPanel({ sections, onAction }: ControlPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a19] border-t border-[#2a2a28] py-6 px-8 z-40">
      <div className="max-w-[1200px] mx-auto flex justify-between items-start gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <h3 className="text-[#666] text-xs font-bold tracking-[0.2em] uppercase mb-2">
              {section.title}
            </h3>
            <div className="flex gap-2">
              {section.buttons.map((button) => (
                <button
                  key={button.id}
                  onClick={button.onClick}
                  className={`w-12 h-12 border transition-all duration-200 ${
                    button.active
                      ? 'border-white bg-[#2a2a28] shadow-lg'
                      : 'border-[#333] bg-transparent hover:border-[#666] hover:bg-[#222]'
                  }`}
                  title={button.label}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {renderIcon(button.id, button.active)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderIcon(id: string, active: boolean) {
  const color = active ? '#fff' : '#666';

  switch (id) {
    case 'grid':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="4" y="4" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="12" y="4" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="20" y="4" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="12" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="12" y="12" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="20" y="12" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="20" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="12" y="20" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="20" y="20" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'glass':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="6" y="6" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <rect x="8" y="8" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        </svg>
      );
    case 'centers':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="12" y="12" width="8" height="8" fill={color} />
        </svg>
      );
    case 'edges':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="12" y="4" width="8" height="8" fill={color} />
          <rect x="4" y="12" width="8" height="8" fill={color} />
          <rect x="20" y="12" width="8" height="8" fill={color} />
          <rect x="12" y="20" width="8" height="8" fill={color} />
        </svg>
      );
    case 'corners':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="4" y="4" width="8" height="8" fill={color} />
          <rect x="20" y="4" width="8" height="8" fill={color} />
          <rect x="4" y="20" width="8" height="8" fill={color} />
          <rect x="20" y="20" width="8" height="8" fill={color} />
        </svg>
      );
    case 'whites':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="4" y="4" width="8" height="8" fill={color} />
          <rect x="12" y="4" width="8" height="8" fill={color} />
          <rect x="20" y="4" width="8" height="8" fill={color} />
          <rect x="4" y="12" width="8" height="8" fill={color} />
          <rect x="12" y="12" width="8" height="8" fill={color} />
          <rect x="20" y="12" width="8" height="8" fill={color} />
          <rect x="4" y="20" width="8" height="8" fill={color} />
          <rect x="12" y="20" width="8" height="8" fill={color} />
          <rect x="20" y="20" width="8" height="8" fill={color} />
        </svg>
      );
    case 'numbers':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <text x="8" y="12" fill={color} fontSize="8" fontWeight="bold">1</text>
          <text x="16" y="12" fill={color} fontSize="8" fontWeight="bold">2</text>
          <text x="22" y="12" fill={color} fontSize="8" fontWeight="bold">3</text>
          <text x="8" y="20" fill={color} fontSize="8" fontWeight="bold">4</text>
          <text x="16" y="20" fill={color} fontSize="8" fontWeight="bold">5</text>
        </svg>
      );
    case 'faces':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <text x="6" y="20" fill={color} fontSize="12" fontWeight="bold">F</text>
          <text x="18" y="20" fill={color} fontSize="12" fontWeight="bold">R</text>
        </svg>
      );
    case 'rotate':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2">
          <path d="M 16 8 A 8 8 0 1 1 8 16" />
          <polygon points="16,8 12,4 12,12" fill={color} />
        </svg>
      );
    case 'realign':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2">
          <path d="M 12 12 L 20 20 M 20 12 L 12 20" />
        </svg>
      );
    case 'shuffle':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2">
          <path d="M 8 12 L 24 12" />
          <path d="M 8 20 L 24 20" />
          <polygon points="24,12 20,8 20,16" fill={color} />
          <polygon points="8,20 12,16 12,24" fill={color} />
        </svg>
      );
    case 'undo':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2">
          <path d="M 20 8 A 8 8 0 1 0 12 16" />
          <polygon points="12,16 16,12 16,20" fill={color} />
        </svg>
      );
    case 'demo':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <polygon points="12,8 24,16 12,24" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}
