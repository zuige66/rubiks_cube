'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ControlPanel from '@/components/ControlPanel';

const RubiksCube = dynamic(() => import('@/components/RubiksCube'), {
  ssr: false,
});

export default function Home() {
  const [style, setStyle] = useState<'grid' | 'glass'>('grid');
  const [highlightCenters, setHighlightCenters] = useState(false);
  const [highlightEdges, setHighlightEdges] = useState(false);
  const [highlightCorners, setHighlightCorners] = useState(false);
  const [highlightWhites, setHighlightWhites] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showFaces, setShowFaces] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cubeKey, setCubeKey] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [actionAnim, setActionAnim] = useState<string | null>(null);

  // Helper to animate action buttons
  const animateAction = (id: string, duration = 600) => {
    setActionAnim(id);
    setTimeout(() => setActionAnim(null), duration);
  };

  const handleRotate = useCallback(() => {
    animateAction('rotate');
    setRotationSpeed(5);
    setTimeout(() => setRotationSpeed(1), 2000);
  }, []);

  const handleRealign = useCallback(() => {
    animateAction('realign');
    setCubeKey(prev => prev + 1);
  }, []);

  const handleShuffle = useCallback(() => {
    animateAction('shuffle');
    setCubeKey(prev => prev + 1);
    setRotationSpeed(10);
    setTimeout(() => setRotationSpeed(1), 1000);
  }, []);

  const handleUndo = useCallback(() => {
    animateAction('undo');
    setHighlightCenters(false);
    setHighlightEdges(false);
    setHighlightCorners(false);
    setHighlightWhites(false);
    setShowNumbers(false);
    setShowFaces(false);
  }, []);

  const handleDemo = useCallback(() => {
    animateAction('demo', 2000);
    let step = 0;
    const steps = [
      () => {
        setHighlightCenters(true);
        setHighlightEdges(false);
        setHighlightCorners(false);
        setHighlightWhites(false);
      },
      () => {
        setHighlightCenters(false);
        setHighlightEdges(true);
      },
      () => {
        setHighlightEdges(false);
        setHighlightCorners(true);
      },
      () => {
        setHighlightCorners(false);
        setHighlightWhites(true);
      },
      () => {
        setHighlightWhites(false);
      },
    ];

    const interval = setInterval(() => {
      if (step < steps.length) {
        steps[step]();
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
  }, []);

  const sectionsData = [
    {
      title: 'STYLES',
      buttons: [
        {
          id: 'grid',
          label: 'Grid',
          active: style === 'grid',
          onClick: () => setStyle('grid'),
        },
        {
          id: 'glass',
          label: 'Glass',
          active: style === 'glass',
          onClick: () => setStyle('glass'),
        },
      ],
    },
    {
      title: 'CUBELETS',
      buttons: [
        {
          id: 'centers',
          label: 'Centers',
          active: highlightCenters,
          onClick: () => setHighlightCenters(!highlightCenters),
        },
        {
          id: 'edges',
          label: 'Edges',
          active: highlightEdges,
          onClick: () => setHighlightEdges(!highlightEdges),
        },
        {
          id: 'corners',
          label: 'Corners',
          active: highlightCorners,
          onClick: () => setHighlightCorners(!highlightCorners),
        },
        {
          id: 'whites',
          label: 'Whites',
          active: highlightWhites,
          onClick: () => setHighlightWhites(!highlightWhites),
        },
      ],
    },
    {
      title: 'LABELS',
      buttons: [
        {
          id: 'numbers',
          label: 'Numbers',
          active: showNumbers,
          onClick: () => setShowNumbers(!showNumbers),
        },
        {
          id: 'faces',
          label: 'Faces',
          active: showFaces,
          onClick: () => setShowFaces(!showFaces),
        },
      ],
    },
    {
      title: 'ACTIONS',
      buttons: [
        {
          id: 'rotate',
          label: 'Rotate',
          active: false,
          onClick: handleRotate,
          animated: actionAnim === 'rotate',
        },
        {
          id: 'realign',
          label: 'Realign',
          active: false,
          onClick: handleRealign,
          animated: actionAnim === 'realign',
        },
        {
          id: 'shuffle',
          label: 'Shuffle',
          active: false,
          onClick: handleShuffle,
          animated: actionAnim === 'shuffle',
        },
        {
          id: 'undo',
          label: 'Undo',
          active: false,
          onClick: handleUndo,
          animated: actionAnim === 'undo',
        },
        {
          id: 'demo',
          label: 'Demo',
          active: false,
          onClick: handleDemo,
          animated: actionAnim === 'demo',
        },
      ],
    },
  ];

  // Custom ControlPanel wrapper to inject animation classes for action buttons
  function AnimatedControlPanel({ sections }: { sections: typeof sectionsData }) {
    return (
      <div className="fixed left-0 bottom-0 w-full flex justify-center z-40 pointer-events-none">
        <div className="bg-[#232321] bg-opacity-90 rounded-t-2xl shadow-2xl px-8 py-6 flex gap-12 pointer-events-auto">
          {sections.map((section, i) => (
            <div key={section.title}>
              <div className="text-xs font-bold text-gray-400 mb-2 tracking-widest">{section.title}</div>
              <div className="flex flex-col gap-2">
                {section.buttons.map((btn) => {
                  // Add animation classes for action buttons
                  let animClass = '';
                  const isAnimated = 'animated' in btn && btn.animated;
                  if (section.title === 'ACTIONS' && isAnimated) {
                    if (btn.id === 'rotate') animClass = 'animate-spin-slow';
                    else if (btn.id === 'shuffle') animClass = 'animate-bounce';
                    else if (btn.id === 'realign') animClass = 'animate-pulse';
                    else if (btn.id === 'undo') animClass = 'animate-wiggle';
                    else if (btn.id === 'demo') animClass = 'animate-flash';
                  }
                  return (
                    <button
                      key={btn.id}
                      onClick={btn.onClick}
                      className={`
                        px-4 py-2 rounded font-semibold text-sm transition-all
                        ${btn.active ? 'bg-white text-black shadow' : 'bg-[#232321] text-gray-200 hover:bg-[#333]'}
                        ${animClass}
                        ${section.title === 'ACTIONS' ? 'border border-[#444] mt-1' : ''}
                        focus:outline-none
                      `}
                      style={{
                        boxShadow: btn.active
                          ? '0 0 0 2px #fff, 0 2px 8px 0 rgba(0,0,0,0.2)'
                          : undefined,
                        transform: isAnimated ? 'scale(1.08)' : undefined,
                        transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                      }}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Animations */}
        <style jsx global>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 1s linear;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
          }
          .animate-bounce {
            animation: bounce 0.6s;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1;}
            50% { opacity: 0.5;}
          }
          .animate-pulse {
            animation: pulse 0.7s;
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg);}
            20%, 60% { transform: rotate(3deg);}
            40%, 80% { transform: rotate(-3deg);}
          }
          .animate-wiggle {
            animation: wiggle 0.5s;
          }
          @keyframes flash {
            0%, 100% { background: #232321;}
            50% { background: #fff; color: #232321;}
          }
          .animate-flash {
            animation: flash 1.2s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#1a1a19]">
      {/* Info button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="fixed top-8 right-8 w-12 h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center text-xl font-light z-50"
      >
        i
      </button>

      {/* Social share buttons */}
      <div className="fixed bottom-8 left-8 flex gap-3 z-50">
        <a
          href="#"
          className="w-10 h-10 rounded-full bg-[#3b5998] hover:bg-[#4c6ab2] transition-colors flex items-center justify-center"
          title="Share on Facebook"
        >
          <span className="text-white text-xl">f</span>
        </a>
        <a
          href="#"
          className="w-10 h-10 rounded-full bg-[#1da1f2] hover:bg-[#3db3f5] transition-colors flex items-center justify-center"
          title="Share on Twitter"
        >
          <span className="text-white text-xl">t</span>
        </a>
        <a
          href="#"
          className="w-10 h-10 rounded-full bg-[#dd4b39] hover:bg-[#e66852] transition-colors flex items-center justify-center"
          title="Share on Google+"
        >
          <span className="text-white text-xl">g+</span>
        </a>
        <a
          href="#"
          className="w-10 h-10 rounded-full bg-[#35465c] hover:bg-[#465770] transition-colors flex items-center justify-center"
          title="Share on Tumblr"
        >
          <span className="text-white text-xl">t</span>
        </a>
      </div>

      {/* Chrome Cube Lab badge */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="http://chrome.com/cubelab"
          target="_blank"
          rel="noopener noreferrer"
          className="block opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="text-[#666] text-xs tracking-wider">CHROME CUBE LAB</div>
        </a>
      </div>

      {/* Main cube container */}
      <div className="absolute inset-0 flex items-center justify-center pb-32">
        <div className="w-[600px] h-[600px]">
          <RubiksCube
            key={cubeKey}
            style={style}
            highlightCenters={highlightCenters}
            highlightEdges={highlightEdges}
            highlightCorners={highlightCorners}
            highlightWhites={highlightWhites}
            showNumbers={showNumbers}
            showFaces={showFaces}
            rotationSpeed={rotationSpeed}
          />
        </div>
      </div>

      {/* Animated Control Panel with action button animations */}
      <AnimatedControlPanel sections={sectionsData} />

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-8">
          <div className="bg-[#1a1a19] border border-[#333] max-w-3xl max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 w-8 h-8 border border-[#333] hover:border-white transition-colors text-white"
            >
              ✕
            </button>

            <h1 className="text-3xl font-bold mb-6 text-white">Rubik's Cube Explorer</h1>

            <p className="text-gray-300 mb-6">
              An interactive presentation to help you understand the basics of Rubik's Cube.
              Have a go experimenting with the different kinds of cubelets—centers, edges,
              and corners—to see how these simple elements combine to create the beautiful
              complexity of the cube.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">Made with friends</h2>

            <p className="text-gray-300 mb-6">
              This demo runs on the Cuber framework created by Stewart Smith at Google Creative Lab.
              It's the same backbone that powers the Rubik's Cube Google Doodle as well as other
              experiments from Chrome Cube Lab.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">Hackable by design</h2>

            <p className="text-gray-300">
              This cube responds to twist commands and lets you get fancy with JavaScript.
              Open your browser's console and try commands to control the cube programmatically.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
