"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import {
  Briefcase,
  Code,
  Layout,
  Code2,
  Palette,
  ZoomIn,
  ZoomOut,
  Tag,
  Users,
  Link2,
  Target,
  Info,
  RefreshCw,
  ArrowUpRight,
  Clock,
  Layers,
  BarChart3,
  Lightbulb,
  Calendar,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Import the career data type
import type { CareerEntry } from "@/types/career"

interface PremiumNetworkMapProps {
  careerData: CareerEntry[]
  activeIndex: number
  goToPosition: (index: number) => void
}

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  career: CareerEntry
  fixed: boolean
  group?: string
}

interface Connection {
  source: number
  target: number
  type: "direct" | "skill" | "collaboration"
  strength: number
  skills?: string[]
  color?: string
}

interface LayoutPreset {
  name: string
  description: string
  icon: React.ReactNode
  config: {
    type: "force" | "timeline" | "cluster" | "radial" | "grid"
    physics: boolean
    physicsStrength: number
    showNodeLabels: boolean
    connectionTypes: string[]
  }
}

export function PremiumNetworkMap({ careerData, activeIndex, goToPosition }: PremiumNetworkMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [connectionTypes, setConnectionTypes] = useState<string[]>(["direct", "skill", "collaboration"])
  const [layoutType, setLayoutType] = useState<"force" | "timeline" | "cluster" | "radial" | "grid">("force")
  const [showNodeLabels, setShowNodeLabels] = useState(true)
  const [highlightMode, setHighlightMode] = useState<"none" | "skills" | "connections">("none")
  const [physicsEnabled, setPhysicsEnabled] = useState(true)
  const [physicsStrength, setPhysicsStrength] = useState(0.5)
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [showDetailPanel, setShowDetailPanel] = useState(true)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [animateNodes, setAnimateNodes] = useState(true)
  const [visualStyle, setVisualStyle] = useState<"standard" | "neon" | "minimal">("standard")
  const [groupBy, setGroupBy] = useState<"none" | "year" | "type" | "skill">("none")
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("network")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // Spring animations for smooth panning
  const springPanX = useSpring(0, { stiffness: 300, damping: 30 })
  const springPanY = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    springPanX.set(panOffset.x)
    springPanY.set(panOffset.y)
  }, [panOffset, springPanX, springPanY])

  // Layout presets
  const layoutPresets: LayoutPreset[] = [
    {
      name: "Career Path",
      description: "Chronological view of your career journey",
      icon: <Calendar className="h-4 w-4" />,
      config: {
        type: "timeline",
        physics: false,
        physicsStrength: 0.3,
        showNodeLabels: true,
        connectionTypes: ["direct"],
      },
    },
    {
      name: "Skill Network",
      description: "Connections based on shared skills",
      icon: <Target className="h-4 w-4" />,
      config: {
        type: "force",
        physics: true,
        physicsStrength: 0.7,
        showNodeLabels: true,
        connectionTypes: ["skill"],
      },
    },
    {
      name: "Collaboration Web",
      description: "Network of professional collaborations",
      icon: <Users className="h-4 w-4" />,
      config: {
        type: "force",
        physics: true,
        physicsStrength: 0.5,
        showNodeLabels: true,
        connectionTypes: ["collaboration"],
      },
    },
    {
      name: "Skill Clusters",
      description: "Group positions by primary skills",
      icon: <Layers className="h-4 w-4" />,
      config: {
        type: "cluster",
        physics: true,
        physicsStrength: 0.4,
        showNodeLabels: true,
        connectionTypes: ["skill"],
      },
    },
    {
      name: "Timeline Radial",
      description: "Chronological view in a circular layout",
      icon: <Clock className="h-4 w-4" />,
      config: {
        type: "radial",
        physics: false,
        physicsStrength: 0.3,
        showNodeLabels: true,
        connectionTypes: ["direct"],
      },
    },
  ]

  // Apply preset
  const applyPreset = (presetName: string) => {
    const preset = layoutPresets.find((p) => p.name === presetName)
    if (preset) {
      setLayoutType(preset.config.type)
      setPhysicsEnabled(preset.config.physics)
      setPhysicsStrength(preset.config.physicsStrength)
      setShowNodeLabels(preset.config.showNodeLabels)
      setConnectionTypes(preset.config.connectionTypes)
      setSelectedPreset(presetName)
    }
  }

  // Calculate all unique skills across career data
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>()
    careerData.forEach((career) => {
      career.skills.forEach((skill) => skillSet.add(skill))
    })
    return Array.from(skillSet).sort()
  }, [careerData])

  // Filter career data based on search and filters
  const filteredCareerData = useMemo(() => {
    return careerData.filter((career) => {
      // Search term filter
      if (
        searchTerm &&
        !career.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !career.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !career.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasSelectedSkill = career.skills.some((skill) => selectedSkills.includes(skill))
        if (!hasSelectedSkill) return false
      }

      return true
    })
  }, [careerData, searchTerm, selectedSkills])

  // Group nodes based on groupBy setting
  const getNodeGroup = (career: CareerEntry): string => {
    if (groupBy === "none") return "default"

    if (groupBy === "year") {
      return new Date(career.startDate).getFullYear().toString()
    }

    if (groupBy === "type") {
      if (career.title.toLowerCase().includes("developer") || career.title.toLowerCase().includes("engineer")) {
        return "Technical"
      } else if (career.title.toLowerCase().includes("manager") || career.title.toLowerCase().includes("lead")) {
        return "Management"
      } else if (career.title.toLowerCase().includes("designer")) {
        return "Design"
      } else {
        return "Other"
      }
    }

    if (groupBy === "skill") {
      // Find the most relevant skill
      const topSkills = ["JavaScript", "React", "Node.js", "Design", "Management"]
      for (const skill of topSkills) {
        if (career.skills.includes(skill)) {
          return skill
        }
      }
      return "Other"
    }

    return "default"
  }

  // Initialize nodes based on layout type
  useEffect(() => {
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2

    if (filteredCareerData.length === 0) {
      setNodes([])
      return
    }

    let initialNodes: Node[] = []

    if (layoutType === "timeline") {
      // Timeline layout - horizontal line
      const spacing = Math.min(containerSize.width / (filteredCareerData.length + 1), 150)
      initialNodes = filteredCareerData.map((career, index) => {
        const x = centerX - ((filteredCareerData.length - 1) * spacing) / 2 + index * spacing
        return {
          id: career.id,
          x,
          y: centerY,
          vx: 0,
          vy: 0,
          radius: career.id === careerData[activeIndex].id ? 40 : 30,
          color: career.color,
          career,
          fixed: true,
          group: getNodeGroup(career),
        }
      })
    } else if (layoutType === "cluster") {
      // Cluster layout - group by skills
      const skillClusters: Record<string, { x: number; y: number; count: number }> = {}

      // Create clusters for top skills
      const topSkills = allSkills
        .map((skill) => ({
          skill,
          count: filteredCareerData.filter((c) => c.skills.includes(skill)).length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((item) => item.skill)

      // Position clusters in a circle
      const clusterRadius = Math.min(centerX, centerY) * 0.6
      topSkills.forEach((skill, i) => {
        const angle = (i / topSkills.length) * Math.PI * 2
        skillClusters[skill] = {
          x: centerX + clusterRadius * Math.cos(angle),
          y: centerY + clusterRadius * Math.sin(angle),
          count: 0,
        }
      })

      // Position nodes based on their primary skill cluster
      initialNodes = filteredCareerData.map((career) => {
        // Find the most relevant cluster for this career
        let bestCluster = topSkills[0]
        for (const skill of topSkills) {
          if (career.skills.includes(skill)) {
            bestCluster = skill
            break
          }
        }

        const cluster = skillClusters[bestCluster]
        const count = cluster.count++
        const angle = (count / 3) * Math.PI * 2
        const nodeRadius = 80

        return {
          id: career.id,
          x: cluster.x + nodeRadius * Math.cos(angle),
          y: cluster.y + nodeRadius * Math.sin(angle),
          vx: 0,
          vy: 0,
          radius: career.id === careerData[activeIndex].id ? 40 : 30,
          color: career.color,
          career,
          fixed: false,
          group: getNodeGroup(career),
        }
      })
    } else if (layoutType === "radial") {
      // Radial layout - nodes in concentric circles by time period
      const years = filteredCareerData
        .map((career) => {
          const startYear = new Date(career.startDate).getFullYear()
          return { id: career.id, year: startYear }
        })
        .sort((a, b) => a.year - b.year)

      const uniqueYears = Array.from(new Set(years.map((y) => y.year)))
      const yearMap = new Map(uniqueYears.map((year, i) => [year, i]))

      initialNodes = filteredCareerData.map((career) => {
        const startYear = new Date(career.startDate).getFullYear()
        const ringIndex = yearMap.get(startYear) || 0
        const totalRings = uniqueYears.length

        // Calculate position in the ring
        const radius = 50 + ringIndex * 80
        const nodesInRing = years.filter((y) => y.year === startYear).length
        const nodeIndex = years.findIndex((y) => y.id === career.id && y.year === startYear)
        const angleOffset = nodeIndex / nodesInRing
        const angle = angleOffset * Math.PI * 2 + (ringIndex * Math.PI) / 4

        return {
          id: career.id,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
          radius: career.id === careerData[activeIndex].id ? 40 : 30,
          color: career.color,
          career,
          fixed: true,
          group: getNodeGroup(career),
        }
      })
    } else if (layoutType === "grid") {
      // Grid layout - organized by groups
      const groups = filteredCareerData.reduce(
        (acc, career) => {
          const group = getNodeGroup(career)
          if (!acc[group]) acc[group] = []
          acc[group].push(career)
          return acc
        },
        {} as Record<string, CareerEntry[]>,
      )

      const groupKeys = Object.keys(groups)
      const groupSpacing = containerSize.width / (groupKeys.length + 1)

      const nodeIndex = 0
      initialNodes = filteredCareerData.map((career) => {
        const group = getNodeGroup(career)
        const groupIndex = groupKeys.indexOf(group)
        const groupX = (groupIndex + 1) * groupSpacing

        const itemsInGroup = groups[group].length
        const rowCount = Math.ceil(Math.sqrt(itemsInGroup))
        const colCount = Math.ceil(itemsInGroup / rowCount)

        const itemIndex = groups[group].indexOf(career)
        const row = Math.floor(itemIndex / colCount)
        const col = itemIndex % colCount

        const itemSpacing = 80
        const groupWidth = colCount * itemSpacing
        const groupHeight = rowCount * itemSpacing

        const x = groupX - groupWidth / 2 + col * itemSpacing
        const y = centerY - groupHeight / 2 + row * itemSpacing

        return {
          id: career.id,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: career.id === careerData[activeIndex].id ? 40 : 30,
          color: career.color,
          career,
          fixed: true,
          group,
        }
      })
    } else {
      // Force-directed layout - circle
      const radius = Math.min(centerX, centerY) * 0.6
      initialNodes = filteredCareerData.map((career, index) => {
        const angle = (index / filteredCareerData.length) * Math.PI * 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return {
          id: career.id,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: career.id === careerData[activeIndex].id ? 40 : 30,
          color: career.color,
          career,
          fixed: false,
          group: getNodeGroup(career),
        }
      })
    }

    setNodes(initialNodes)
  }, [filteredCareerData, containerSize, layoutType, activeIndex, allSkills, careerData, groupBy])

  // Calculate connections between nodes
  useEffect(() => {
    const result: Connection[] = []
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))

    // Direct career progression connections
    if (connectionTypes.includes("direct")) {
      for (let i = 0; i < careerData.length - 1; i++) {
        const sourceNode = nodeMap.get(careerData[i].id)
        const targetNode = nodeMap.get(careerData[i + 1].id)

        if (sourceNode && targetNode) {
          result.push({
            source: sourceNode.id,
            target: targetNode.id,
            type: "direct",
            strength: 3,
            color: "#10b981", // emerald-500
          })
        }
      }
    }

    // Skill-based connections
    if (connectionTypes.includes("skill")) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const sourceSkills = new Set(nodes[i].career.skills)
          const targetSkills = new Set(nodes[j].career.skills)
          const commonSkills = [...sourceSkills].filter((skill) => targetSkills.has(skill))

          if (commonSkills.length > 0) {
            result.push({
              source: nodes[i].id,
              target: nodes[j].id,
              type: "skill",
              strength: commonSkills.length,
              skills: commonSkills,
              color: "#8b5cf6", // violet-500
            })
          }
        }
      }
    }

    // Collaboration connections
    if (connectionTypes.includes("collaboration")) {
      for (let i = 0; i < nodes.length; i++) {
        const sourceCollaborators = nodes[i].career.collaborators?.map((c) => c.name.toLowerCase()) || []

        if (sourceCollaborators.length === 0) continue

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue

          const targetCollaborators = nodes[j].career.collaborators?.map((c) => c.name.toLowerCase()) || []

          if (targetCollaborators.length === 0) continue

          const commonCollaborators = sourceCollaborators.filter((name) => targetCollaborators.includes(name))

          if (commonCollaborators.length > 0) {
            result.push({
              source: nodes[i].id,
              target: nodes[j].id,
              type: "collaboration",
              strength: commonCollaborators.length,
              color: "#ec4899", // pink-500
            })
          }
        }
      }
    }

    setConnections(result)
  }, [nodes, connectionTypes, careerData])

  // Physics simulation
  useEffect(() => {
    if (!physicsEnabled || layoutType === "timeline" || layoutType === "radial" || layoutType === "grid") return

    const simulatePhysics = () => {
      setNodes((prevNodes) => {
        // Skip if no nodes
        if (prevNodes.length === 0) return prevNodes

        // Create a copy of nodes to update
        const newNodes = [...prevNodes]

        // Apply forces
        for (let i = 0; i < newNodes.length; i++) {
          if (newNodes[i].fixed) continue

          // Repulsion between nodes
          for (let j = 0; j < newNodes.length; j++) {
            if (i === j) continue

            const dx = newNodes[i].x - newNodes[j].x
            const dy = newNodes[i].y - newNodes[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = newNodes[i].radius + newNodes[j].radius + 20

            if (distance < minDistance) {
              const force = (physicsStrength * 0.05 * (minDistance - distance)) / distance
              newNodes[i].vx += dx * force
              newNodes[i].vy += dy * force
            }
          }

          // Attraction for connections
          for (const conn of connections) {
            if (conn.source === newNodes[i].id || conn.target === newNodes[i].id) {
              const otherNodeId = conn.source === newNodes[i].id ? conn.target : conn.source
              const otherNode = newNodes.find((n) => n.id === otherNodeId)

              if (otherNode) {
                const dx = otherNode.x - newNodes[i].x
                const dy = otherNode.y - newNodes[i].y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const targetDistance = 150

                const force = (physicsStrength * 0.01 * (distance - targetDistance)) / distance
                newNodes[i].vx += dx * force
                newNodes[i].vy += dy * force
              }
            }
          }

          // Group attraction (nodes in the same group attract each other)
          if (groupBy !== "none") {
            const currentGroup = newNodes[i].group
            for (let j = 0; j < newNodes.length; j++) {
              if (i === j) continue

              if (newNodes[j].group === currentGroup) {
                const dx = newNodes[j].x - newNodes[i].x
                const dy = newNodes[j].y - newNodes[i].y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 50) {
                  const force = physicsStrength * 0.002 * distance
                  newNodes[i].vx += dx * force
                  newNodes[i].vy += dy * force
                }
              }
            }
          }

          // Center gravity
          const centerX = containerSize.width / 2
          const centerY = containerSize.height / 2
          const dx = centerX - newNodes[i].x
          const dy = centerY - newNodes[i].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 200) {
            const force = physicsStrength * 0.001 * distance
            newNodes[i].vx += dx * force
            newNodes[i].vy += dy * force
          }

          // Apply velocity with damping
          newNodes[i].x += newNodes[i].vx
          newNodes[i].y += newNodes[i].vy
          newNodes[i].vx *= 0.9
          newNodes[i].vy *= 0.9

          // Boundary constraints
          const padding = 50
          if (newNodes[i].x < padding) {
            newNodes[i].x = padding
            newNodes[i].vx = -newNodes[i].vx * 0.5
          }
          if (newNodes[i].x > containerSize.width - padding) {
            newNodes[i].x = containerSize.width - padding
            newNodes[i].vx = -newNodes[i].vx * 0.5
          }
          if (newNodes[i].y < padding) {
            newNodes[i].y = padding
            newNodes[i].vy = -newNodes[i].vy * 0.5
          }
          if (newNodes[i].y > containerSize.height - padding) {
            newNodes[i].y = containerSize.height - padding
            newNodes[i].vy = -newNodes[i].vy * 0.5
          }
        }

        return newNodes
      })

      animationRef.current = requestAnimationFrame(simulatePhysics)
    }

    animationRef.current = requestAnimationFrame(simulatePhysics)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [physicsEnabled, physicsStrength, connections, containerSize, layoutType, groupBy])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Toggle animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateNodes(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.1, 2))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))
  }

  // Reset view
  const resetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  // Toggle connection type
  const toggleConnectionType = (type: string) => {
    setConnectionTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedSkills([])
    setConnectionTypes(["direct", "skill", "collaboration"])
    setHighlightMode("none")
    setGroupBy("none")
    setSelectedPreset(null)
  }

  // Get node icon based on career icon string
  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="w-6 h-6" />
      case "Code":
        return <Code className="w-6 h-6" />
      case "Layout":
        return <Layout className="w-6 h-6" />
      case "Code2":
        return <Code2 className="w-6 h-6" />
      case "Palette":
        return <Palette className="w-6 h-6" />
      default:
        return <Briefcase className="w-6 h-6" />
    }
  }

  // Check if a node should be highlighted based on current mode
  const isNodeHighlighted = (nodeId: number) => {
    if (highlightMode === "none") return false
    if (selectedNode === null) return false

    if (highlightMode === "connections") {
      return connections.some(
        (conn) =>
          (conn.source === nodeId && conn.target === selectedNode) ||
          (conn.source === selectedNode && conn.target === nodeId),
      )
    }

    if (highlightMode === "skills") {
      const selectedNodeData = nodes.find((n) => n.id === selectedNode)
      const currentNodeData = nodes.find((n) => n.id === nodeId)

      if (!selectedNodeData || !currentNodeData) return false

      const selectedSkills = new Set(selectedNodeData.career.skills)
      return currentNodeData.career.skills.some((skill) => selectedSkills.has(skill))
    }

    return false
  }

  // Find node by ID
  const findNodeById = (id: number) => {
    return nodes.find((node) => node.id === id)
  }

  // Get connection style based on visual style
  const getConnectionStyle = (connection: Connection, isActive: boolean, isHovered: boolean) => {
    const baseColor = connection.color || "#cbd5e1"
    const width = isActive || isHovered ? 3 : 1 + connection.strength * 0.5
    const opacity = isActive || isHovered ? 1 : 0.6

    if (visualStyle === "neon") {
      return {
        stroke: isActive || isHovered ? baseColor : `${baseColor}80`,
        strokeWidth: width,
        filter: isActive || isHovered ? `drop-shadow(0 0 3px ${baseColor})` : "none",
        opacity,
      }
    } else if (visualStyle === "minimal") {
      return {
        stroke: "#94a3b8",
        strokeWidth: isActive || isHovered ? 2 : 1,
        opacity: isActive || isHovered ? 0.8 : 0.3,
      }
    } else {
      return {
        stroke: isActive || isHovered ? baseColor : "#cbd5e1",
        strokeWidth: width,
        opacity,
      }
    }
  }

  // Get node style based on visual style
  const getNodeStyle = (
    node: Node,
    isActive: boolean,
    isHovered: boolean,
    isSelected: boolean,
    isHighlighted: boolean,
  ) => {
    if (visualStyle === "neon") {
      return {
        fill: isActive || isSelected ? node.color : isHovered || isHighlighted ? `${node.color}90` : `${node.color}40`,
        stroke: "white",
        strokeWidth: 2,
        filter:
          isActive || isSelected
            ? `drop-shadow(0 0 5px ${node.color})`
            : isHovered || isHighlighted
              ? `drop-shadow(0 0 3px ${node.color})`
              : "none",
      }
    } else if (visualStyle === "minimal") {
      return {
        fill: isActive || isSelected ? "#1e293b" : isHovered || isHighlighted ? "#475569" : "#94a3b8",
        stroke: "white",
        strokeWidth: 1,
      }
    } else {
      return {
        fill: isActive || isSelected ? node.color : isHovered || isHighlighted ? `${node.color}90` : `${node.color}40`,
        stroke: isActive || isSelected || isHovered || isHighlighted ? "white" : "transparent",
        strokeWidth: 2,
      }
    }
  }

  // Render network view
  const renderNetworkView = () => {
    return (
      <div
        className="relative h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Background Grid */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Network Visualization */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: springPanX,
            y: springPanY,
            scale: zoomLevel,
          }}
        >
          <svg width={containerSize.width} height={containerSize.height} className="absolute inset-0">
            {/* Group Labels (if grouping is enabled) */}
            {groupBy !== "none" && (
              <g className="group-labels">
                {nodes.reduce((groups, node) => {
                  if (!node.group || groups.has(node.group)) return groups

                  // Calculate group center
                  const groupNodes = nodes.filter((n) => n.group === node.group)
                  const avgX = groupNodes.reduce((sum, n) => sum + n.x, 0) / groupNodes.length
                  const avgY = groupNodes.reduce((sum, n) => sum + n.y, 0) / groupNodes.length

                  groups.add(node.group)

                  return groups.add(
                    <g key={`group-${node.group}`} transform={`translate(${avgX}, ${avgY - 60})`}>
                      <rect
                        x={-50}
                        y={-15}
                        width={100}
                        height={30}
                        rx={15}
                        fill="rgba(255, 255, 255, 0.8)"
                        stroke="#e2e8f0"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={14}
                        fontWeight="bold"
                        fill="#1e293b"
                      >
                        {node.group}
                      </text>
                    </g>,
                  )
                }, new Set<React.ReactNode>())}
              </g>
            )}

            {/* Connection Lines */}
            <g>
              {connections.map((connection, index) => {
                const sourceNode = findNodeById(connection.source)
                const targetNode = findNodeById(connection.target)

                if (!sourceNode || !targetNode) return null

                const isActive =
                  connection.source === selectedNode ||
                  connection.target === selectedNode ||
                  connection.source === careerData[activeIndex].id ||
                  connection.target === careerData[activeIndex].id

                const isHovered = connection.source === hoveredNode || connection.target === hoveredNode

                // Calculate control points for curved lines
                const midX = (sourceNode.x + targetNode.x) / 2
                const midY = (sourceNode.y + targetNode.y) / 2
                const dx = targetNode.x - sourceNode.x
                const dy = targetNode.y - sourceNode.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                // Perpendicular offset for curve
                const offsetX = -dy * 0.2
                const offsetY = dx * 0.2

                // Different curve for different connection types
                const curve =
                  connection.type === "direct"
                    ? `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`
                    : connection.type === "collaboration"
                      ? `M ${sourceNode.x} ${sourceNode.y} Q ${midX} ${midY + 50} ${targetNode.x} ${targetNode.y}`
                      : `M ${sourceNode.x} ${sourceNode.y} Q ${midX + offsetX} ${midY + offsetY} ${targetNode.x} ${targetNode.y}`

                const style = getConnectionStyle(connection, isActive, isHovered)

                return (
                  <g key={`connection-${index}`}>
                    <path
                      d={curve}
                      strokeDasharray={
                        connection.type === "direct" ? "0" : connection.type === "collaboration" ? "5,10" : "5,5"
                      }
                      fill="none"
                      className="transition-all duration-300"
                      style={style}
                    />

                    {/* Show skills on skill connections when hovered */}
                    {(isHovered || isActive) && connection.type === "skill" && connection.skills && (
                      <g>
                        <circle
                          cx={midX + offsetX}
                          cy={midY + offsetY}
                          r={20}
                          fill="white"
                          stroke="#cbd5e1"
                          strokeWidth="1"
                          className="shadow-md"
                        />
                        <text
                          x={midX + offsetX}
                          y={midY + offsetY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="10"
                          fill="#64748b"
                        >
                          {connection.skills.length}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </g>

            {/* Career Nodes */}
            <g>
              {nodes.map((node) => {
                const isActive = node.id === careerData[activeIndex].id
                const isHovered = node.id === hoveredNode
                const isSelected = node.id === selectedNode
                const isHighlighted = isNodeHighlighted(node.id)

                const nodeStyle = getNodeStyle(node, isActive, isHovered, isSelected, isHighlighted)

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      if (selectedNode === node.id) {
                        setSelectedNode(null)
                      } else {
                        setSelectedNode(node.id)
                        goToPosition(careerData.findIndex((c) => c.id === node.id))
                      }
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: "pointer" }}
                    className="transition-transform duration-300"
                  >
                    {/* Node highlight effect */}
                    <motion.circle
                      r={isActive || isSelected ? 50 : isHovered || isHighlighted ? 40 : 0}
                      fill={`${node.color}20`}
                      initial={{ scale: 0 }}
                      animate={{ scale: isActive || isSelected || isHovered || isHighlighted ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Pulsing effect for active node */}
                    {(isActive || isSelected) && visualStyle !== "minimal" && (
                      <motion.circle
                        r={node.radius * 1.5}
                        fill="transparent"
                        stroke={node.color}
                        strokeWidth="1"
                        initial={{ opacity: 0.7, scale: 1 }}
                        animate={{
                          opacity: [0.7, 0],
                          scale: [1, 1.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                    )}

                    {/* Node circle */}
                    <motion.circle
                      r={node.radius}
                      initial={{ scale: animateNodes ? 0 : 1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      style={nodeStyle}
                    />

                    {/* 3D Effect for Node */}
                    {visualStyle === "standard" && (
                      <>
                        <circle r={node.radius} fill="url(#nodeGradient)" opacity={0.7} pointerEvents="none" />
                        <defs>
                          <radialGradient id="nodeGradient">
                            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </>
                    )}

                    {/* Node icon */}
                    <foreignObject x={-15} y={-15} width={30} height={30} className="pointer-events-none">
                      <div className="flex items-center justify-center w-full h-full text-white">
                        {getNodeIcon(node.career.icon)}
                      </div>
                    </foreignObject>

                    {/* Node label */}
                    {showNodeLabels && (
                      <g>
                        <motion.text
                          y={node.radius + 20}
                          textAnchor="middle"
                          fill={visualStyle === "minimal" ? "#1e293b" : "#1e293b"}
                          className="font-medium transition-all duration-300"
                          style={{ fontSize: isActive || isSelected ? "16px" : "14px" }}
                          initial={{ opacity: 0, y: node.radius + 10 }}
                          animate={{ opacity: 1, y: node.radius + 20 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {node.career.title}
                        </motion.text>

                        <motion.text
                          y={node.radius + 40}
                          textAnchor="middle"
                          fill="#64748b"
                          className="transition-all duration-300"
                          style={{ fontSize: isActive || isSelected ? "14px" : "12px" }}
                          initial={{ opacity: 0, y: node.radius + 30 }}
                          animate={{ opacity: 1, y: node.radius + 40 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          {node.career.company}
                        </motion.text>
                      </g>
                    )}

                    {/* Skills display for active/selected node */}
                    {(isActive || isSelected) && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        {node.career.skills.slice(0, 3).map((skill, skillIndex) => (
                          <motion.g
                            key={skill}
                            transform={`translate(0, ${node.radius + 70 + skillIndex * 20})`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + skillIndex * 0.1 }}
                          >
                            <rect
                              x={-50}
                              y={-10}
                              width={100}
                              height={20}
                              rx={10}
                              fill={visualStyle === "neon" ? `${node.color}30` : `${node.color}20`}
                              style={visualStyle === "neon" ? { filter: `drop-shadow(0 0 2px ${node.color})` } : {}}
                            />
                            <text textAnchor="middle" fill="#1e293b" fontSize="10" dominantBaseline="middle">
                              {skill}
                            </text>
                          </motion.g>
                        ))}
                        {node.career.skills.length > 3 && (
                          <motion.text
                            y={node.radius + 70 + 3 * 20}
                            textAnchor="middle"
                            fill="#64748b"
                            fontSize="10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                          >
                            +{node.career.skills.length - 3} more
                          </motion.text>
                        )}
                      </motion.g>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </motion.div>

        {/* Selected Node Detail Panel */}
        <AnimatePresence>
          {selectedNode !== null && showDetailPanel && (
            <motion.div
              className="absolute bottom-4 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {nodes.map((node) => {
                if (node.id !== selectedNode) return null

                return (
                  <Card key={node.id} className="border-0 shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: node.color }}>
                            {node.career.title}
                          </h3>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{node.career.company}</div>
                        </div>
                        <Badge variant="outline">{node.career.period}</Badge>
                      </div>

                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="overview" className="text-xs">
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="connections" className="text-xs">
                            Connections
                          </TabsTrigger>
                          <TabsTrigger value="skills" className="text-xs">
                            Skills
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-3 space-y-4 text-sm">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-slate-400 mt-0.5" />
                            <p className="text-slate-600 dark:text-slate-300 line-clamp-3">{node.career.description}</p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-slate-400 mt-0.5" />
                            <div>
                              <div className="font-medium mb-1">Key Missions</div>
                              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                {node.career.missions.slice(0, 2).map((mission, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 mr-1.5" />
                                    <span className="line-clamp-1">{mission}</span>
                                  </li>
                                ))}
                                {node.career.missions.length > 2 && (
                                  <li className="text-xs text-slate-500">+{node.career.missions.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {node.career.collaborators && (
                            <div className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-slate-400 mt-0.5" />
                              <div>
                                <div className="font-medium mb-1">Collaborators</div>
                                <div className="flex -space-x-2 overflow-hidden">
                                  {node.career.collaborators.map((collaborator, i) => (
                                    <Tooltip key={i}>
                                      <TooltipTrigger asChild>
                                        <div className="relative w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-700">
                                          {collaborator.avatar && (
                                            <Image
                                              src={collaborator.avatar || "/placeholder.svg"}
                                              alt={collaborator.name}
                                              fill
                                              className="object-cover"
                                            />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom" className="text-xs">
                                        <p className="font-medium">{collaborator.name}</p>
                                        <p className="text-slate-500">{collaborator.role}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {node.career.keyMetrics && (
                            <div className="flex items-start gap-2">
                              <BarChart3 className="h-4 w-4 text-slate-400 mt-0.5" />
                              <div>
                                <div className="font-medium mb-1">Key Metrics</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {node.career.keyMetrics.map((metric, i) => (
                                    <div key={i} className="bg-slate-100 dark:bg-slate-900 p-2 rounded text-center">
                                      <div className="text-lg font-bold" style={{ color: node.color }}>
                                        {metric.value}
                                      </div>
                                      <div className="text-xs text-slate-500">{metric.label}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="connections" className="mt-3 space-y-4 text-sm">
                          <div className="flex items-start gap-2">
                            <Link2 className="h-4 w-4 text-slate-400 mt-0.5" />
                            <div className="w-full">
                              <div className="font-medium mb-1">Network Connections</div>
                              <div className="space-y-1">
                                {connections
                                  .filter((conn) => conn.source === node.id || conn.target === node.id)
                                  .map((conn, i) => {
                                    const connectedNodeId = conn.source === node.id ? conn.target : conn.source
                                    const connectedNode = findNodeById(connectedNodeId)
                                    if (!connectedNode) return null

                                    return (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between text-xs p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                        onClick={() => {
                                          setSelectedNode(connectedNodeId)
                                          goToPosition(careerData.findIndex((c) => c.id === connectedNodeId))
                                        }}
                                      >
                                        <div className="flex items-center">
                                          <div
                                            className="w-2 h-2 rounded-full mr-1.5"
                                            style={{ backgroundColor: connectedNode.color }}
                                          />
                                          <span>{connectedNode.career.title}</span>
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-4 px-1"
                                          style={{
                                            color: conn.color,
                                            borderColor: `${conn.color}50`,
                                          }}
                                        >
                                          {conn.type === "direct"
                                            ? "Path"
                                            : conn.type === "collaboration"
                                              ? "Team"
                                              : `${conn.skills?.length || 0} Skills`}
                                        </Badge>
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                            <div className="w-full">
                              <div className="font-medium mb-1">Timeline Events</div>
                              <div className="space-y-1">
                                {node.career.detailedEvents.slice(0, 3).map((event, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" />
                                    <div>
                                      <div className="text-xs font-medium">{event.title}</div>
                                      <div className="text-[10px] text-slate-500">{event.date}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="mt-3 space-y-4 text-sm">
                          <div className="flex items-start gap-2">
                            <Tag className="h-4 w-4 text-slate-400 mt-0.5" />
                            <div className="w-full">
                              <div className="font-medium mb-1">Skills & Technologies</div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {node.career.skills.map((skill, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs cursor-pointer"
                                    onClick={() => {
                                      if (highlightMode === "skills") {
                                        toggleSkill(skill)
                                      }
                                    }}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-slate-400 mt-0.5" />
                            <div className="w-full">
                              <div className="font-medium mb-1">Skill Analysis</div>
                              <div className="space-y-2 mt-2">
                                <div className="flex justify-between text-xs">
                                  <span>Technical Skills</span>
                                  <span className="font-medium">
                                    {
                                      node.career.skills.filter((s) =>
                                        [
                                          "React",
                                          "Node.js",
                                          "JavaScript",
                                          "TypeScript",
                                          "Python",
                                          "AWS",
                                          "Docker",
                                        ].includes(s),
                                      ).length
                                    }{" "}
                                    skills
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                  <div
                                    className="bg-emerald-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (node.career.skills.filter((s) =>
                                          [
                                            "React",
                                            "Node.js",
                                            "JavaScript",
                                            "TypeScript",
                                            "Python",
                                            "AWS",
                                            "Docker",
                                          ].includes(s),
                                        ).length /
                                          7) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>

                                <div className="flex justify-between text-xs mt-2">
                                  <span>Soft Skills</span>
                                  <span className="font-medium">
                                    {
                                      node.career.skills.filter((s) =>
                                        ["Team Building", "Mentorship", "Knowledge Sharing", "Leadership"].includes(s),
                                      ).length
                                    }{" "}
                                    skills
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (node.career.skills.filter((s) =>
                                          ["Team Building", "Mentorship", "Knowledge Sharing", "Leadership"].includes(
                                            s,
                                          ),
                                        ).length /
                                          4) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)}>
                          Close
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => goToPosition(careerData.findIndex((c) => c.id === node.id))}
                          className="gap-1"
                        >
                          View Details
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Map */}
        {showMiniMap && (
          <div className="absolute top-4 left-4 w-40 h-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Viewport indicator */}
              <rect
                x={-panOffset.x / zoomLevel}
                y={-panOffset.y / zoomLevel}
                width={containerSize.width / zoomLevel}
                height={containerSize.height / zoomLevel}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Group backgrounds (if grouping is enabled) */}
              {groupBy !== "none" && (
                <g>
                  {nodes.reduce((groups, node) => {
                    if (!node.group || groups.has(node.group)) return groups

                    // Calculate group bounds
                    const groupNodes = nodes.filter((n) => n.group === node.group)
                    const minX = Math.min(...groupNodes.map((n) => n.x)) - 50
                    const minY = Math.min(...groupNodes.map((n) => n.y)) - 50
                    const maxX = Math.max(...groupNodes.map((n) => n.x)) + 50
                    const maxY = Math.max(...groupNodes.map((n) => n.y)) + 50

                    groups.add(node.group)

                    return groups.add(
                      <rect
                        key={`group-bg-${node.group}`}
                        x={minX}
                        y={minY}
                        width={maxX - minX}
                        height={maxY - minY}
                        rx={20}
                        fill="rgba(148, 163, 184, 0.1)"
                        stroke="rgba(148, 163, 184, 0.2)"
                      />,
                    )
                  }, new Set<React.ReactNode>())}
                </g>
              )}

              {/* Simplified connections */}
              {connections.map((connection, index) => {
                const sourceNode = findNodeById(connection.source)
                const targetNode = findNodeById(connection.target)

                if (!sourceNode || !targetNode) return null

                return (
                  <line
                    key={`minimap-connection-${index}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={connection.color || "#94a3b8"}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                )
              })}

              {/* Simplified nodes */}
              {nodes.map((node) => (
                <circle
                  key={`minimap-node-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={3}
                  fill={node.color}
                  opacity={node.id === careerData[activeIndex].id ? 1 : 0.5}
                />
              ))}
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Network Map</h2>
            <Badge variant="secondary">{filteredCareerData.length} positions</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={resetView}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowMiniMap((prev) => !prev)}>
              {showMiniMap ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDetailPanel((prev) => !prev)}>
              {showDetailPanel ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded((prev) => !prev)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full">
          {/* Sidebar (Filters & Settings) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.aside
                className="w-80 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col"
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Tabs defaultValue="network" className="flex flex-col h-full">
                  <TabsList className="flex-none">
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                  </TabsList>
                  <TabsContent value="network" className="flex-1 overflow-auto mt-4">
                    <div className="space-y-4">
                      {/* Search */}
                      <div>
                        <Label htmlFor="search">Search</Label>
                        <Input
                          type="text"
                          id="search"
                          placeholder="Search by title, company..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Skills Filter */}
                      <div>
                        <Label>Skills Filter</Label>
                        <ScrollArea className="h-32 rounded-md border p-2">
                          <div className="flex flex-col space-y-1">
                            {allSkills.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill-${skill}`}
                                  checked={selectedSkills.includes(skill)}
                                  onCheckedChange={() => toggleSkill(skill)}
                                />
                                <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Connection Types */}
                      <div>
                        <Label>Connection Types</Label>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="direct"
                              checked={connectionTypes.includes("direct")}
                              onCheckedChange={() => toggleConnectionType("direct")}
                            />
                            <Label htmlFor="direct">Direct Path</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="skill"
                              checked={connectionTypes.includes("skill")}
                              onCheckedChange={() => toggleConnectionType("skill")}
                            />
                            <Label htmlFor="skill">Shared Skills</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="collaboration"
                              checked={connectionTypes.includes("collaboration")}
                              onCheckedChange={() => toggleConnectionType("collaboration")}
                            />
                            <Label htmlFor="collaboration">Collaborations</Label>
                          </div>
                        </div>
                      </div>

                      {/* Highlight Mode */}
                      <div>
                        <Label>Highlight Mode</Label>
                        <Select value={highlightMode} onValueChange={(value) => setHighlightMode(value as any)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="connections">Connections</SelectItem>
                            <SelectItem value="skills">Skills</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Group By */}
                      <div>
                        <Label>Group By</Label>
                        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                            <SelectItem value="type">Type</SelectItem>
                            <SelectItem value="skill">Skill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reset Filters */}
                      <Button variant="secondary" onClick={resetFilters} className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="visual" className="flex-1 overflow-auto mt-4">
                    <div className="space-y-4">
                      {/* Visual Style */}
                      <div>
                        <Label>Visual Style</Label>
                        <Select value={visualStyle} onValueChange={(value) => setVisualStyle(value as any)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Standard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="neon">Neon</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="flex-1 overflow-auto mt-4">
                    <div className="space-y-4">
                      {/* Layout Presets */}
                      <div>
                        <Label>Layout Presets</Label>
                        <ScrollArea className="h-48 rounded-md border p-2">
                          <div className="flex flex-col space-y-2">
                            {layoutPresets.map((preset) => (
                              <Button
                                key={preset.name}
                                variant={selectedPreset === preset.name ? "default" : "outline"}
                                className="justify-start gap-2 w-full"
                                onClick={() => applyPreset(preset.name)}
                              >
                                {preset.icon}
                                <div>
                                  <div className="font-medium">{preset.name}</div>
                                  <div className="text-xs text-slate-500">{preset.description}</div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Physics Simulation */}
                      <div>
                        <Label htmlFor="physics">Physics Simulation</Label>
                        <div className="flex items-center justify-between">
                          <Switch id="physics" checked={physicsEnabled} onCheckedChange={setPhysicsEnabled} />
                        </div>
                      </div>

                      {/* Physics Strength */}
                      <div>
                        <Label htmlFor="physics-strength">Physics Strength</Label>
                        <Slider
                          id="physics-strength"
                          defaultValue={[physicsStrength * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setPhysicsStrength(value[0] / 100)}
                          disabled={!physicsEnabled}
                        />
                      </div>

                      {/* Show Node Labels */}
                      <div>
                        <Label htmlFor="node-labels">Show Node Labels</Label>
                        <div className="flex items-center justify-between">
                          <Switch id="node-labels" checked={showNodeLabels} onCheckedChange={setShowNodeLabels} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Network Visualization */}
          <div className="flex-1 relative" ref={containerRef}>
            {containerSize.width > 0 && containerSize.height > 0 && renderNetworkView()}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
