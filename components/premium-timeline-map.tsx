"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import {
  Calendar,
  MapPin,
  Briefcase,
  Code,
  Layout,
  Code2,
  Palette,
  Star,
  Award,
  Search,
  Filter,
  Tag,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  Info,
  Grid,
  BarChart2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import the career data type
import type { CareerEntry } from "@/types/career"

interface PremiumTimelineMapProps {
  careerData: CareerEntry[]
  activeIndex: number
  goToPosition: (index: number) => void
}

export function PremiumTimelineMap({ careerData, activeIndex, goToPosition }: PremiumTimelineMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showMonths, setShowMonths] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 100])
  const [viewMode, setViewMode] = useState<"standard" | "compact" | "detailed" | "grid">("standard")
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [animateNodes, setAnimateNodes] = useState(true)
  const [showSkillConnections, setShowSkillConnections] = useState(false)
  const [selectedSkillForConnections, setSelectedSkillForConnections] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<"none" | "year" | "type" | "skill">("none")
  const [sortBy, setSortBy] = useState<"chronological" | "duration" | "importance">("chronological")
  const [activeTab, setActiveTab] = useState("timeline")

  // Spring animation for smooth scrolling
  const scrollX = useSpring(0, { stiffness: 300, damping: 30 })
  const scrollRef = useRef<HTMLDivElement>(null)

  // Calculate all unique skills across career data
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>()
    careerData.forEach((career) => {
      career.skills.forEach((skill) => skillSet.add(skill))
    })
    return Array.from(skillSet).sort()
  }, [careerData])

  // Calculate dates for timeline with precision
  const timelineData = useMemo(() => {
    // Find earliest start date and latest end date
    let earliestDate = new Date()
    let latestDate = new Date(2000, 0, 1)

    careerData.forEach((career) => {
      const startDate = new Date(career.startDate)
      if (startDate < earliestDate) earliestDate = startDate

      const endDate = career.endDate === "present" ? new Date() : new Date(career.endDate)
      if (endDate > latestDate) latestDate = endDate
    })

    // Create array of years and months if needed
    const timeline = []
    const startYear = earliestDate.getFullYear()
    const endYear = latestDate.getFullYear()

    if (showMonths) {
      // Generate months for each year
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? earliestDate.getMonth() : 0
        const monthEnd = year === endYear ? latestDate.getMonth() : 11

        for (let month = monthStart; month <= monthEnd; month++) {
          timeline.push({
            year,
            month,
            label: `${new Date(year, month).toLocaleString("default", { month: "short" })} ${year}`,
            isYearStart: month === 0 || (year === startYear && month === monthStart),
          })
        }
      }
    } else {
      // Just years
      for (let year = startYear; year <= endYear; year++) {
        timeline.push({
          year,
          label: year.toString(),
          isYearStart: true,
        })
      }
    }

    return {
      timeline,
      startDate: earliestDate,
      endDate: latestDate,
      totalMonths: (endYear - startYear) * 12 + (latestDate.getMonth() - earliestDate.getMonth()),
      startYear,
      endYear,
    }
  }, [careerData, showMonths])

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

      // Time range filter
      const careerStartDate = new Date(career.startDate)
      const careerEndDate = career.endDate === "present" ? new Date() : new Date(career.endDate)

      const timelineStart = new Date(timelineData.startDate)
      const timelineEnd = new Date(timelineData.endDate)

      const totalTimelineMs = timelineEnd.getTime() - timelineStart.getTime()
      const rangeStartMs = timelineStart.getTime() + (totalTimelineMs * timeRange[0]) / 100
      const rangeEndMs = timelineStart.getTime() + (totalTimelineMs * timeRange[1]) / 100

      const rangeStart = new Date(rangeStartMs)
      const rangeEnd = new Date(rangeEndMs)

      // Check if career overlaps with selected time range
      if (careerEndDate < rangeStart || careerStartDate > rangeEnd) {
        return false
      }

      return true
    })
  }, [careerData, searchTerm, selectedSkills, timeRange, timelineData])

  // Sort and group career data
  const organizedCareerData = useMemo(() => {
    const sorted = [...filteredCareerData]

    // Sort data
    if (sortBy === "chronological") {
      sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    } else if (sortBy === "duration") {
      sorted.sort((a, b) => {
        const aDuration =
          (a.endDate === "present" ? new Date() : new Date(a.endDate)).getTime() - new Date(a.startDate).getTime()
        const bDuration =
          (b.endDate === "present" ? new Date() : new Date(b.endDate)).getTime() - new Date(b.startDate).getTime()
        return bDuration - aDuration
      })
    } else if (sortBy === "importance") {
      // Sort by a combination of duration and skills count as a proxy for importance
      sorted.sort((a, b) => {
        const aDuration =
          (a.endDate === "present" ? new Date() : new Date(a.endDate)).getTime() - new Date(a.startDate).getTime()
        const bDuration =
          (b.endDate === "present" ? new Date() : new Date(b.endDate)).getTime() - new Date(b.startDate).getTime()
        const aImportance = aDuration * (1 + a.skills.length / 10)
        const bImportance = bDuration * (1 + b.skills.length / 10)
        return bImportance - aImportance
      })
    }

    // Group data if needed
    if (groupBy === "none") {
      return { groups: [{ title: "All", items: sorted }], isGrouped: false }
    } else if (groupBy === "year") {
      const yearGroups: Record<string, CareerEntry[]> = {}
      sorted.forEach((career) => {
        const year = new Date(career.startDate).getFullYear().toString()
        if (!yearGroups[year]) yearGroups[year] = []
        yearGroups[year].push(career)
      })

      return {
        groups: Object.entries(yearGroups)
          .map(([year, items]) => ({ title: year, items }))
          .sort((a, b) =>
            sortBy === "chronological" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
          ),
        isGrouped: true,
      }
    } else if (groupBy === "type") {
      const typeGroups: Record<string, CareerEntry[]> = {
        Work: [],
        Education: [],
        Project: [],
        Other: [],
      }

      sorted.forEach((career) => {
        if (career.title.toLowerCase().includes("developer") || career.title.toLowerCase().includes("engineer")) {
          typeGroups["Work"].push(career)
        } else if (
          career.title.toLowerCase().includes("university") ||
          career.title.toLowerCase().includes("school") ||
          career.title.toLowerCase().includes("college")
        ) {
          typeGroups["Education"].push(career)
        } else if (career.title.toLowerCase().includes("project")) {
          typeGroups["Project"].push(career)
        } else {
          typeGroups["Other"].push(career)
        }
      })

      return {
        groups: Object.entries(typeGroups)
          .filter(([_, items]) => items.length > 0)
          .map(([title, items]) => ({ title, items })),
        isGrouped: true,
      }
    } else if (groupBy === "skill") {
      // Group by primary skill (most frequent skill across all entries)
      const skillFrequency: Record<string, number> = {}
      allSkills.forEach((skill) => {
        skillFrequency[skill] = sorted.filter((career) => career.skills.includes(skill)).length
      })

      const topSkills = Object.entries(skillFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill]) => skill)

      const skillGroups: Record<string, CareerEntry[]> = {}
      topSkills.forEach((skill) => {
        skillGroups[skill] = sorted.filter((career) => career.skills.includes(skill))
      })

      // Add "Other" category for entries that don't match top skills
      skillGroups["Other"] = sorted.filter((career) => !topSkills.some((skill) => career.skills.includes(skill)))

      return {
        groups: Object.entries(skillGroups)
          .filter(([_, items]) => items.length > 0)
          .map(([title, items]) => ({ title, items })),
        isGrouped: true,
      }
    }

    return { groups: [{ title: "All", items: sorted }], isGrouped: false }
  }, [filteredCareerData, groupBy, sortBy, allSkills])

  // Calculate position on timeline for a date
  const getPositionForDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const startDate = timelineData.startDate
    const endDate = timelineData.endDate
    const totalTime = endDate.getTime() - startDate.getTime()
    const dateTime = date.getTime() - startDate.getTime()
    return (dateTime / totalTime) * 100
  }

  // Handle zoom change
  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0])
  }

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedSkills([])
    setTimeRange([0, 100])
    setZoomLevel(1)
    setGroupBy("none")
    setSortBy("chronological")
  }

  // Get node icon based on career icon string
  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="w-5 h-5" />
      case "Code":
        return <Code className="w-5 h-5" />
      case "Layout":
        return <Layout className="w-5 h-5" />
      case "Code2":
        return <Code2 className="w-5 h-5" />
      case "Palette":
        return <Palette className="w-5 h-5" />
      default:
        return <Briefcase className="w-5 h-5" />
    }
  }

  // Find careers with a specific skill
  const findCareersWithSkill = (skill: string) => {
    return careerData.filter((career) => career.skills.includes(skill)).map((career) => career.id)
  }

  // Scroll to active career
  useEffect(() => {
    if (scrollRef.current && activeIndex !== null) {
      const activeCareer = careerData[activeIndex]
      const startPos = getPositionForDate(activeCareer.startDate)
      const scrollPosition = (startPos / 100) * scrollRef.current.scrollWidth - scrollRef.current.clientWidth / 2
      scrollX.set(Math.max(0, scrollPosition))
    }
  }, [activeIndex, careerData, scrollX])

  // Toggle animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateNodes(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Render timeline view
  const renderTimelineView = () => {
    return (
      <ScrollArea ref={scrollRef} className="h-full" scrollable="horizontal" style={{ scrollLeft: scrollX.get() }}>
        <div
          className="relative p-8"
          style={{
            width: `${Math.max(1000, 1000 * zoomLevel)}px`,
            minHeight: viewMode === "detailed" ? "600px" : "500px",
          }}
        >
          {/* Timeline Years/Months */}
          <div className="absolute bottom-0 left-0 right-0 flex text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
            {timelineData.timeline.map((timePoint, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  width: `${100 / timelineData.timeline.length}%`,
                  opacity: timePoint.isYearStart ? 1 : 0.5,
                }}
              >
                {timePoint.isYearStart && <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700 mb-1"></div>}
                <span className={timePoint.isYearStart ? "font-medium" : ""}>{timePoint.label}</span>
              </div>
            ))}
          </div>

          {/* Timeline Path with 3D Effect */}
          <div className="relative mx-8 mb-20">
            {/* Main Timeline Line with 3D Effect */}
            <div className="absolute top-16 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-full shadow-lg opacity-50">
              {/* 3D Effect Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-full"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-full"></div>
            </div>

            {/* Skill Connections */}
            {showSkillConnections && selectedSkillForConnections && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                    fill="#10b981"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" />
                  </marker>
                </defs>
                {findCareersWithSkill(selectedSkillForConnections).map((careerId, i, arr) => {
                  if (i === arr.length - 1) return null

                  const currentCareer = careerData.find((c) => c.id === careerId)
                  const nextCareer = careerData.find((c) => c.id === arr[i + 1])

                  if (!currentCareer || !nextCareer) return null

                  const startPos = getPositionForDate(currentCareer.startDate)
                  const endPos = getPositionForDate(nextCareer.startDate)

                  return (
                    <path
                      key={`skill-connection-${i}`}
                      d={`M ${startPos}% 16 C ${startPos + 10}% 0, ${endPos - 10}% 0, ${endPos}% 16`}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
              </svg>
            )}

            {/* Career Nodes */}
            {filteredCareerData.map((career, index) => {
              // Calculate position based on dates
              const startPos = getPositionForDate(career.startDate)
              const endPos = career.endDate === "present" ? 100 : getPositionForDate(career.endDate)
              const width = endPos - startPos

              const isActive = careerData.findIndex((c) => c.id === career.id) === activeIndex
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={career.id}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${startPos}%`, width: `${width}%` }}
                >
                  <motion.div
                    className="relative"
                    initial={animateNodes ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => goToPosition(careerData.findIndex((c) => c.id === career.id))}
                          className={cn(
                            "relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                            isActive
                              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md"
                              : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                          )}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          animate={isActive ? { y: -10 } : {}}
                          aria-label={`View ${career.title} at ${career.company}`}
                        >
                          {getNodeIcon(career.icon)}

                          {/* 3D Effect for Node */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-70 pointer-events-none"></div>
                          <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none"></div>

                          {/* Pulsing effect for active node */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              initial={{ opacity: 0, scale: 1 }}
                              animate={{
                                opacity: [0.7, 0],
                                scale: [1, 1.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                              }}
                              style={{
                                background: `linear-gradient(to right, ${career.color}, ${career.color}90)`,
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

                    {/* Career Period Bar with 3D Effect */}
                    <div
                      className={cn(
                        "absolute top-20 left-0 h-3 rounded-full transition-all duration-300",
                        isActive || isHovered
                          ? "opacity-100 bg-gradient-to-r shadow-md"
                          : "opacity-50 bg-slate-300 dark:bg-slate-700",
                      )}
                      style={{
                        width: "100%",
                        backgroundImage:
                          isActive || isHovered
                            ? `linear-gradient(to right, ${career.color}, ${career.color}90)`
                            : "none",
                      }}
                    >
                      {/* 3D Effect Highlight */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-full"></div>
                    </div>

                    {/* Career Info Card */}
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          className={cn(
                            "absolute mt-8 w-72 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl z-20",
                            isActive ? "top-24" : "top-24 opacity-90",
                          )}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                            borderLeft: `4px solid ${career.color}`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-lg" style={{ color: career.color }}>
                                {career.title}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{career.company}</div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {career.period}
                            </Badge>
                          </div>

                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{career.location}</span>
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-3">
                            {career.description}
                          </div>

                          {/* Key achievements */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="mb-3"
                            >
                              <div className="flex items-center text-sm font-medium mb-2">
                                <Award className="h-4 w-4 mr-1" style={{ color: career.color }} />
                                Key Achievements
                              </div>
                              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                {career.missions.map((mission, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 mr-1.5" />
                                    <span className="line-clamp-1">{mission}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {career.skills.slice(0, 5).map((skill, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className={cn(
                                  "text-xs cursor-pointer transition-colors",
                                  selectedSkillForConnections === skill &&
                                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
                                )}
                                onClick={() => {
                                  if (showSkillConnections) {
                                    setSelectedSkillForConnections(selectedSkillForConnections === skill ? null : skill)
                                  }
                                }}
                              >
                                {skill}
                              </Badge>
                            ))}
                            {career.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{career.skills.length - 5}
                              </Badge>
                            )}
                          </div>

                          {/* Collaborators for active node */}
                          {isActive && career.collaborators && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex items-center text-xs font-medium mb-2">
                                <Users className="h-3 w-3 mr-1" style={{ color: career.color }} />
                                Key Collaborators
                              </div>
                              <div className="flex -space-x-2 overflow-hidden">
                                {career.collaborators.map((collaborator, i) => (
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
                            </motion.div>
                          )}

                          {/* View Details Button */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="mt-3"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  setExpandedEvent(expandedEvent === career.id.toString() ? null : career.id.toString())
                                }
                              >
                                {expandedEvent === career.id.toString() ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    View Details
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Detailed Timeline for Active Career */}
          {viewMode !== "compact" && activeIndex !== null && (
            <div className="mt-40 mx-8 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500 to-blue-500" />

              <div className="space-y-8">
                {careerData[activeIndex].detailedEvents.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    className="relative pl-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + eventIndex * 0.1 }}
                  >
                    {/* Timeline Node with 3D Effect */}
                    <div className="absolute left-[-9px] top-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-4 border-emerald-500 z-10">
                      {/* 3D Effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-70 pointer-events-none"></div>

                      {/* Pulsing effect */}
                      <motion.div
                        className="absolute inset-[-4px] rounded-full"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{
                          opacity: [0.5, 0],
                          scale: [1, 1.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: eventIndex * 0.5,
                        }}
                        style={{
                          background: `linear-gradient(to bottom, ${careerData[activeIndex].color}, ${careerData[activeIndex].color}90)`,
                        }}
                      />
                    </div>

                    {/* Event Card with 3D Effect */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow relative overflow-hidden">
                      {/* 3D Effect Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                          {event.title}
                          {eventIndex === 0 && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Latest
                            </Badge>
                          )}
                        </h4>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {event.description.split("\n")[0]}
                      </p>

                      {/* Key achievements */}
                      <div className="mb-3">
                        <div className="flex items-center text-xs font-medium mb-2">
                          <Star className="h-3 w-3 mr-1" style={{ color: careerData[activeIndex].color }} />
                          Key Achievements
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {event.achievements.slice(0, 2).map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 mr-1.5" />
                              <span className="line-clamp-1">{achievement}</span>
                            </li>
                          ))}
                          {event.achievements.length > 2 && (
                            <li className="text-xs text-slate-500">
                              +{event.achievements.length - 2} more achievements
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Tag className="h-3 w-3 text-slate-400" />
                          <div className="flex flex-wrap gap-1">
                            {event.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Media Preview */}
                      {viewMode === "detailed" && event.media && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="relative h-20 w-full rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {event.media.type === "image" ? (
                              <Image
                                src={event.media.url || "/placeholder.svg"}
                                alt={event.media.caption}
                                fill
                                className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="absolute inset-0">
                                  <Image
                                    src={event.media.thumbnail || "/placeholder.svg"}
                                    alt={event.media.caption}
                                    fill
                                    className="object-cover opacity-60"
                                  />
                                </div>
                                <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <Zap className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* View More Link */}
                      {viewMode === "detailed" && (
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                            View Details
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Career Details */}
          <AnimatePresence>
            {expandedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setExpandedEvent(null)}
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>

                {careerData.map((career) => {
                  if (career.id.toString() !== expandedEvent) return null

                  return (
                    <div key={career.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: career.color }} />
                        <div>
                          <h3 className="text-xl font-bold">{career.title}</h3>
                          <p className="text-sm text-slate-500">
                            {career.company} • {career.period}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-1 text-slate-400" />
                            Description
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{career.description}</p>

                          <h4 className="text-sm font-medium mt-4 mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1 text-slate-400" />
                            Key Missions
                          </h4>
                          <ul className="space-y-1">
                            {career.missions.map((mission, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 mr-1.5" />
                                <span className="text-slate-600 dark:text-slate-300">{mission}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-slate-400" />
                            Timeline Highlights
                          </h4>
                          <div className="space-y-3">
                            {career.detailedEvents.slice(0, 3).map((event, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mt-0.5">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: career.color }}></div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{event.title}</div>
                                  <div className="text-xs text-slate-500">{event.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <h4 className="text-sm font-medium mt-4 mb-2 flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-slate-400" />
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {career.skills.map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    )
  }

  // Render grid view
  const renderGridView = () => {
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          {organizedCareerData.groups.map((group, groupIndex) => (
            <div key={group.title} className="mb-8">
              {organizedCareerData.isGrouped && (
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <div className="ml-3 h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((career) => {
                  const isActive = careerData.findIndex((c) => c.id === career.id) === activeIndex

                  return (
                    <Card
                      key={career.id}
                      className={cn(
                        "transition-all duration-300 hover:shadow-md",
                        isActive && "ring-2 ring-emerald-500",
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base" style={{ color: career.color }}>
                            {career.title}
                          </CardTitle>
                          <Badge variant="outline">{career.period}</Badge>
                        </div>
                        <CardDescription>{career.company}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                          {career.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {career.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {career.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{career.skills.length - 3}
                            </Badge>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => goToPosition(careerData.findIndex((c) => c.id === career.id))}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  }

  // Render analytics view
  const renderAnalyticsView = () => {
    // Calculate skill frequency
    const skillFrequency: Record<string, number> = {}
    allSkills.forEach((skill) => {
      skillFrequency[skill] = careerData.filter((career) => career.skills.includes(skill)).length
    })

    // Calculate career duration
    const careerDurations = careerData.map((career) => {
      const startDate = new Date(career.startDate)
      const endDate = career.endDate === "present" ? new Date() : new Date(career.endDate)
      const durationMs = endDate.getTime() - startDate.getTime()
      const durationMonths = durationMs / (1000 * 60 * 60 * 24 * 30)
      return {
        title: career.title,
        company: career.company,
        duration: durationMonths,
        color: career.color,
      }
    })

    // Calculate years distribution
    const yearDistribution: Record<number, number> = {}
    for (let year = timelineData.startYear; year <= timelineData.endYear; year++) {
      yearDistribution[year] = careerData.filter((career) => {
        const startYear = new Date(career.startDate).getFullYear()
        const endYear = career.endDate === "present" ? new Date().getFullYear() : new Date(career.endDate).getFullYear()
        return year >= startYear && year <= endYear
      }).length
    }

    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Skills</CardTitle>
                <CardDescription>Most frequently used skills across your career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(skillFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([skill, count], index) => (
                      <div key={skill} className="flex items-center">
                        <div className="w-32 text-sm font-medium">{skill}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${(count / careerData.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-10 text-right text-sm text-slate-500">{count}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Career Duration</CardTitle>
                <CardDescription>Time spent at each position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerDurations
                    .sort((a, b) => b.duration - a.duration)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-32 text-sm font-medium truncate" title={`${item.title} at ${item.company}`}>
                          {item.title}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(item.duration / Math.max(...careerDurations.map((d) => d.duration))) * 100}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm text-slate-500">{Math.round(item.duration)} months</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Timeline Distribution */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Career Timeline Distribution</CardTitle>
                <CardDescription>Number of positions by year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end">
                  {Object.entries(yearDistribution).map(([year, count]) => (
                    <div key={year} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full max-w-[30px] bg-emerald-500 rounded-t-md"
                        style={{
                          height: `${(count / Math.max(...Object.values(yearDistribution))) * 100}%`,
                          opacity: 0.7 + (count / Math.max(...Object.values(yearDistribution))) * 0.3,
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-slate-500">{year}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="timeline" className="text-xs px-3">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="grid" className="text-xs px-3">
                  <Grid className="h-3.5 w-3.5 mr-1" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs px-3">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(searchTerm || selectedSkills.length > 0 || timeRange[0] > 0 || timeRange[1] < 100) && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1">
                      {selectedSkills.length + (searchTerm ? 1 : 0) + (timeRange[0] > 0 || timeRange[1] < 100 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Timeline</h3>

                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="search"
                        placeholder="Search titles, companies..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Range</Label>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={1}
                        value={timeRange}
                        onValueChange={(value) => setTimeRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>
                          {timelineData.startDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span>
                          {timelineData.endDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-slate-500 mb-1">Group By</Label>
                        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grouping" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                            <SelectItem value="type">Type</SelectItem>
                            <SelectItem value="skill">Skill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1">Sort By</Label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sorting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chronological">Chronological</SelectItem>
                            <SelectItem value="duration">Duration</SelectItem>
                            <SelectItem value="importance">Importance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>View Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "standard" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("standard")}
                        className="flex-1"
                      >
                        Standard
                      </Button>
                      <Button
                        variant={viewMode === "compact" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("compact")}
                        className="flex-1"
                      >
                        Compact
                      </Button>
                      <Button
                        variant={viewMode === "detailed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("detailed")}
                        className="flex-1"
                      >
                        Detailed
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <ScrollArea className="h-40 rounded-md border p-2">
                      <div className="space-y-2">
                        {allSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => toggleSkill(skill)}
                            />
                            <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer flex-1">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-skill-connections"
                      checked={showSkillConnections}
                      onCheckedChange={(checked) => setShowSkillConnections(checked === true)}
                    />
                    <Label htmlFor="show-skill-connections" className="text-sm cursor-pointer">
                      Show Skill Connections
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {activeTab === "timeline" && (
              <Button
                variant="outline"
                size="sm"
                className={cn("rounded-full", showMonths && "bg-slate-100 dark:bg-slate-800")}
                onClick={() => setShowMonths(!showMonths)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {showMonths ? "Hide Months" : "Show Months"}
              </Button>
            )}
          </div>

          {activeTab === "timeline" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Zoom:</span>
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.1}
                value={[zoomLevel]}
                onValueChange={handleZoomChange}
                className="w-32"
              />
              <span className="text-sm text-slate-500 w-12 text-right">{Math.round(zoomLevel * 100)}%</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          ref={containerRef}
          className="relative bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          style={{ height: viewMode === "detailed" ? "700px" : "600px" }}
        >
          {activeTab === "timeline" && renderTimelineView()}
          {activeTab === "grid" && renderGridView()}
          {activeTab === "analytics" && renderAnalyticsView()}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs">Work Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
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
          <div className="text-xs text-slate-500">
            {filteredCareerData.length} of {careerData.length} entries shown
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
