"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Filter, Calendar, Briefcase, GraduationCap, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface OrganizedTimelineMapProps {
  events: any[]
  skills: any[]
}

export function OrganizedTimelineMap({ events, skills }: OrganizedTimelineMapProps) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [timeRange, setTimeRange] = useState<[number, number]>([
    Math.min(...events.map((e) => new Date(e.date).getFullYear())),
    Math.max(...events.map((e) => new Date(e.date).getFullYear())),
  ])
  const [zoomLevel, setZoomLevel] = useState(1)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Categories for organization
  const categories = [
    { id: "all", label: "All Events", icon: Calendar },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "achievement", label: "Achievements", icon: Award },
  ]

  // Group events by year for better organization
  const eventsByYear = filteredEvents.reduce(
    (acc, event) => {
      const year = new Date(event.date).getFullYear()
      if (!acc[year]) acc[year] = []
      acc[year].push(event)
      return acc
    },
    {} as Record<number, any[]>,
  )

  // Sort years in descending order
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  // Filter events based on category and time range
  useEffect(() => {
    let filtered = events

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((event) => event.type === activeCategory)
    }

    // Filter by time range
    filtered = filtered.filter((event) => {
      const year = new Date(event.date).getFullYear()
      return year >= timeRange[0] && year <= timeRange[1]
    })

    setFilteredEvents(filtered)

    // Select the first event if available
    if (filtered.length > 0 && !selectedEvent) {
      setSelectedEvent(filtered[0])
    }
  }, [activeCategory, timeRange, events, selectedEvent])

  // Handle event selection
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)

    // Scroll to the selected event
    if (timelineRef.current) {
      const eventElement = document.getElementById(`event-${event.id}`)
      if (eventElement) {
        timelineRef.current.scrollTo({
          left: eventElement.offsetLeft - timelineRef.current.offsetWidth / 2 + eventElement.offsetWidth / 2,
          behavior: "smooth",
        })
      }
    }
  }

  // Get the icon for an event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "work":
        return <Briefcase className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "achievement":
        return <Award className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with title and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Career Timeline</h2>
              <p className="text-muted-foreground">Organized view of your professional journey</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.min(2, prev + 0.1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-4 mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Time range slider */}
            <div className="mb-6 px-2">
              <p className="text-sm text-muted-foreground mb-2">
                Time Range: {timeRange[0]} - {timeRange[1]}
              </p>
              <Slider
                defaultValue={[timeRange[0], timeRange[1]]}
                min={Math.min(...events.map((e) => new Date(e.date).getFullYear()))}
                max={Math.max(...events.map((e) => new Date(e.date).getFullYear()))}
                step={1}
                onValueChange={(value) => setTimeRange([value[0], value[1]])}
                className="mb-2"
              />
            </div>

            {/* Timeline visualization */}
            <div
              ref={timelineRef}
              className="relative overflow-x-auto pb-4 hide-scrollbar"
              style={{
                overflowY: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div
                className="relative flex items-start gap-1 min-w-max"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "left center",
                  transition: "transform 0.3s ease",
                }}
              >
                {/* Timeline track */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0"></div>

                {/* Timeline years */}
                {sortedYears.map((year) => (
                  <div key={year} className="relative flex flex-col items-center mt-2 mx-8">
                    <div className="text-sm font-medium mb-2">{year}</div>
                    <div className="w-3 h-3 rounded-full bg-primary z-10"></div>

                    {/* Events for this year */}
                    <div className="flex flex-col gap-3 mt-4">
                      {eventsByYear[year]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((event) => (
                          <div
                            key={event.id}
                            id={`event-${event.id}`}
                            className={`
                              relative p-3 rounded-lg cursor-pointer transition-all
                              ${
                                selectedEvent?.id === event.id
                                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                                  : "bg-card hover:bg-accent"
                              }
                            `}
                            style={{ width: "220px" }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getEventIcon(event.type)}
                              <Badge
                                variant={
                                  event.type === "work"
                                    ? "default"
                                    : event.type === "education"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {event.type}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-sm">{event.title}</h3>
                            <p className="text-xs opacity-80 truncate">{event.organization}</p>
                            <p className="text-xs mt-1">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected event details */}
            <AnimatePresence mode="wait">
              {selectedEvent && (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-accent rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                      <p className="text-muted-foreground">{selectedEvent.organization}</p>
                      <p className="text-sm mt-1">
                        {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                        {selectedEvent.endDate &&
                          ` - ${
                            selectedEvent.endDate === "present"
                              ? "Present"
                              : new Date(selectedEvent.endDate).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })
                          }`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        selectedEvent.type === "work"
                          ? "default"
                          : selectedEvent.type === "education"
                            ? "secondary"
                            : "outline"
                      }
                      className="flex items-center gap-1"
                    >
                      {getEventIcon(selectedEvent.type)}
                      <span>{selectedEvent.type}</span>
                    </Badge>
                  </div>

                  <p className="mt-4">{selectedEvent.description}</p>

                  {selectedEvent.skills && selectedEvent.skills.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.skills.map((skillId: string) => {
                          const skill = skills.find((s) => s.id === skillId)
                          return skill ? (
                            <Badge key={skill.id} variant="outline" className="bg-background">
                              {skill.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  {selectedEvent.achievements && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Key Achievements</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedEvent.achievements.map((achievement: string, index: number) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
