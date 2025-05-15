"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import type { CareerData, CareerEvent } from "@/types/career"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Briefcase,
  Award,
  Sparkles,
  Filter,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface EnhancedTimelineMapProps {
  data: CareerData
  className?: string
}

export function EnhancedTimelineMap({ data, className }: EnhancedTimelineMapProps) {
  const isMobile = useMobile()
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Extract all years from the data
  const years = useMemo(() => {
    const allDates = [...data.jobs, ...data.education, ...data.projects, ...data.milestones].flatMap((item) => [
      new Date(item.startDate),
      new Date(item.endDate || new Date()),
    ])

    const startYear = Math.min(...allDates.map((date) => date.getFullYear()))
    const endYear = Math.max(...allDates.map((date) => date.getFullYear()))

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
  }, [data])

  // Calculate timeline width
  const timelineWidth = useMemo(() => {
    return years.length * 120
  }, [years])

  // Function to get position for a date
  const getPositionForDate = useCallback(
    (dateStr: string): number => {
      const date = new Date(dateStr)
      const yearIndex = years.indexOf(date.getFullYear())
      const monthOffset = date.getMonth() / 12

      return (yearIndex + monthOffset) * 120
    },
    [years],
  )

  // Filter events based on active filter
  const filteredEvents = useMemo(() => {
    let events = [...data.jobs, ...data.education, ...data.projects, ...data.milestones]

    if (activeFilter) {
      if (activeFilter === "jobs") events = data.jobs
      else if (activeFilter === "education") events = data.education
      else if (activeFilter === "projects") events = data.projects
      else if (activeFilter === "milestones") events = data.milestones
    }

    if (highlightedSkill) {
      events = events.filter((event) =>
        event.skills?.some((skill) =>
          typeof skill === "string" ? skill === highlightedSkill : skill.name === highlightedSkill,
        ),
      )
    }

    return events
  }, [data, activeFilter, highlightedSkill])

  // Extract all unique skills
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>()
    ;[...data.jobs, ...data.education, ...data.projects].forEach((item) => {
      item.skills?.forEach((skill) => {
        if (typeof skill === "string") {
          skillSet.add(skill)
        } else {
          skillSet.add(skill.name)
        }
      })
    })

    return Array.from(skillSet)
  }, [data])

  // Scroll to selected event
  useEffect(() => {
    if (selectedEvent && timelineRef.current) {
      const position = getPositionForDate(selectedEvent.startDate)
      timelineRef.current.scrollLeft = position - 100
    }
  }, [selectedEvent, getPositionForDate])

  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase((prev) => (prev < 3 ? prev + 1 : prev))
    }, 800)

    return () => clearTimeout(timer)
  }, [animationPhase])

  // Handle scroll with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!timelineRef.current) return

      if (e.key === "ArrowLeft") {
        timelineRef.current.scrollLeft -= 120
      } else if (e.key === "ArrowRight") {
        timelineRef.current.scrollLeft += 120
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Get event type icon
  const getEventIcon = (event: CareerEvent) => {
    if (data.jobs.includes(event as any)) return <Briefcase className="h-4 w-4" />
    if (data.education.includes(event as any)) return <Calendar className="h-4 w-4" />
    if (data.projects.includes(event as any)) return <Sparkles className="h-4 w-4" />
    if (data.milestones.includes(event as any)) return <Award className="h-4 w-4" />
    return null
  }

  // Get event type color
  const getEventColor = (event: CareerEvent) => {
    if (data.jobs.includes(event as any)) return "bg-blue-500"
    if (data.education.includes(event as any)) return "bg-green-500"
    if (data.projects.includes(event as any)) return "bg-purple-500"
    if (data.milestones.includes(event as any)) return "bg-amber-500"
    return "bg-gray-500"
  }

  // Get skill color
  const getSkillColor = (skill: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]

    // Deterministic color based on skill name
    const index = skill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground shadow",
        isExpanded ? "fixed inset-4 z-50" : "w-full",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Career Timeline</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all" onClick={() => setActiveFilter(null)}>
              All
            </TabsTrigger>
            <TabsTrigger value="jobs" onClick={() => setActiveFilter("jobs")}>
              Jobs
            </TabsTrigger>
            <TabsTrigger value="education" onClick={() => setActiveFilter("education")}>
              Education
            </TabsTrigger>
            <TabsTrigger value="projects" onClick={() => setActiveFilter("projects")}>
              Projects
            </TabsTrigger>
            <TabsTrigger value="milestones" onClick={() => setActiveFilter("milestones")}>
              Milestones
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {allSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" /> Skills
            </Badge>
            {allSkills.map((skill) => (
              <Badge
                key={skill}
                variant={highlightedSkill === skill ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setHighlightedSkill(highlightedSkill === skill ? null : skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="relative">
          <div
            className="overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            ref={timelineRef}
            style={{ maxHeight: isExpanded ? "calc(100vh - 300px)" : "400px" }}
          >
            {/* Timeline years */}
            <div
              className="flex items-center h-8 sticky top-0 bg-card z-10 border-b"
              style={{ width: `${timelineWidth}px`, minWidth: "100%" }}
            >
              {years.map((year, index) => (
                <motion.div
                  key={year}
                  className="flex-shrink-0 text-sm font-medium text-muted-foreground"
                  style={{ width: "120px", textAlign: "center" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: animationPhase > 0 ? 1 : 0,
                    y: animationPhase > 0 ? 0 : -10,
                  }}
                  transition={{ delay: index * 0.05 }}
                >
                  {year}
                </motion.div>
              ))}
            </div>

            {/* Timeline path */}
            <div className="relative mt-8" style={{ width: `${timelineWidth}px`, minWidth: "100%", height: "400px" }}>
              <motion.div
                className="absolute top-20 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${timelineWidth}px` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: animationPhase > 1 ? 1 : 0,
                  opacity: animationPhase > 1 ? 1 : 0,
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Career events */}
              {filteredEvents.map((event, index) => {
                const startPosition = getPositionForDate(event.startDate)
                const endPosition = event.endDate ? getPositionForDate(event.endDate) : startPosition + 60
                const duration = endPosition - startPosition

                return (
                  <div key={`${event.title}-${index}`}>
                    {/* Career period bar */}
                    {event.endDate && (
                      <motion.div
                        className={cn("absolute h-8 rounded-full opacity-30", getEventColor(event))}
                        style={{
                          left: `${startPosition}px`,
                          width: `${duration}px`,
                          top: "76px",
                        }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: animationPhase > 2 ? 1 : 0,
                          opacity: animationPhase > 2 ? 0.3 : 0,
                        }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    )}

                    {/* Career node */}
                    <motion.div
                      className={cn(
                        "absolute w-6 h-6 rounded-full border-2 border-background flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform",
                        getEventColor(event),
                        selectedEvent === event && "ring-2 ring-offset-2 ring-offset-background",
                      )}
                      style={{
                        left: `${startPosition}px`,
                        top: "80px",
                        marginLeft: "-12px",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: animationPhase > 2 ? 1 : 0,
                        opacity: animationPhase > 2 ? 1 : 0,
                      }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      onClick={() => setSelectedEvent(event)}
                      whileHover={{ y: -5 }}
                    >
                      {getEventIcon(event)}
                    </motion.div>

                    {/* Event title */}
                    <motion.div
                      className="absolute text-xs font-medium"
                      style={{
                        left: `${startPosition}px`,
                        top: index % 2 === 0 ? "110px" : "50px",
                        transform: "translateX(-50%)",
                        maxWidth: "100px",
                        textAlign: "center",
                      }}
                      initial={{ opacity: 0, y: index % 2 === 0 ? -10 : 10 }}
                      animate={{
                        opacity: animationPhase > 2 ? 1 : 0,
                        y: animationPhase > 2 ? 0 : index % 2 === 0 ? -10 : 10,
                      }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {event.title}
                    </motion.div>

                    {/* Event details (if selected) */}
                    {selectedEvent === event && (
                      <motion.div
                        className="absolute z-20 w-64"
                        style={{
                          left: `${startPosition}px`,
                          top: "140px",
                          transform: "translateX(-50%)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">{event.organization}</p>
                                <p className="text-xs mt-1">
                                  {new Date(event.startDate).toLocaleDateString()} -
                                  {event.endDate ? new Date(event.endDate).toLocaleDateString() : "Present"}
                                </p>
                              </div>
                              <div className={cn("w-3 h-3 rounded-full", getEventColor(event))} />
                            </div>

                            {event.description && <p className="text-sm mt-2">{event.description}</p>}

                            {event.skills && event.skills.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {event.skills.map((skill, i) => {
                                  const skillName = typeof skill === "string" ? skill : skill.name
                                  return (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {skillName}
                                    </Badge>
                                  )
                                })}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (timelineRef.current) {
                  timelineRef.current.scrollLeft -= 240
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (timelineRef.current) {
                  timelineRef.current.scrollLeft += 240
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs">Jobs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs">Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs">Milestones</span>
          </div>
        </div>
      </div>
    </div>
  )
}
