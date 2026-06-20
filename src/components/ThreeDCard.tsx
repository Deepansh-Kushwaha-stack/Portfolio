import React, { useRef, useState } from "react";

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glowColor?: string; // rgba representation
  key?: React.Key;
}

export default function ThreeDCard({
  children,
  className = "",
  id,
  glowColor = "rgba(16, 185, 129, 0.15)",
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside the element
    const y = e.clientY - rect.top;  // y position inside the element

    setCoords({ x, y });

    // Calculate rotation angles based on mouse position relative to card center
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Maximum tilt angle in degrees for immersive control
    const maxTilt = 8;
    const rx = ((centerY - y) / centerY) * maxTilt;
    const ry = ((x - centerX) / centerX) * maxTilt;

    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const style: React.CSSProperties = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transformStyle: "preserve-3d",
    transition: isHovered ? "transform 0.05s ease-out" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), background 0.5s ease",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      style={style}
      id={id}
    >
      {/* Interactive Background Radial Light Glow */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-0 rounded-[inherit]"
          style={{
            inset: 0,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Cybernetic Interactive Dynamic Border */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-30"
          style={{
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "transparent",
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(16, 185, 129, 0.45) 0%, rgba(20, 184, 166, 0.1) 40%, transparent 75%)`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
        />
      )}

      {/* Content wrapper with correct z-axis layers to stay interactive */}
      <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(8px)" }}>
        {children}
      </div>
    </div>
  );
}
