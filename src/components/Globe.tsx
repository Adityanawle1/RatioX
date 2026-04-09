import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  isData?: boolean;
  pulse?: number;
  id: string; // Add ID for connection tracking
}

interface Arc {
  p1: Point;
  p2: Point;
  opacity: number;
}

interface Packet {
  arc: Arc;
  progress: number;
  speed: number;
}

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Dynamic Sizing
    const getRadius = () => {
      const rect = canvas.getBoundingClientRect();
      return Math.min(rect.width, rect.height) * 0.38; // Even larger
    };

    // Generate globe points
    const points: Point[] = [];
    const radius = getRadius();
    const numPoints = 1200; // Increased density
    const numDataPoints = 40; 

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      points.push({ x, y, z, originalX: x, originalY: y, originalZ: z, id: `p-${i}` });
    }

    const dataPoints: Point[] = [];
    for (let i = 0; i < numDataPoints; i++) {
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.random() * Math.PI * 2;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      const dp = { 
        x, y, z, 
        originalX: x, originalY: y, originalZ: z,
        isData: true,
        pulse: Math.random() * Math.PI * 2,
        id: `d-${i}`
      };
      points.push(dp);
      dataPoints.push(dp);
    }

    // Add Parallax Starfield (Layer 0 Background)
    const starfield: {x: number, y: number, z: number, s: number}[] = [];
    for(let i=0; i<200; i++){
      starfield.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        s: Math.random() * 0.8
      });
    }

    // Arcs & Packets (More cinematic)
    const arcs: Arc[] = [];
    const packets: Packet[] = [];
    for (let i = 0; i < 20; i++) {
      const p1 = dataPoints[Math.floor(Math.random() * dataPoints.length)];
      let p2 = dataPoints[Math.floor(Math.random() * dataPoints.length)];
      while (p1 === p2) p2 = dataPoints[Math.floor(Math.random() * dataPoints.length)];
      
      const arc = { p1, p2, opacity: 0.3 + Math.random() * 0.4 };
      arcs.push(arc);
      
      packets.push({
        arc,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.008
      });
    }

    let rotation = 0;
    let rotationVelocity = 0.004;
    const axisTilt = { x: 0, y: 0 };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // --- BREATHING & PULSE ---
      const time = Date.now() * 0.001;
      const breathing = radius * (1 + Math.sin(time * 0.5) * 0.03); // Subtle expansion

      // --- LAYER 0: NEBULA GLOW (BOUNDLESS) ---
      const nebula = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 3);
      nebula.addColorStop(0, 'rgba(232, 147, 16, 0.12)'); // Amber core
      nebula.addColorStop(0.3, 'rgba(30, 60, 100, 0.05)'); // Azure space
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // --- LAYER 0.1: DEEP SPACE PARALLAX ---
      starfield.forEach(s => {
        const perspective = 800;
        const scale = perspective / (perspective + s.z);
        const sx = centerX + s.x * scale;
        const sy = centerY + s.y * scale;
        if(sx < 0 || sx > rect.width || sy < 0 || sy > rect.height) return;
        ctx.beginPath();
        ctx.arc(sx, sy, s.s * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${0.1 * scale})`;
        ctx.fill();
        s.z -= 0.5; // Star movement
        if(s.z < -perspective) s.z = 800; // Reset
      });

      // --- LAYER 0.5: ATMOSPHERIC AURA ---
      const aura = ctx.createRadialGradient(centerX, centerY, breathing * 0.8, centerX, centerY, breathing * 1.5);
      aura.addColorStop(0, 'rgba(232, 147, 16, 0.15)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, breathing * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // --- PHYSICS UPDATE ---
      rotation += rotationVelocity;
      rotationVelocity *= 0.985; // Natural decay
      if (rotationVelocity < 0.0025) rotationVelocity = 0.0025;

      const targetTiltY = (mouseRef.current.y - centerY) * 0.0006;
      const targetTiltX = (mouseRef.current.x - centerX) * 0.0006;
      axisTilt.y += (targetTiltY - axisTilt.y) * 0.06;
      axisTilt.x += (targetTiltX - axisTilt.x) * 0.06;

      // Project points with breathing scale
      const projected = points.map(p => {
        const rotated = rotatePoint(p, rotation, axisTilt);
        const perspective = 700;
        const scale = perspective / (perspective + rotated.z);
        return {
          ...p,
          projX: centerX + (rotated.x * (breathing/radius)) * scale,
          projY: centerY + (rotated.y * (breathing/radius)) * scale,
          projZ: rotated.z,
          scale
        };
      }).sort((a, b) => a.projZ - b.projZ);

      // --- LAYER 1: NETWORK ARCS ---
      arcs.forEach(arc => {
        const p1 = projected.find(p => p.id === arc.p1.id);
        const p2 = projected.find(p => p.id === arc.p2.id);
        if (!p1 || !p2) return;
        if (p1.projZ < -50 && p2.projZ < -50) return;

        const dist = Math.sqrt(Math.pow(p1.projX - p2.projX, 2) + Math.pow(p1.projY - p2.projY, 2));
        const lift = dist * 0.45;
        const midX = (p1.projX + p2.projX) / 2;
        const midY = (p1.projY + p2.projY) / 2;
        const mag = Math.sqrt(Math.pow(midX - centerX, 2) + Math.pow(midY - centerY, 2));
        const cpX = midX + ((midX - centerX)/mag) * lift;
        const cpY = midY + ((midY - centerY)/mag) * lift;

        const opacity = Math.min(1, (Math.min(p1.projZ, p2.projZ) + radius) / (radius * 2.2));

        ctx.beginPath();
        ctx.moveTo(p1.projX, p1.projY);
        ctx.quadraticCurveTo(cpX, cpY, p2.projX, p2.projY);
        ctx.strokeStyle = `rgba(232, 147, 16, ${arc.opacity * opacity * 0.7})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Packets
        const packet = packets.find(pk => pk.arc === arc);
        if (packet) {
          packet.progress += packet.speed;
          if (packet.progress > 1) {
            packet.progress = 0;
            packet.speed = 0.003 + Math.random() * 0.008;
          }
          const t = packet.progress;
          const pkX = Math.pow(1-t, 2)*p1.projX + 2*(1-t)*t*cpX + Math.pow(t, 2)*p2.projX;
          const pkY = Math.pow(1-t, 2)*p1.projY + 2*(1-t)*t*cpY + Math.pow(t, 2)*p2.projY;
          
          ctx.beginPath();
          ctx.arc(pkX, pkY, 2.5 * p1.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 150, ${opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(232, 147, 16, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // --- LAYER 2: POINTS ---
      projected.forEach(p => {
        const opacity = Math.max(0, (p.projZ + radius) / (radius * 1.8));
        if (opacity === 0) return;
        
        if (p.isData) {
          const pulse = Math.sin(Date.now() * 0.0025 + (p.pulse || 0)) * 0.4 + 0.6;
          const size = (2 + pulse) * p.scale;
          
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 147, 16, ${opacity * 0.5 * pulse})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.projX, p.projY, size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * pulse})`;
          ctx.fill();
        } else {
          const tPhase = Math.sin(Date.now() * 0.001 + (points.indexOf(p) * 0.2));
          const size = (0.8 + tPhase * 0.3) * p.scale;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 230, 255, ${opacity * 0.4 * (0.6 + tPhase * 0.4)})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const rotatePoint = (point: Point, rotation: number, tilt: { x: number; y: number }) => {
      let { x, y, z } = point;
      
      // Rotate Y (Global spin)
      const cosY = Math.cos(rotation);
      const sinY = Math.sin(rotation);
      const nx = x * cosY - z * sinY;
      const nz = x * sinY + z * cosY;
      x = nx;
      z = nz;

      // Rotate Tilt Pitch (Mouse Y)
      const cosP = Math.cos(tilt.y);
      const sinP = Math.sin(tilt.y);
      const ny = y * cosP - z * sinP;
      const nz2 = y * sinP + z * cosP;
      y = ny;
      z = nz2;

      // Rotate Tilt Yaw (Mouse X)
      const cosW = Math.cos(tilt.x);
      const sinW = Math.sin(tilt.x);
      const nx2 = x * cosW - y * sinW;
      const ny2 = x * sinW + y * cosW;
      x = nx2;
      y = ny2;

      return { x, y, z };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y };
      
      // Add "kick" to rotation velocity when moving mouse
      rotationVelocity += Math.abs(x - mouseRef.current.x) * 0.00001;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 transition-all duration-1500 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ filter: 'blur(0px)' }}
      />
    </div>
  );
};

export default Globe;