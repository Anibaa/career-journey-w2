"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useAnimation, useInView, useMotionValue, useTransform } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  MapPin,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Play,
  Clock,
  Star,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  Download,
  Layers,
  Map,
  Globe,
  Compass,
  LinkIcon,
  ExternalLink,
  Tag,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMobile } from "@/hooks/use-mobile"
import { EnhancedParticleCanvas } from "@/components/enhanced-particle-canvas"
import { PremiumTimelineMap } from "@/components/premium-timeline-map"
import { PremiumNetworkMap } from "@/components/premium-network-map"

// Import the career data from a separate file
import { careerData } from "@/data/career-data"

export function RefinedCareerJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapView, setMapView] = useState<"immersive" | "timeline" | "network" | "3d">("immersive")
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [activeDetailedEvent, setActiveDetailedEvent] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const activeCareer = careerData[activeIndex]

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setDirection(-1)
      setActiveIndex(activeIndex - 1)
      setActiveTab("overview")
      setActiveDetailedEvent(null)
    }
  }

  const goToNext = () => {
    if (activeIndex < careerData.length - 1) {
      setDirection(1)
      setActiveIndex(activeIndex + 1)
      setActiveTab("overview")
      setActiveDetailedEvent(null)
    }
  }

  const goToPosition = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setActiveTab("overview")
    setActiveDetailedEvent(null)
  }

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - mapRef.current.offsetLeft)
      setScrollLeft(mapRef.current.scrollLeft)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapRef.current) return
    e.preventDefault()
    const x = e.pageX - mapRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    mapRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mapRef.current) {
      setIsDragging(true)
      setStartX(e.touches[0].pageX - mapRef.current.offsetLeft)
      setScrollLeft(mapRef.current.scrollLeft)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !mapRef.current) return
    const x = e.touches[0].pageX - mapRef.current.offsetLeft
    const walk = (x - startX) * 2
    mapRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    // Scroll the map to center the active node
    if (mapRef.current && mapView !== "immersive") {
      const mapWidth = mapRef.current.scrollWidth
      const nodeWidth = mapWidth / careerData.length
      const scrollPosition = nodeWidth * activeIndex - mapRef.current.clientWidth / 2 + nodeWidth / 2

      mapRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [activeIndex, mapView])

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full transition-all",
              mapView === "immersive" && "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent",
            )}
            onClick={() => setMapView("immersive")}
          >
            <Compass className="h-4 w-4 mr-2" />
            Immersive
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full transition-all",
              mapView === "timeline" && "bg-gradient-to-r from-blue-500 to-violet-500 text-white border-transparent",
            )}
            onClick={() => setMapView("timeline")}
          >
            <Map className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full transition-all",
              mapView === "network" && "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-transparent",
            )}
            onClick={() => setMapView("network")}
          >
            <Globe className="h-4 w-4 mr-2" />
            Network
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full transition-all",
              mapView === "3d" && "bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent",
            )}
            onClick={() => setMapView("3d")}
          >
            <Layers className="h-4 w-4 mr-2" />
            3D View
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="text-sm font-medium mb-2">Share your journey</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Copy Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" className="rounded-full">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="rounded-full"
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <span className="text-sm font-medium w-16 text-center">{Math.round(zoomLevel * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2}
            className="rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen} className="rounded-full">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="sr-only">{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</span>
          </Button>
        </div>
      </div>

      {/* Interactive Map/Timeline */}
      <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-4 md:p-8">
          {mapView === "immersive" && <ImmersiveMapView activeIndex={activeIndex} goToPosition={goToPosition} />}
          {mapView === "timeline" && (
            <PremiumTimelineMap careerData={careerData} activeIndex={activeIndex} goToPosition={goToPosition} />
          )}
          {mapView === "network" && (
            <PremiumNetworkMap careerData={careerData} activeIndex={activeIndex} goToPosition={goToPosition} />
          )}
          {mapView === "3d" && <ThreeDMapView activeIndex={activeIndex} goToPosition={goToPosition} />}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sr-only sm:hidden">Previous position</span>
          </Button>

          <div className="hidden sm:flex items-center space-x-1">
            {careerData.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === activeIndex ? "bg-emerald-500 scale-125" : "bg-slate-300 dark:bg-slate-600",
                )}
                onClick={() => goToPosition(index)}
                aria-label={`Go to position ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={activeIndex === careerData.length - 1}
            className="rounded-full"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sr-only sm:hidden">Next position</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Career Details */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeCareer.id}
          initial={{
            opacity: 0,
            x: direction > 0 ? 100 : -100,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -100 : 100,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-12 rounded-full"
                style={{ backgroundColor: activeCareer.color }}
                aria-hidden="true"
              />
              <h2 className="text-2xl md:text-3xl font-bold">{activeCareer.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-slate-600 dark:text-slate-400 ml-6">
              <span className="font-medium">{activeCareer.company}</span>
              <span>•</span>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{activeCareer.location}</span>
              </div>
            </div>
            <div className="flex items-center mt-2 text-slate-500 dark:text-slate-500 ml-6">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{activeCareer.period}</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Detailed Timeline</TabsTrigger>
              <TabsTrigger value="gallery" className="hidden md:block">
                Media Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Career Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-emerald-600" />
                      Description
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeCareer.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-emerald-600" />
                      Key Missions
                    </h3>
                    <ul className="space-y-2">
                      {activeCareer.missions.map((mission, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 mr-2" />
                          <span className="text-slate-700 dark:text-slate-300">{mission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-emerald-600" />
                      Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCareer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {activeCareer.links && activeCareer.links.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        Related Links
                      </h3>
                      <ul className="space-y-2">
                        {activeCareer.links.map((link, index) => (
                          <li key={index} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2 text-slate-400" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline"
                            >
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Media Section */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={activeCareer.image || "/placeholder.svg?height=400&width=600"}
                        alt={`${activeCareer.title} at ${activeCareer.company}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Project Highlights</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Visual representation of key projects and achievements during this period.
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("gallery")} className="w-full">
                          View Media Gallery
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="relative">
                {/* Detailed Timeline */}
                <div className="space-y-8 relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700" />

                  {activeCareer.detailedEvents.map((event, index) => (
                    <EnhancedTimelineEvent
                      key={event.id}
                      event={event}
                      isLast={index === activeCareer.detailedEvents.length - 1}
                      color={activeCareer.color}
                      isActive={activeDetailedEvent === event.id}
                      onToggle={() => setActiveDetailedEvent(activeDetailedEvent === event.id ? null : event.id)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Media Gallery</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  A collection of images and videos from this period of your career journey.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCareer.detailedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="relative aspect-video w-full">
                        {event.media.type === "image" ? (
                          <Image
                            src={event.media.url || "/placeholder.svg?height=300&width=500"}
                            alt={event.media.caption}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="relative h-full w-full bg-slate-900 flex items-center justify-center">
                            <div className="absolute inset-0">
                              <Image
                                src={event.media.thumbnail || "/placeholder.svg?height=300&width=500"}
                                alt={event.media.caption}
                                fill
                                className="object-cover opacity-70"
                              />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
                              <Play className="h-6 w-6 text-white" />
                              <span className="sr-only">Play video</span>
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface EnhancedTimelineEventProps {
  event: {
    id: string
    date: string
    title: string
    description: string
    achievements: string[]
    media: {
      type: "image" | "video"
      url: string
      thumbnail?: string
      caption: string
    }
    relatedLinks?: { title: string; url: string }[]
    collaborators?: string[]
    tags?: string[]
  }
  isLast: boolean
  color: string
  isActive: boolean
  onToggle: () => void
}

function EnhancedTimelineEvent({ event, isLast, color, isActive, onToggle }: EnhancedTimelineEventProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 0.2 },
      })
    }
  }, [controls, inView])

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={controls} className="relative pl-10">
      {/* Timeline Node */}
      <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{ backgroundColor: `${color}20` }}
          animate={isActive ? { scale: [1, 1.1, 1], boxShadow: `0 0 0 4px ${color}30` } : {}}
          transition={{ duration: 1.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
        >
          <Clock className="w-5 h-5" style={{ color }} />
        </motion.div>
      </div>

      {/* Event Content */}
      <Card
        className={cn(
          "overflow-hidden border-l-4 transition-all duration-300",
          isActive && "shadow-lg shadow-slate-200 dark:shadow-slate-900",
        )}
        style={{ borderLeftColor: color }}
      >
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <Badge variant="outline" className="mt-2 md:mt-0 w-fit">
                {event.date}
              </Badge>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-4">{event.description}</p>

            <Button variant="ghost" size="sm" className="mb-4 p-0" style={{ color }} onClick={onToggle}>
              {isActive ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show More Details
                </>
              )}
            </Button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-6 overflow-hidden"
                >
                  {/* Media */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 flex items-center">
                      {event.media.type === "image" ? (
                        <ImageIcon className="h-4 w-4 mr-2" style={{ color }} />
                      ) : (
                        <Play className="h-4 w-4 mr-2" style={{ color }} />
                      )}
                      Media
                    </h4>

                    <div className="relative rounded-md overflow-hidden">
                      {event.media.type === "image" ? (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={event.media.url || "/placeholder.svg?height=300&width=500"}
                            alt={event.media.caption}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
                          <div className="absolute inset-0">
                            <Image
                              src={event.media.thumbnail || "/placeholder.svg?height=300&width=500"}
                              alt={event.media.caption}
                              fill
                              className="object-cover opacity-70"
                            />
                          </div>
                          <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="h-6 w-6 text-white" />
                            <span className="sr-only">Play video</span>
                          </Button>
                        </div>
                      )}
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                        {event.media.caption}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-md font-semibold mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2" style={{ color }} />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {event.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full mt-2 mr-2"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Links */}
                  {event.relatedLinks && event.relatedLinks.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2" style={{ color }} />
                        Related Links
                      </h4>
                      <ul className="space-y-2">
                        {event.relatedLinks.map((link, index) => (
                          <li key={index} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2 text-slate-400" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline"
                            >
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Collaborators */}
                  {event.collaborators && event.collaborators.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" style={{ color }} />
                        Collaborators
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.collaborators.map((person, index) => (
                          <Badge key={index} variant="outline">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center">
                        <Tag className="h-4 w-4 mr-2" style={{ color }} />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MapViewProps {
  activeIndex: number
  goToPosition: (index: number) => void
}

function ImmersiveMapView({ activeIndex, goToPosition }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      setContainerHeight(containerRef.current.offsetHeight)

      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth)
          setContainerHeight(containerRef.current.offsetHeight)
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseX.set(x)
      mouseY.set(y)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <EnhancedParticleCanvas />
      </div>

      {/* Glowing Orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl"
        style={{
          x: useTransform(mouseX, [0, containerWidth], [-50, 50]),
          y: useTransform(mouseY, [0, containerHeight], [-50, 50]),
        }}
      />

      {/* Career Path */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-4xl">
          {/* Path Line */}
          <svg
            className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2"
            viewBox={`0 0 ${careerData.length * 200} 2`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="75%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 1 L ${careerData.length * 200} 1`}
              stroke="url(#pathGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Career Nodes */}
          <div className="flex justify-between px-4 md:px-8">
            {careerData.map((career, index) => (
              <motion.div
                key={career.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => goToPosition(index)}
                        className={cn(
                          "relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                          index === activeIndex
                            ? "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/40"
                            : "opacity-70 hover:opacity-100",
                        )}
                        style={{
                          backgroundColor: index === activeIndex ? career.color : `${career.color}40`,
                          transform: index === activeIndex ? "scale(1.2)" : "scale(1)",
                        }}
                        whileHover={{ scale: index === activeIndex ? 1.2 : 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`View ${career.title} at ${career.company}`}
                      >
                        <Briefcase className={cn("w-7 h-7", index === activeIndex ? "text-white" : "text-slate-200")} />
                        {index === activeIndex && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                            style={{
                              boxShadow: `0 0 20px ${career.color}`,
                              zIndex: -1,
                            }}
                          />
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{career.title}</p>
                        <p className="text-xs text-slate-500">{career.period}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AnimatePresence>
                  {index === activeIndex && (
                    <motion.div
                      className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-xl border border-white/20 text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="font-bold text-lg mb-1">{career.title}</div>
                      <div className="text-sm text-slate-300 mb-2">{career.company}</div>
                      <div className="text-xs text-slate-400 mb-3">{career.period}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {career.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                            {skill}
                          </span>
                        ))}
                        {career.skills.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                            +{career.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreeDMapView({ activeIndex, goToPosition }: MapViewProps) {
  return (
    <div className="h-[400px] relative perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium">3D View</p>
          <p className="text-sm">This view requires WebGL support</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none"></div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {careerData.map((career, index) => (
          <button
            key={career.id}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === activeIndex ? "bg-emerald-500 scale-125" : "bg-slate-300 dark:bg-slate-600",
            )}
            onClick={() => goToPosition(index)}
            aria-label={`Go to ${career.title}`}
          />
        ))}
      </div>
    </div>
  )
}
