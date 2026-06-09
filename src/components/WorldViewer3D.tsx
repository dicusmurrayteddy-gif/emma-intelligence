import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Entity {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  mass: number;
  charge: number;
  domain: 'Newtonian' | 'EM' | 'Thermo' | 'Quantum' | 'Relativity' | 'Particle';
}

const COLORS: Record<Entity['domain'], string> = {
  Newtonian: '#4ade80',   // Green
  EM: '#f87171',          // Red
  Thermo: '#fb923c',      // Orange
  Quantum: '#c084fc',     // Purple
  Relativity: '#60a5fa',  // Blue
  Particle: '#f472b6',    // Pink
};

function PhysicsEntity({ entity, onUpdate }: { entity: Entity; onUpdate: (id: number, pos: [number, number, number], vel: [number, number, number]) => void }) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const [pos, setPos] = React.useState(entity.position);
  const [vel, setVel] = React.useState(entity.velocity);

  useFrame((state, delta) => {
    // Simple physics simulation (Euler integration)
    const newVel: [number, number, number] = [...vel];
    const newPos: [number, number, number] = [...pos];

    // Gravity (Newtonian base)
    newVel[1] -= 9.81 * entity.mass * 0.001 * delta;

    // Simple EM force (example)
    if (entity.domain === 'EM' || entity.domain === 'Particle') {
      newVel[0] += entity.charge * 0.5 * delta;
    }

    // Quantum jitter
    if (entity.domain === 'Quantum') {
      newVel[0] += (Math.random() - 0.5) * 0.3;
      newVel[1] += (Math.random() - 0.5) * 0.3;
      newVel[2] += (Math.random() - 0.5) * 0.3;
    }

    // Update position
    newPos[0] += newVel[0] * delta * 10;
    newPos[1] += newVel[1] * delta * 10;
    newPos[2] += newVel[2] * delta * 10;

    setPos(newPos);
    setVel(newVel);
    onUpdate(entity.id, newPos, newVel);

    if (meshRef.current) {
      meshRef.current.position.set(...newPos);
    }
  });

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[Math.max(0.3, entity.mass * 0.15)]} />
      <meshPhongMaterial 
        color={COLORS[entity.domain]} 
        emissive={COLORS[entity.domain]} 
        emissiveIntensity={0.2} 
      />
    </mesh>
  );
}

export default function WorldViewer3D() {
  const [entities, setEntities] = useState<Entity[]>([
    { id: 1, position: [0, 5, 0], velocity: [0, 0, 0], mass: 5, charge: 1, domain: 'Newtonian' },
    { id: 2, position: [-4, 3, 2], velocity: [1, 0, 0], mass: 2, charge: -2, domain: 'EM' },
    { id: 3, position: [3, 1, -3], velocity: [0, 0, 0], mass: 1.5, charge: 0, domain: 'Quantum' },
  ]);

  const [selectedDomain, setSelectedDomain] = useState<Entity['domain']>('Newtonian');

  const updateEntity = (id: number, newPos: [number, number, number], newVel: [number, number, number]) => {
    setEntities(prev => prev.map(e => 
      e.id === id ? { ...e, position: newPos, velocity: newVel } : e
    ));
  };

  const addEntity = () => {
    const newEntity: Entity = {
      id: Date.now(),
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 10
      ],
      velocity: [0, 0, 0],
      mass: Math.random() * 4 + 0.5,
      charge: (Math.random() - 0.5) * 4,
      domain: selectedDomain,
    };
    setEntities(prev => [...prev, newEntity]);
  };

  const removeEntity = (id: number) => {
    setEntities(prev => prev.filter(e => e.id !== id));
  };

  const resetSimulation = () => {
    setEntities([
      { id: 1, position: [0, 5, 0], velocity: [0, 0, 0], mass: 5, charge: 1, domain: 'Newtonian' },
      { id: 2, position: [-4, 3, 2], velocity: [1, 0, 0], mass: 2, charge: -2, domain: 'EM' },
      { id: 3, position: [3, 1, -3], velocity: [0, 0, 0], mass: 1.5, charge: 0, domain: 'Quantum' },
    ]);
  };

  return (
    <div className="h-[600px] w-full relative bg-black rounded-xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[-15, 5, -10]} intensity={0.6} color="#a5b4fc" />

        <Stars radius={300} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {entities.map(entity => (
          <PhysicsEntity 
            key={entity.id} 
            entity={entity} 
            onUpdate={updateEntity} 
          />
        ))}

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={50}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-xl text-white text-sm border border-white/20">
        <div className="font-semibold mb-3 flex items-center gap-2">
          🌌 Emma 3D World Viewer <span className="text-xs bg-white/10 px-2 py-0.5 rounded">v5.0 ASI</span>
        </div>

        <div className="space-y-2 mb-4">
          <div>Entities: <span className="font-mono">{entities.length}</span></div>
          <div>Physics Domains Active: <span className="font-mono text-emerald-400">All</span></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['Newtonian', 'EM', 'Thermo', 'Quantum', 'Relativity', 'Particle'] as const).map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedDomain === domain 
                ? 'bg-white text-black border-white' 
                : 'border-white/30 hover:bg-white/10'}`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={addEntity}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add Entity
          </button>
          <button 
            onClick={resetSimulation}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl text-xs border border-white/20">
        <div className="font-medium mb-1.5">Domain Colors</div>
        {Object.entries(COLORS).map(([domain, color]) => (
          <div key={domain} className="flex items-center gap-2 mb-0.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span>{domain}</span>
          </div>
        ))}
      </div>

      {/* Entity List */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl text-xs max-h-[280px] overflow-auto border border-white/20 w-52">
        <div className="font-medium mb-2">Active Entities</div>
        {entities.map(entity => (
          <div key={entity.id} className="flex justify-between items-center py-1 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[entity.domain] }}></div>
              <span className="font-mono text-[10px]">ID:{entity.id}</span>
            </div>
            <button 
              onClick={() => removeEntity(entity.id)}
              className="text-red-400 hover:text-red-500 text-[10px]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
