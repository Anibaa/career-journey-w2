"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  MapPin,
  Navigation,
  Compass,
  Mountain,
  Building,
  GraduationCap,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Maximize,
  Minimize,
  Info,
  Calendar,
  Users,
  Layers,
  Bookmark,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { CareerEntry } from "@/types/career"

interface AdvancedCareerMapProps {
  careerData: CareerEntry[]
  className?: string
}

export function AdvancedCareerMap({ careerData, className }: AdvancedCareerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeLocation, setActiveLocation] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showDetails, setShowDetails] = useState(true)
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite" | "terrain" | "blueprint">("standard")
  const [mapMode, setMapMode] = useState<"journey" | "skills" | "achievements">("journey")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [highlightedPath, setHighlightedPath] = useState<number[]>([])

  // Generate map coordinates for career entries
  const mapLocations = careerData.map((career, index) => {
    // Create a deterministic but varied position based on career data
    const startYear = new Date(career.startDate).getFullYear()
    const endYear = career.endDate === "present" ? new Date().getFullYear() : new Date(career.endDate).getFullYear()
    const duration = endYear - startYear

    // Calculate x position based on time (earlier careers are more to the left)
    const earliestYear = Math.min(...careerData.map((c) => new Date(c.startDate).getFullYear()))
    const latestYear = Math.max(
      ...careerData.map((c) =>
        c.endDate === "present" ? new Date().getFullYear() : new Date(c.endDate).getFullYear(),
      ),
    )
    const timeRange = latestYear - earliestYear

    // X position based on time (0-100%)
    const xPos = ((startYear - earliestYear) / timeRange) * 80 + 10

    // Y position with some variation based on career type
    let yPos = 50
    if (career.title.toLowerCase().includes("engineer") || career.title.toLowerCase().includes("developer")) {
      yPos = 30 + (index % 3) * 10 // Tech roles in the northern region
    } else if (career.title.toLowerCase().includes("manager") || career.title.toLowerCase().includes("director")) {
      yPos = 60 + (index % 3) * 10 // Management roles in the southern region
    } else {
      yPos = 45 + (index % 5) * 5 // Other roles in the middle
    }

    // Add some randomness but keep it deterministic
    const hash = career.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const xOffset = (hash % 10) - 5
    const yOffset = ((hash * 2) % 10) - 5

    return {
      id: career.id,
      x: xPos + xOffset,
      y: yPos + yOffset,
      size: 10 + Math.min(duration * 2, 15), // Size based on duration
      career,
      type: getLocationType(career),
    }
  })

  // Determine location type based on career data
  function getLocationType(career: CareerEntry): "city" | "landmark" | "institution" | "achievement" {
    if (career.title.toLowerCase().includes("award") || career.title.toLowerCase().includes("winner")) {
      return "achievement"
    } else if (career.title.toLowerCase().includes("university") || career.title.toLowerCase().includes("school")) {
      return "institution"
    } else if (career.title.toLowerCase().includes("senior") || career.title.toLowerCase().includes("lead")) {
      return "landmark"
    } else {
      return "city"
    }
  }

  // Generate paths between locations
  const mapPaths = careerData.slice(0, -1).map((_, index) => {
    const start = mapLocations[index]
    const end = mapLocations[index + 1]

    // Calculate control points for curved paths
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2
    const curvature = 20 // Higher values make more curved paths

    // Add some randomness to the path
    const isClockwise = index % 2 === 0
    const controlX = midX + (isClockwise ? curvature : -curvature)
    const controlY = midY + (isClockwise ? -curvature : curvature)

    return {
      id: `path-${start.id}-${end.id}`,
      start,
      end,
      controlX,
      controlY,
      isHighlighted: highlightedPath.includes(start.id) && highlightedPath.includes(end.id),
    }
  })

  // Handle map dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))
  }

  const handleResetView = () => {
    setZoomLevel(1)
    setMapPosition({ x: 0, y: 0 })
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (mapRef.current?.requestFullscreen) {
        mapRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Handle location click
  const handleLocationClick = (id: number) => {
    setActiveLocation(activeLocation === id ? null : id)

    // Highlight path to this location
    const newHighlightedPath = [id]
    let currentId = id

    // Find previous locations in the path
    while (currentId > 1) {
      const prevLocation = careerData.findIndex((c) => c.id === currentId - 1)
      if (prevLocation >= 0) {
        newHighlightedPath.push(careerData[prevLocation].id)
        currentId = careerData[prevLocation].id
      } else {
        break
      }
    }

    setHighlightedPath(newHighlightedPath)
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Get map background based on style
  const getMapBackground = () => {
    switch (mapStyle) {
      case "satellite":
        return "bg-[url('/map-satellite.png')] bg-cover"
      case "terrain":
        return "bg-[url('/map-terrain.png')] bg-cover"
      case "blueprint":
        return "bg-blue-900 bg-opacity-90 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"
      default:
        return "bg-amber-50"
    }
  }

  // Get location icon based on type
  const getLocationIcon = (type: string) => {
    switch (type) {
      case "city":
        return <Building className="h-5 w-5" />
      case "landmark":
        return <Mountain className="h-5 w-5" />
      case "institution":
        return <GraduationCap className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  // Get location color based on type
  const getLocationColor = (type: string) => {
    switch (type) {
      case "city":
        return "bg-blue-500 text-white"
      case "landmark":
        return "bg-purple-500 text-white"
      case "institution":
        return "bg-green-500 text-white"
      case "achievement":
        return "bg-amber-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  // Get path style based on mode
  const getPathStyle = (start: CareerEntry, end: CareerEntry, isHighlighted: boolean) => {
    if (mapMode === "skills") {
      // Count common skills
      const startSkills = new Set(start.skills)
      const commonSkills = end.skills.filter((skill) => startSkills.has(skill))

      if (commonSkills.length > 3) {
        return isHighlighted ? "stroke-green-500 stroke-[3px]" : "stroke-green-500 stroke-[1.5px]"
      } else if (commonSkills.length > 0) {
        return isHighlighted ? "stroke-blue-500 stroke-[3px]" : "stroke-blue-500 stroke-[1.5px]"
      } else {
        return isHighlighted ? "stroke-gray-400 stroke-[3px]" : "stroke-gray-400 stroke-[1.5px] stroke-dasharray-2"
      }
    } else if (mapMode === "achievements") {
      // Check if both have achievements
      const hasAchievements = start.missions.length > 0 && end.missions.length > 0

      if (hasAchievements) {
        return isHighlighted ? "stroke-amber-500 stroke-[3px]" : "stroke-amber-500 stroke-[1.5px]"
      } else {
        return isHighlighted ? "stroke-gray-400 stroke-[3px]" : "stroke-gray-400 stroke-[1.5px] stroke-dasharray-2"
      }
    } else {
      // Journey mode - based on career progression
      return isHighlighted ? "stroke-indigo-500 stroke-[3px]" : "stroke-indigo-500 stroke-[1.5px] stroke-opacity-70"
    }
  }

  return (
    <div className={cn("relative rounded-xl overflow-hidden border shadow-md", className)}>
      {/* Map Header */}
      <div className="bg-white dark:bg-slate-800 p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-indigo-500" />
          <h2 className="font-bold text-lg">Career Journey Map</h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={mapMode} onValueChange={(value) => setMapMode(value as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="journey" className="text-xs px-2 py-1">
                Journey
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs px-2 py-1">
                Skills
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs px-2 py-1">
                Achievements
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Map Style</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Map Style</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={mapStyle === "standard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapStyle("standard")}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <div className="w-full h-10 bg-amber-50 rounded-sm"></div>
                    <span className="text-xs">Standard</span>
                  </Button>
                  <Button
                    variant={mapStyle === "satellite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapStyle("satellite")}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <div className="w-full h-10 bg-slate-700 rounded-sm"></div>
                    <span className="text-xs">Satellite</span>
                  </Button>
                  <Button
                    variant={mapStyle === "terrain" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapStyle("terrain")}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <div className="w-full h-10 bg-green-100 rounded-sm"></div>
                    <span className="text-xs">Terrain</span>
                  </Button>
                  <Button
                    variant={mapStyle === "blueprint" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapStyle("blueprint")}
                    className="h-20 flex flex-col gap-1 justify-center"
                  >
                    <div className="w-full h-10 bg-blue-900 rounded-sm"></div>
                    <span className="text-xs">Blueprint</span>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Map Area */}
      <div
        ref={mapRef}
        className={cn(
          "relative overflow-hidden transition-all",
          getMapBackground(),
          isFullscreen ? "h-screen" : "h-[600px]",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Map Content */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-200"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          {/* Map Grid */}
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke={mapStyle === "blueprint" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                  strokeWidth="0.5"
                />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke={mapStyle === "blueprint" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Map Decorations */}
          <div className="absolute inset-0">
            {/* Compass Rose */}
            <div className="absolute top-10 left-10 w-20 h-20 opacity-70">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="2" />
                <path d="M 50 5 L 45 15 L 55 15 Z" fill="currentColor" />
                <text x="50" y="20" textAnchor="middle" className="text-xs font-bold">
                  N
                </text>
                <text x="80" y="53" textAnchor="middle" className="text-xs font-bold">
                  E
                </text>
                <text x="50" y="85" textAnchor="middle" className="text-xs font-bold">
                  S
                </text>
                <text x="20" y="53" textAnchor="middle" className="text-xs font-bold">
                  W
                </text>
              </svg>
            </div>

            {/* Map Title */}
            <div className="absolute top-10 right-10 max-w-xs">
              <div
                className={cn(
                  "p-3 rounded-lg backdrop-blur-sm",
                  mapStyle === "blueprint" ? "bg-white/10" : "bg-black/10",
                )}
              >
                <h2
                  className={cn(
                    "font-serif italic text-xl font-bold",
                    mapStyle === "blueprint" ? "text-white" : "text-slate-800",
                  )}
                >
                  Professional Journey Atlas
                </h2>
                <p className={cn("text-sm mt-1", mapStyle === "blueprint" ? "text-white/80" : "text-slate-600")}>
                  A cartographic representation of career progression
                </p>
              </div>
            </div>

            {/* Map Scale */}
            <div className="absolute bottom-10 left-10">
              <div
                className={cn(
                  "p-2 rounded-lg backdrop-blur-sm",
                  mapStyle === "blueprint" ? "bg-white/10" : "bg-black/10",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="h-1 w-10 bg-current"></div>
                      <div className="h-3 w-0.5 bg-current"></div>
                      <div className="h-1 w-10 bg-current"></div>
                      <div className="h-3 w-0.5 bg-current"></div>
                      <div className="h-1 w-10 bg-current"></div>
                    </div>
                    <div className="text-xs mt-1">5 years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Paths */}
          <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
            {mapPaths.map((path) => (
              <path
                key={path.id}
                d={`M ${path.start.x}% ${path.start.y}% Q ${path.controlX}% ${path.controlY}% ${path.end.x}% ${path.end.y}%`}
                fill="none"
                className={getPathStyle(path.start.career, path.end.career, path.isHighlighted)}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Map Locations */}
          <div className="absolute inset-0">
            {mapLocations.map((location) => {
              const isActive = activeLocation === location.id

              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          className={cn(
                            "rounded-full flex items-center justify-center border-2 border-white shadow-md",
                            getLocationColor(location.type),
                            isActive ? "ring-4 ring-indigo-300" : "",
                          )}
                          style={{
                            width: `${location.size * 2}px`,
                            height: `${location.size * 2}px`,
                          }}
                          onClick={() => handleLocationClick(location.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          animate={
                            isActive
                              ? {
                                  scale: [1, 1.1, 1],
                                  transition: {
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    duration: 1.5,
                                  },
                                }
                              : {}
                          }
                        >
                          {getLocationIcon(location.type)}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{location.career.title}</p>
                          <p className="text-xs text-slate-500">{location.career.company}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Location Label */}
                  <div
                    className={cn(
                      "absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap text-center",
                      mapStyle === "blueprint" ? "text-white" : "text-slate-800",
                    )}
                  >
                    <div className="text-xs font-bold">{location.career.company}</div>
                    {isActive && <div className="text-[10px] opacity-80">{location.career.title}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button variant="secondary" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-full shadow-lg">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-full shadow-lg">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleResetView} className="h-8 w-8 rounded-full shadow-lg">
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={toggleFullscreen} className="h-8 w-8 rounded-full shadow-lg">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowLegend(!showLegend)}
            className="h-8 w-8 rounded-full shadow-lg"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Legend */}
        {showLegend && (
          <div className="absolute bottom-4 right-4 max-w-xs">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">Map Legend</h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowLegend(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Building className="h-3 w-3" />
                    </div>
                    <span>Work Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <GraduationCap className="h-3 w-3" />
                    </div>
                    <span>Education</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Mountain className="h-3 w-3" />
                    </div>
                    <span>Major Career Milestone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">
                      <Award className="h-3 w-3" />
                    </div>
                    <span>Achievement</span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-0.5 bg-indigo-500"></div>
                      <span>Career Path</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-12 h-0.5 bg-blue-500"></div>
                      <span>Skill Connection</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-12 h-0.5 bg-amber-500"></div>
                      <span>Achievement Path</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Location Details Panel */}
        <AnimatePresence>
          {activeLocation && showDetails && (
            <motion.div
              className="absolute left-4 bottom-4 w-80 max-w-[calc(100%-2rem)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4">
                  {mapLocations.map((location) => {
                    if (location.id !== activeLocation) return null

                    const career = location.career

                    return (
                      <div key={location.id} className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{career.title}</h3>
                            <p className="text-sm text-muted-foreground">{career.company}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setShowDetails(false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{career.period}</span>
                        </div>

                        <p className="text-sm">{career.description}</p>

                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            Key Missions
                          </h4>
                          <ul className="space-y-1">
                            {career.missions.map((mission, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-current mt-1.5"></span>
                                <span>{mission}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-1">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {career.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {career.collaborators && (
                          <div>
                            <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              Key Collaborators
                            </h4>
                            <div className="flex -space-x-2">
                              <TooltipProvider>
                                {career.collaborators.map((collaborator, idx) => (
                                  <Tooltip key={idx}>
                                    <TooltipTrigger asChild>
                                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white relative">
                                        {collaborator.avatar && (
                                          <Image
                                            src={collaborator.avatar || "/placeholder.svg"}
                                            alt={collaborator.name}
                                            fill
                                            className="rounded-full object-cover"
                                          />
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="font-medium">{collaborator.name}</p>
                                      <p className="text-xs">{collaborator.role}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </TooltipProvider>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setActiveLocation(null)}
                          >
                            Close
                          </Button>
                          <Button variant="default" size="sm" className="text-xs gap-1">
                            <Bookmark className="h-3 w-3" />
                            Save Location
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Details Button */}
        {activeLocation && !showDetails && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute left-4 bottom-4 shadow-lg"
            onClick={() => setShowDetails(true)}
          >
            <ChevronUp className="h-4 w-4 mr-1" />
            Show Details
          </Button>
        )}
      </div>
    </div>
  )
}
