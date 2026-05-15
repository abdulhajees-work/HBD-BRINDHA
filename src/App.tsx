import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 0 12 10.5 24 12C24 12 12 13.5 12 24C12 24 12 13.5 0 12C0 12 12 10.5 12 0Z" fill="currentColor"/>
  </svg>
);

const BackgroundSparkles = () => {
  const [dimensions, setDimensions] = useState({ w: 1000, h: 1000 });
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-white">
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-pink-50/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-rose-50/40 rounded-full blur-[80px]" />
      
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200/30"
          initial={{
            opacity: 0,
            x: Math.random() * dimensions.w,
            y: Math.random() * dimensions.h,
            scale: Math.random() * 0.4 + 0.3,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [null, Math.random() * -100 - 50],
            x: [null, Math.random() * 40 - 20],
          }}
          transition={{
            duration: Math.random() * 6 + 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 8,
          }}
        >
          <SparkleIcon className="w-6 h-6" />
        </motion.div>
      ))}
    </div>
  );
};

const InitialConfetti = () => {
  const [show, setShow] = useState(true);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 1000 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    setIsMounted(true);
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || !isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
      {[...Array(35)].map((_, i) => {
        const isCircle = Math.random() > 0.5;
        const color = ['#ffe4e6', '#fecdd3', '#fce7f3', '#fdf2f8', '#ffffff'][Math.floor(Math.random() * 5)];
        return (
          <motion.div
            key={i}
            className="absolute shadow-sm border border-rose-100/20"
            style={{
              background: color,
              left: `${Math.random() * 100}vw`,
              width: isCircle ? '8px' : '6px',
              height: isCircle ? '8px' : '16px',
              borderRadius: isCircle ? '50%' : '4px',
              top: -20,
            }}
            initial={{ y: -20, opacity: 1, rotate: Math.random() * 360 }}
            animate={{
              y: dimensions.h + 50,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720,
              x: (Math.random() - 0.5) * 200
            }}
            transition={{
              duration: Math.random() * 2.5 + 2.5,
              ease: "easeIn",
            }}
          />
        );
      })}
    </div>
  );
};

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-40 rounded-full bg-rose-100/30 blur-[40px] w-48 h-48 -ml-24 -mt-24 transition-opacity duration-300"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "tween", ease: "linear", duration: 0.05 }}
    />
  );
};

export default function App() {
  const [bursts, setBursts] = useState<{id: number, x: number, y: number}[]>([]);
  const burstIdRef = useRef(0);

  const handleHeadingClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const currentId = burstIdRef.current++;
    setBursts(prev => [...prev, { id: currentId, x, y }]);
    
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== currentId));
    }, 1000);
  };

  return (
    <div className="relative min-h-screen selection:bg-rose-100 selection:text-rose-900 bg-white font-sans text-slate-900">
      <BackgroundSparkles />
      <InitialConfetti />
      <CursorGlow />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-center w-full max-w-3xl flex flex-col items-center"
        >
          <motion.div 
            className="mb-3 inline-block relative cursor-pointer"
            onClick={handleHeadingClick}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-slate-900 border-b border-transparent mb-2">
              Happy Birthday <span className="text-pink-400 font-medium">Brindha</span>
            </h1>
            
            <AnimatePresence>
              {bursts.map(burst => (
                <div key={burst.id} className="absolute pointer-events-none" style={{ left: burst.x, top: burst.y }}>
                  {[...Array(6)].map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    const dist = 30 + Math.random() * 20;
                    return (
                      <motion.div
                        key={i}
                        className="absolute -ml-2 -mt-2 text-rose-300"
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{ 
                          x: Math.cos(angle) * dist, 
                          y: Math.sin(angle) * dist,
                          scale: [0, Math.random() * 0.5 + 0.5, 0],
                          opacity: 0
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <SparkleIcon className="w-4 h-4" />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.p 
            className="text-lg text-slate-400 font-light tracking-wide italic mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            To the calmest TL in chaos
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="w-full relative z-10 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-50 to-rose-50 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <motion.div 
              className="relative w-full max-w-[640px] mx-auto bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-12 md:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(255,182,193,0.15)] flex flex-col items-center text-center"
            >
              <div className="w-12 h-1 bg-pink-100 rounded-full mb-8" />
              
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 font-light max-w-[500px]">
                Your calm presence, patience, and guidance make even the busiest days feel lighter.
                <span className="block mt-6">
                  Thank you for being such a wonderful lead and for always supporting the team with kindness and grace.
                </span>
                <span className="block mt-6">
                  Wishing you happiness, peace, and beautiful moments ahead.
                </span>
              </p>

              <div className="mt-10 flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-pink-200" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 sm:mt-24 text-center z-10"
          >
            <div className="h-[1px] w-24 bg-pink-100 mx-auto mb-6" />
            <p className="text-xs text-slate-400 tracking-widest uppercase">
              With love from the <span className="text-slate-900 font-medium">Aalee Team</span>
            </p>
          </motion.div>
          
        </motion.div>
      </main>
    </div>
  );
}
