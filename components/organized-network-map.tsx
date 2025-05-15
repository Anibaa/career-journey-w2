"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ZoomIn, ZoomOut, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface OrganizedNetworkMapProps {
  events: any[]
  skills: any[]
}

export function OrganizedNetworkMap({ events, skills }: OrganizedNetworkMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [linkStrength, setLinkStrength] = useState(0.5)
  const [nodeRepulsion, setNodeRepulsion] = useState(200)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [groupingMode, setGroupingMode] = useState("category")
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set())
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set())

  // Color scheme for different node types
  const colorMap = {
    event: {
      work: "#3b82f6", // Blue
      education: "#8b5cf6", // Purple
      achievement: "#f59e0b", // Amber
    },
    skill: "#10b981", // Emerald
    organization: "#6366f1", // Indigo
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel / 1.2, 0.5))
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
  }

  // Handle grouping mode change
  const handleGroupingChange = (mode: string) => {
    setGroupingMode(mode)
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with title and controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Career Network</h2>
              <p className="text-muted-foreground">
                Visualize connections between experiences, skills, and organizations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search nodes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                  <SelectItem value="organizations">Organizations</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="achievement">Achievements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Network visualization controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Link Strength</label>
                <span className="text-xs text-muted-foreground">{(linkStrength * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[linkStrength * 100]}
                min={10}
                max={100}
                step={5}
                onValueChange={(value) => setLinkStrength(value[0] / 100)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Node Repulsion</label>
                <span className="text-xs text-muted-foreground">{nodeRepulsion}</span>
              </div>
              <Slider
                value={[nodeRepulsion]}
                min={50}
                max={500}
                step={10}
                onValueChange={(value) => setNodeRepulsion(value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Select value={groupingMode} onValueChange={handleGroupingChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Grouping mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Grouping</SelectItem>
                  <SelectItem value="category">Group by Category</SelectItem>
                  <SelectItem value="chronological">Chronological</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomReset}>
                  Reset
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Network legend */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap.event.work }}></div>
              <span className="text-xs">Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap.event.education }}></div>
              <span className="text-xs">Education</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap.event.achievement }}></div>
              <span className="text-xs">Achievement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap.skill }}></div>
              <span className="text-xs">Skill</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap.organization }}></div>
              <span className="text-xs">Organization</span>
            </div>
          </div>

          {/* Network visualization */}
          <div className="relative border rounded-lg overflow-hidden" style={{ height: "500px" }}>
            <svg ref={svgRef} width="100%" height="100%"></svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-md">
                <h3 className="text-lg font-semibold mb-2">Network Visualization</h3>
                <p className="mb-4">
                  This is a placeholder for the D3.js network visualization. In a real implementation, this would show
                  an interactive network of your career events, skills, and organizations.
                </p>
                <div className="flex justify-center gap-2">
                  <Badge>10 Events</Badge>
                  <Badge>15 Skills</Badge>
                  <Badge>5 Organizations</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
