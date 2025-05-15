"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Html, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion-3d"
import { MotionConfig } from "framer-motion"
import { Vector3, Color } from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { CareerEntry } from "@/types/career"

interface ThreeDMapViewProps {
  careerData: CareerEntry[]
  activeIndex: number
  goToPosition: (index: number) => void
}

export function ThreeDMapView({ careerData, activeIndex, goToPosition }: ThreeDMapViewProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 10])
  const [viewMode, setViewMode] = useState<"path" | "skills" | "timeline">("path")
  const [showLabels, setShowLabels] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)

  // Handle camera movement to focus on active node
  useEffect(() => {
    if (activeIndex !== null) {
      const targetPosition: [number, number, number] =
        viewMode === "path"
          ? [activeIndex * 2 - (careerData.length - 1), 0, 10]
          : viewMode === "timeline"
            ? [0, 0, 10]
            : [0, 0, 15]

      setCameraPosition(targetPosition)
    }
  }, [activeIndex, careerData.length, viewMode])

  return (
    <div className="relative h-[600px] w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant={viewMode === "path" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("path")}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
        >
          Path View
        </Button>
        <Button
          variant={viewMode === "skills" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("skills")}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
        >
          Skills View
        </Button>
        <Button
          variant={viewMode === "timeline" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("timeline")}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
        >
          Timeline View
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLabels(!showLabels)}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
        >
          {showLabels ? "Hide Labels" : "Show Labels"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
        >
          {autoRotate ? "Stop Rotation" : "Auto Rotate"}
        </Button>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <fog attach="fog" args={["#0f172a", 0, 40]} />

        <MotionConfig transition={{ duration: 0.8, ease: "easeInOut" }}>
          <Scene
            careerData={careerData}
            activeIndex={activeIndex}
            goToPosition={goToPosition}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            viewMode={viewMode}
            showLabels={showLabels}
          />
        </MotionConfig>
      </Canvas>

      {/* Hovered Node Info */}
      {hoveredNode !== null && (
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg" style={{ color: careerData[hoveredNode].color }}>
                {careerData[hoveredNode].title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{careerData[hoveredNode].company}</p>
              <p className="text-xs text-slate-500 mt-1">{careerData[hoveredNode].period}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {careerData[hoveredNode].skills.slice(0, 5).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {careerData[hoveredNode].skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{careerData[hoveredNode].skills.length - 5}
                  </Badge>
                )}
              </div>

              <Button className="w-full mt-3" size="sm" onClick={() => goToPosition(hoveredNode)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface SceneProps {
  careerData: CareerEntry[]
  activeIndex: number
  goToPosition: (index: number) => void
  hoveredNode: number | null
  setHoveredNode: (index: number | null) => void
  viewMode: "path" | "skills" | "timeline"
  showLabels: boolean
}

function Scene({
  careerData,
  activeIndex,
  goToPosition,
  hoveredNode,
  setHoveredNode,
  viewMode,
  showLabels,
}: SceneProps) {
  const { size } = useThree()

  // Generate node positions based on view mode
  const nodePositions = careerData.map((career, index) => {
    if (viewMode === "path") {
      // Linear path
      return new Vector3(index * 2 - (careerData.length - 1), 0, 0)
    } else if (viewMode === "skills") {
      // Cluster by skills
      const angle = (index / careerData.length) * Math.PI * 2
      const radius = 5
      return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    } else {
      // Timeline - vertical arrangement
      const startYear = new Date(career.startDate).getFullYear()
      const endYear = career.endDate === "present" ? new Date().getFullYear() : new Date(career.endDate).getFullYear()

      // Find min and max years across all careers
      const allYears = careerData.flatMap((c) => {
        const start = new Date(c.startDate).getFullYear()
        const end = c.endDate === "present" ? new Date().getFullYear() : new Date(c.endDate).getFullYear()
        return [start, end]
      })

      const minYear = Math.min(...allYears)
      const maxYear = Math.max(...allYears)
      const yearRange = maxYear - minYear

      // Calculate position based on start year
      const x = ((startYear - minYear) / yearRange) * 10 - 5
      const y = index % 2 === 0 ? 1 : -1

      return new Vector3(x, y, 0)
    }
  })

  // Generate connections between nodes
  const connections = []

  // Career path connections
  for (let i = 0; i < careerData.length - 1; i++) {
    connections.push({
      start: nodePositions[i],
      end: nodePositions[i + 1],
      color: "#10b981", // emerald-500
      type: "path",
    })
  }

  // Skill connections (in skills view)
  if (viewMode === "skills") {
    for (let i = 0; i < careerData.length; i++) {
      for (let j = i + 1; j < careerData.length; j++) {
        const sourceSkills = new Set(careerData[i].skills)
        const targetSkills = new Set(careerData[j].skills)
        const commonSkills = [...sourceSkills].filter((skill) => targetSkills.has(skill))

        if (commonSkills.length > 0) {
          connections.push({
            start: nodePositions[i],
            end: nodePositions[j],
            color: "#8b5cf6", // violet-500
            type: "skill",
            strength: commonSkills.length,
          })
        }
      }
    }
  }

  return (
    <group>
      {/* Background Grid */}
      <GridPlane />

      {/* Career Path */}
      {viewMode === "path" && (
        <motion.mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[careerData.length * 2 + 2, 3]} />
          <meshStandardMaterial color="#1e293b" />

          {/* Path Line */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[careerData.length * 2, 0.1, 0.01]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </motion.mesh>
      )}

      {/* Timeline Base (for timeline view) */}
      {viewMode === "timeline" && (
        <motion.mesh position={[0, 0, -0.1]} rotation={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 4]} />
          <meshStandardMaterial color="#1e293b" opacity={0.7} transparent />

          {/* Timeline Line */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[10, 0.05, 0.01]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>

          {/* Year Markers */}
          {Array.from({ length: 6 }).map((_, i) => (
            <group key={i} position={[-5 + i * 2, 0, 0.02]}>
              <mesh>
                <boxGeometry args={[0.05, 0.2, 0.01]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
              {showLabels && (
                <Text position={[0, -0.5, 0]} fontSize={0.3} color="#94a3b8" anchorX="center" anchorY="middle">
                  {new Date().getFullYear() - 10 + i * 2}
                </Text>
              )}
            </group>
          ))}
        </motion.mesh>
      )}

      {/* Connections */}
      {connections.map((connection, index) => (
        <ConnectionLine
          key={`connection-${index}`}
          start={connection.start}
          end={connection.end}
          color={connection.color}
          type={connection.type}
          strength={connection.strength}
          active={
            hoveredNode !== null &&
            (careerData[hoveredNode] === careerData[index] || careerData[hoveredNode] === careerData[index])
          }
        />
      ))}

      {/* Nodes */}
      {careerData.map((career, index) => (
        <CareerNode
          key={index}
          index={index}
          position={nodePositions[index]}
          career={career}
          activeIndex={activeIndex === index}
          hovered={hoveredNode === index}
          setHoveredNode={setHoveredNode}
          goToPosition={goToPosition}
          viewMode={viewMode}
          showLabels={showLabels}
        />
      ))}
    </group>
  )
}

interface CareerNodeProps {
  index: number
  position: Vector3
  career: CareerEntry
  activeIndex: boolean
  hovered: boolean
  setHoveredNode: (index: number | null) => void
  goToPosition: (index: number) => void
  viewMode: "path" | "skills" | "timeline"
  showLabels: boolean
}

function CareerNode({
  index,
  position,
  career,
  activeIndex,
  hovered,
  setHoveredNode,
  goToPosition,
  viewMode,
  showLabels,
}: CareerNodeProps) {
  const color = career.color || "#ffffff"
  const title = career.title
  const company = career.company

  const [expand, setExpand] = useState(false)

  useEffect(() => {
    setExpand(activeIndex || hovered)
  }, [activeIndex, hovered])

  return (
    <motion.group
      position={[position.x, position.y, position.z]}
      whileHover={{ scale: 1.2 }}
      animate={{ scale: expand ? 1.2 : 1 }}
      transition={{ duration: 0.2 }}
      onPointerOver={() => setHoveredNode(index)}
      onPointerOut={() => setHoveredNode(null)}
    >
      <mesh onClick={() => goToPosition(index)} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {showLabels && (
        <Html position={[0, 0.8, 0]} center occlude>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="bg-white/80 dark:bg-slate-800/80 text-xs px-2 py-1 rounded-md shadow-md cursor-pointer">
                  {title}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-slate-800 text-xs px-3 py-2 rounded-md shadow-md">
                <p className="font-bold">{title}</p>
                <p>{company}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Html>
      )}
    </motion.group>
  )
}

interface ConnectionLineProps {
  start: Vector3
  end: Vector3
  color: string
  type: string
  strength?: number
  active: boolean
}

function ConnectionLine({ start, end, color, type, strength = 1, active }: ConnectionLineProps) {
  const [hovered, setHovered] = useState(false)
  const lineRef = useRef<THREE.Line>(null)

  useEffect(() => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.color = new Color(color)
      material.linewidth = active ? 2 : 1
    }
  }, [active, color])

  const points = [start, end]

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <Float32BufferAttribute
          attach="attributes-position"
          args={[points.flatMap((p) => [p.x, p.y, p.z])]}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={active ? 2 : 1} transparent opacity={0.5} />
    </line>
  )
}

function GridPlane() {
  return (
    <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  )
}

import type * as THREE from "three"
import { Float32BufferAttribute } from "three"
