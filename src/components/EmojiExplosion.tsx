import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  velocity: { x: number; y: number };
  rotation: number;
  opacity: number;
  scale: number;
}

interface EmojiExplosionProps {
  x: number;
  y: number;
  emoji: string;
  onComplete: () => void;
}

export default function EmojiExplosion({ x, y, emoji, onComplete }: EmojiExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 12;
    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x,
      y,
      emoji,
      velocity: {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.8) * 20
      },
      rotation: Math.random() * 360,
      opacity: 1,
      scale: 0.8 + Math.random() * 0.4
    }));

    setParticles(initialParticles);

    let lastTime = performance.now();
    let animationFrameId: number;

    function animate(currentTime: number) {
      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;

      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x * deltaTime,
          y: particle.y + particle.velocity.y * deltaTime,
          velocity: {
            x: particle.velocity.x * 0.95,
            y: particle.velocity.y + 0.5 * deltaTime
          },
          rotation: particle.rotation + 2 * deltaTime,
          opacity: particle.opacity - 0.02 * deltaTime,
          scale: particle.scale * 0.99
        }));

        if (updatedParticles.every(p => p.opacity <= 0)) {
          onComplete();
          return [];
        }

        return updatedParticles;
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [x, y, emoji, onComplete]);

  return (
    <div className="fixed pointer-events-none" style={{ zIndex: 9999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: particle.opacity,
            fontSize: '2rem',
            transition: 'transform 0.05s linear, opacity 0.05s linear',
            willChange: 'transform, opacity'
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
}
