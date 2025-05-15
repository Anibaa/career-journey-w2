"use client"

import { useState, useMemo } from "react"
import type { Career, CareerNode } from "@/types/career"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCcw, Info } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { Html, Environment, Sky } from "@react-three/drei"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ThreeDCareerMapProps {
  career: Career
  className?: string
}

export function ThreeDCareerMap({ career, className }: ThreeDCareerMapProps) {
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 15])
  const [timeOfDay, setTimeOfDay] = useState(0.3) // 0-1 range (dawn to dusk)
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const isMobile = useMobile()

  // Sort career nodes by date
  const sortedNodes = useMemo(() => {
    return [...career.nodes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [career.nodes])

  // Calculate node positions in 3D space
  const nodePositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {}

    // Timeline layout (nodes arranged in chronological order along a path)
    const startYear = new Date(sortedNodes[0]?.date || new Date()).getFullYear()
    const endYear = new Date(sortedNodes[sortedNodes.length - 1]?.date || new Date()).getFullYear()
    const yearRange = endYear - startYear + 1

    // Create a spiral path for the timeline
    sortedNodes.forEach((node, index) => {
      const nodeYear = new Date(node.date).getFullYear()
      const nodeMonth = new Date(node.date).getMonth()

      // Calculate position along timeline
      const yearProgress = nodeYear - startYear + nodeMonth / 12
      const angle = (yearProgress / yearRange) * Math.PI * 4 // 2 full rotations

      // Spiral layout
      const radius = 8 - (yearProgress / yearRange) * 3 // Decreasing radius
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = yearProgress / 2 // Gradually rising

      // Add some variation based on node type
      let yOffset = 0
      if (node.type === "education") yOffset = 0.5
      if (node.type === "achievement") yOffset = -0.5

      positions[node.id] = [x, y + yOffset, z]
    })

    return positions
  }, [sortedNodes])

  // Reset camera position
  const handleResetCamera = () => {
    setCameraPosition([0, 5, 15])
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* 3D Controls */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm" onClick={handleResetCamera}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setShowLabels(!showLabels)}
        >
          <span className="text-xs font-bold">Aa</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setShowConnections(!showConnections)}
        >
          <span className="text-xs font-bold">↔</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Time of Day Control */}
      <div className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm rounded-lg border p-2 w-40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium">Time of Day</span>
          <span className="text-xs">
            {timeOfDay < 0.25 ? "Dawn" : timeOfDay < 0.5 ? "Morning" : timeOfDay < 0.75 ? "Afternoon" : "Dusk"}
          </span>
        </div>
        <Slider value={[timeOfDay]} min={0} max={1} step={0.01} onValueChange={(value) => setTimeOfDay(value[0])} />
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: cameraPosition, fov: 60 }}>
        {/* Environment */}
        <Sky
          distance={450000}
          sunPosition={[Math.cos(timeOfDay * Math.PI * 2) * 10, Math.sin(timeOfDay * Math.PI * 2) * 10, 0]}
          inclination={timeOfDay}
          azimuth={0.25}
        />
        <Environment preset="park" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[Math.cos(timeOfDay * Math.PI * 2) * 10, Math.sin(timeOfDay * Math.PI * 2) * 10, 0]}
          intensity={1.5}
          castShadow
        />

        {/* Career Path */}
        {showConnections && <CareerPath nodes={sortedNodes} positions={nodePositions} />}

        {/* Career Nodes */}
        <CareerNodes
          nodes={sortedNodes}
          positions={nodePositions}
          onSelectNode={setSelectedNode}
          selectedNode={selectedNode}
          showLabels={showLabels}
        />

        {/* Info Panel */}
        {showInfo && (
          <Html position={[-10, 8, 0]} transform occlude>
            <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 w-64 shadow-lg">
              <h3 className="text-lg font-bold mb-2">Career Journey in 3D</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Explore your career journey in an immersive 3D space. Nodes are arranged chronologically in a spiral
                path rising upward.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Work Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Education</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Achievement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Project</span>
                </div>
              </div>
            </div>
          </Html>
        )}

        {/* Selected Node Info */}
        {selectedNode && (
          <Html position={[10, 8, 0]} transform occlude>
            <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 w-64 shadow-lg">
              <h3 className="text-lg font-bold mb-1">{selectedNode.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {new Date(selectedNode.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
                {selectedNode.endDate &&
                  ` - ${
                    selectedNode.endDate === "present"
                      ? "Present"
                      : new Date(selectedNode.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                  }`}
              </p>
              <div className="text-sm mb-2">{selectedNode.description}</div>
              {selectedNode.skills && selectedNode.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedNode.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  )
}

// Career Path Component (connections between nodes)
function CareerPath({
  nodes,
  positions,
}: {
  nodes: CareerNode[]
  positions: Record<string, [number, number, number]>
}) {
  return (
    <group>
      {nodes.map((node, index) => {
        if (index === 0) return null

        const prevNode = nodes[index - 1]
        const startPos = positions[prevNode.id]
        const endPos = positions[node.id]

        if (!startPos || !endPos) return null

        return (
          <line key={`${prevNode.id}-${node.id}`}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attachObject={["attributes", "position"]}
                count={2}
                array={new Float32Array([startPos[0], startPos[1], startPos[2], endPos[0], endPos[1], endPos[2]])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#888888" opacity={0.6} transparent linewidth={1.5} />
          </line>
        )
      })}
    </group>
  )
}

// Career Nodes Component (individual career events)
function CareerNodes({
  nodes,
  positions,
  onSelectNode,
  selectedNode,
  showLabels,
}: {
  nodes: CareerNode[]
  positions: Record<string, [number, number, number]>
  onSelectNode: (node: CareerNode | null) => void
  selectedNode: CareerNode | null
  showLabels: boolean
}) {
  // Get color based on node type
  const getNodeColor = (type: string) => {
    switch (type) {
      case "work":
        return "#3b82f6" // blue
      case "education":
        return "#22c55e" // green
      case "achievement":
        return "#f59e0b" // amber
      case "project":
        return "#a855f7" // purple
      default:
        return "#64748b" // slate
    }
  }

  return (
    <group>
      {nodes.map((node) => {
        const position = positions[node.id]
        if (!position) return null

        const isSelected = selectedNode?.id === node.id
        const color = getNodeColor(node.type)

        return (
          <group key={node.id} position={position}>
            {/* Node Sphere */}
            <mesh
              onClick={() => onSelectNode(node)}
              onPointerMissed={() => onSelectNode(null)}
              scale={isSelected ? 1.5 : 1}
            >
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected ? 0.5 : 0.2}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>

            {/* Node Label */}
            {showLabels && (
              <Html distanceFactor={10}>
                <div
                  className={cn(
                    "px-2 py-1 rounded whitespace-nowrap text-xs transform -translate-x-1/2",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-background/80 backdrop-blur-sm",
                  )}
                >
                  {node.title}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
