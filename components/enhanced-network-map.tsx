"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CareerData, CareerEvent, Skill } from "@/types/career"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Filter,
  Briefcase,
  Calendar,
  Award,
  Sparkles,
  Network,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import * as d3 from "d3"

interface EnhancedNetworkMapProps {
  data: CareerData
  className?: string
}

interface NetworkNode {
  id: string
  type: "job" | "education" | "project" | "milestone" | "skill"
  data: CareerEvent | Skill
  radius: number
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface NetworkLink {
  source: string
  target: string
  type: "skill" | "chronological" | "related"
  strength: number
}

export function EnhancedNetworkMap({ data, className }: EnhancedNetworkMapProps) {
  const isMobile = useMobile()
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [linkStrength, setLinkStrength] = useState(0.5)
  const [chargeStrength, setChargeStrength] = useState(-300)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [animationPhase, setAnimationPhase] = useState(0)
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null)
  
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null)
  
  // Extract all events and skills
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>()
    const linkMap = new Map<string, NetworkLink>()
    const skillMap = new Map<string, string>()
    
    // Add career events as nodes
    const allEvents = [...data.jobs, ...data.education, ...data.projects, ...data.milestones]
    
    allEvents.forEach(event => {
      const type = data.jobs.includes(event as any) 
        ? 'job' 
        : data.education.includes(event as any) 
          ? 'education' 
          : data.projects.includes(event as any) 
            ? 'project' 
            : 'milestone'
      
      const nodeId = `${type}-${event.title}-${event.startDate}`
      
      nodeMap.set(nodeId, {
        id: nodeId,
        type: type as any,
        data: event,
        radius: type === 'job' ? 20 : type === 'education' ? 18 : type === 'project' ? 16 : 14
      })
      
      // Add skills as nodes and create links
      event.skills?.forEach(skillItem => {
        const skillName = typeof skillItem === 'string' ? skillItem : skillItem.name
        const skillId = `skill-${skillName}`
        
        // Store skill ID for later reference
        skillMap.set(skillName, skillId)
        
        // Add skill node if it doesn't exist
        if (!nodeMap.has(skillId)) {
          nodeMap.set(skillId, {
            id: skillId,
            type: 'skill',
            data: typeof skillItem === 'string' ? { name: skillItem } : skillItem,
            radius: 10
          })
        }
        
        // Create link between event and skill
        const linkId = `${nodeId}-${skillId}`
        linkMap.set(linkId, {
          source: nodeId,
          target: skillId,
          type: 'skill',
          strength: 0.7
        })
      })
    })
    
    // Add chronological links between consecutive events of the same type
    const sortedJobs = [...data.jobs].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    const sortedEducation = [...data.education].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    const sortedProjects = [...data.projects].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    
    // Helper function to create chronological links
    const createChronologicalLinks = (events: CareerEvent[], type: string) => {
      for (let i = 0; i < events.length - 1; i++) {
        const currentId = `${type}-${events[i].title}-${events[i].startDate}`
        const nextId = `${type}-${events[i + 1].title}-${events[i + 1].startDate}`
        
        const linkId = `${currentId}-${nextId}`
        linkMap.set(linkId, {
          source: currentId,
          target: nextId,
          type: 'chronological',
          strength: 0.3
        })
      }
    }
    
    createChronologicalLinks(sortedJobs, 'job')
    createChronologicalLinks(sortedEducation, 'education')
    createChronologicalLinks(sortedProjects, 'project')
    
    // Add related links between events that share skills
    allEvents.forEach(event1 => {
      const event1Type = data.jobs.includes(event1 as any) 
        ? 'job' 
        : data.education.includes(event1 as any) 
          ? 'education' 
          : data.projects.includes(event1 as any) 
            ? 'project' 
            : 'milestone'
      
      const event1Id = `${event1Type}-${event1.title}-${event1.startDate}`
      const event1Skills = new Set(event1.skills?.map(s => typeof s === 'string' ? s : s.name) || [])
      
      allEvents.forEach(event2 => {
        if (event1 === event2) return
        
        const event2Type = data.jobs.includes(event2 as any) 
          ? 'job' 
          : data.education.includes(event2 as any) 
            ? 'education' 
            : data.projects.includes(event2 as any) 
              ? 'project' 
              : 'milestone'
        
        const event2Id = `${event2Type}-${event2.title}-${event2.startDate}`
        const event2Skills = new Set(event2.skills?.map(s => typeof s === 'string' ? s : s.name) || [])
        
        // Find common skills
        const commonSkills = [...event1Skills].filter(skill => event2Skills.has(skill))
        
        if (commonSkills.length > 0) {
          const linkId = `${event1Id}-${event2Id}-related`
          linkMap.set(linkId, {
            source: event1Id,
            target: event2Id,
            type: 'related',
            strength: 0.1 * commonSkills.length
          })
        }
      })
    })
    
    return {
      nodes: Array.from(nodeMap.values()),
      links: Array.from(linkMap.values())
    }
  }, [data])
  
  // Filter nodes and links based on active filter
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let nodesToShow = [...nodes]
    
    if (activeFilter) {
      if (activeFilter === 'jobs') {
        nodesToShow = nodes.filter(node => node.type === 'job' || node.type === 'skill')
      } else if (activeFilter === 'education') {
        nodesToShow = nodes.filter(node => node.type === 'education' || node.type === 'skill')
      } else if (activeFilter === 'projects') {
        nodesToShow = nodes.filter(node => node.type === 'project' || node.type === 'skill')
      } else if (activeFilter === 'milestones') {
        nodesToShow = nodes.filter(node => node.type === 'milestone' || node.type === 'skill')
      } else if (activeFilter === 'skills') {
        nodesToShow = nodes.filter(node => node.type === 'skill')
      }
    }
    
    if (highlightedSkill) {
      const skillNode = nodes.find(node => 
        node.type === 'skill' && 
        (typeof node.data === 'string' 
          ? node.data === highlightedSkill 
          : (node.data as any).name === highlightedSkill)
      )
      
      if (skillNode) {
        const connectedNodeIds = new Set<string>()
        connectedNodeIds.add(skillNode.id)
        
        links.forEach(link => {
          if (link.source === skillNode.id) connectedNodeIds.add(link.target)
          if (link.target === skillNode.id) connectedNodeIds.add(link.source)
        })
        
        nodesToShow = nodes.filter(node => connectedNodeIds.has(node.id))
      }
    }
    
    const nodeIds = new Set(nodesToShow.map(node => node.id))
    const linksToShow = links.filter(link => 
      nodeIds.has(typeof link.source === 'string' ? link.source : (link.source as any).id) && 
      nodeIds.has(typeof link.target === 'string' ? link.target : (link.target as any).id)
    )
    
    return {
      filteredNodes: nodesToShow,
      filteredLinks: linksToShow
    }
  }, [nodes, links, activeFilter, highlightedSkill])
  
  // Extract all unique skills
  const allSkills = useMemo(() => {
    return nodes
      .filter(node => node.type === 'skill')
      .map(node => (node.data as any).name)
  }, [nodes])
  
  // Initialize and update D3 force simulation
  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return
    
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    
    // Clear previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop()
    }
    
    // Create a copy of nodes with positions
    const nodesCopy = filteredNodes.map(node => ({
      ...node,
      x: node.x || width / 2 + (Math.random() - 0.5) * 100,
      y: node.y || height / 2 + (Math.random() - 0.5) * 100
    }))
    
    // Create force simulation
    const simulation = d3.forceSimulation<NetworkNode, NetworkLink>(nodesCopy)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>()
        .id(d => d.id)
        .links(filteredLinks)
        .distance(d => 100 / (d.strength || 0.1))
        .strength(d => d.strength * linkStrength)
      )
      .force('charge', d3.forceManyBody().strength(d => chargeStrength * (d.radius / 10)))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius * 1.5))
      .on('tick', () => {
        // Update node positions on each tick
        const svg = d3.select(svgRef.current)
        
        svg.selectAll<SVGLineElement, NetworkLink>('.link')
          .attr('x1', d => (typeof d.source === 'string' ? 0 : (d.source as NetworkNode).x || 0))
          .attr('y1', d => (typeof d.source === 'string' ? 0 : (d.source as NetworkNode).y || 0))
          .attr('x2', d => (typeof d.target === 'string' ? 0 : (d.target as NetworkNode).x || 0))
          .attr('y2', d => (typeof d.target === 'string' ? 0 : (d.target as NetworkNode).y || 0))
        
        svg.selectAll<SVGCircleElement, NetworkNode>('.node')
          .attr('cx', d => d.x || 0)
          .attr('cy', d => d.y || 0)
        
        svg.selectAll<SVGTextElement, NetworkNode>('.node-label')
          .attr('x', d => (d.x || 0))
          .attr('y', d => (d.y || 0) + d.radius + 12)
      })
    
    simulationRef.current = simulation
    
    // Render initial state
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    
    // Create a group for zoom/pan
    const g = svg.append('g')
      .attr('class', 'zoom-group')
    
    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoomLevel(event.transform.k)
      })
    
    svg.call(zoom)
    
    // Set initial zoom level
    svg.call(zoom.transform, d3.zoomIdentity.scale(zoomLevel))
    
    // Draw links
    g.selectAll('.link')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => {
        if (d.type === 'skill') return '#9333ea'
        if (d.type === 'chronological') return '#2563eb'
        return '#6b7280'
      })
      .attr('stroke-width', d => Math.max(1, d.strength * 3))
      .attr('stroke-opacity', d => {
        if (selectedNode) {
          const sourceId = typeof d.source === 'string' ? d.source : d.source.id
          const targetId = typeof d.target === 'string' ? d.target : d.target.id
          return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 0.8 : 0.2
        }
        return 0.5
      })
      .attr('stroke-dasharray', d => d.type === 'related' ? '5,5' : 'none')
    
    // Draw nodes
    const nodeGroups = g.selectAll('.node-group')
      .data(nodesCopy)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(selectedNode?.id === d.id ? null : d)
        event.stopPropagation()
      })
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          if (!selectedNode || selectedNode.id !== d.id) {
            d.fx = null
            d.fy = null
          }
        })
      )
    
    // Add node circles
    nodeGroups.append('circle')
      .attr('class', 'node')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        if (d.type === 'job') return '#3b82f6'
        if (d.type === 'education') return '#22c55e'
        if (d.type === 'project') return '#a855f7'
        if (d.type === 'milestone') return '#f59e0b'
        return '#94a3b8'
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => selectedNode?.id === d.id ? 3 : 1.5)
      .attr('opacity', d => {
        if (selectedNode) {
          // Check if this node is connected to the selected node
          const isConnected = filteredLinks.some(link => {
            const sourceId = typeof link.source === 'string' ? link.source : link.source.id
            const targetId = typeof link.target === 'string' ? link.target : link.target.id
            return (sourceId === selectedNode.id && targetId === d.id) || 
                   (targetId === selectedNode.id && sourceId === d.id)
          })
          return d.id === selectedNode.id || isConnected ? 1 : 0.3
        }
        return 1
      })
    
    // Add node icons
    nodeGroups.append('text')
      .attr('class', 'node-icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', d => d.radius * 0.8)
      .text(d => {
        if (d.type === 'job') return '💼'
        if (d.type === 'education') return '🎓'
        if (d.type === 'project') return '🚀'
        if (d.type === 'milestone') return '🏆'
        return '🔧'
      })
    
    // Add node labels
    nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', '10px')
      .text(d => {
        if (d.type === 'skill') return (d.data as any).name
        return (d.data as CareerEvent).title
      })
      .attr('opacity', d => d.type === 'skill' && !selectedNode ? 0.7 : 1)
      .attr('display', d => {
        // Only show labels for skills when zoomed in or when they're connected to the selected node
        if (d.type === 'skill') {
          if (zoomLevel > 1.5) return 'block'
          if (selectedNode) {
            const isConnected = filteredLinks.some(link => {
              const sourceId = typeof link.source === 'string' ? link.source : link.source.id
              const targetId = typeof link.target === 'string' ? link.target : link.target.id
              return (sourceId === selectedNode.id && targetId === d.id) || 
                     (targetId === selectedNode.id && sourceId === d.id)
            })
            return isConnected ? 'block' : 'none'
          }
          return 'none'
        }
        return 'block'
      })
    
    // Clear selection when clicking on the background
    svg.on('click', () => {
      setSelectedNode(null)
    })
    
    return () => {
      simulation.stop()
    }
  }, [filteredNodes, filteredLinks, linkStrength, chargeStrength, zoomLevel, selectedNode])
  
  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase(prev => (prev < 3 ? prev + 1 : prev))
    }, 800)
    
    return () => clearTimeout(timer)
  }, [animationPhase])
  
  // Get node type icon
  const getNodeIcon = (type: string) => {
    if (type === 'job') return <Briefcase className="h-4 w-4" />
    if (type === 'education') return <Calendar className="h-4 w-4" />
    if (type === 'project') return <Sparkles className="h-4 w-4" />
    if (type === 'milestone') return <Award className="h-4 w-4" />
    return <Network className="h-4 w-4" />
  }
  
  return (
    <div 
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground shadow",
        isExpanded ? "fixed inset-4 z-50" : "w-full",
        className
      )}
      ref={containerRef}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Career Network</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="all" onClick={() => setActiveFilter(null)}>All</TabsTrigger>
            <TabsTrigger value="jobs" onClick={() => setActiveFilter('jobs')}>Jobs</TabsTrigger>
            <TabsTrigger value="education" onClick={() => setActiveFilter('education')}>Education</TabsTrigger>
            <TabsTrigger value="projects" onClick={() => setActiveFilter('projects')}>Projects</TabsTrigger>
            <TabsTrigger value="milestones" onClick={() => setActiveFilter('milestones')}>Milestones</TabsTrigger>
            <TabsTrigger value="skills" onClick={() => setActiveFilter('skills')}>Skills</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {allSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" /> Skills
            </Badge>
            {allSkills.slice(0, 15).map(skill => (
              <Badge 
                key={skill}
                variant={highlightedSkill === skill ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setHighlightedSkill(highlightedSkill === skill ? null : skill)}
              >
                {skill}
              </Badge>
            ))}
            {allSkills.length > 15 && (
              <Badge variant="outline">+{allSkills.length - 15} more</Badge>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Link Strength</span>
            <Slider 
              value={[linkStrength * 100]} 
              min={10} 
              max={100} 
              step={10}
              onValueChange={([value]) => setLinkStrength(value / 100)}
              className="w-48"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Node Repulsion</span>
            <Slider 
              value={[Math.abs(chargeStrength)]} 
              min={100} 
              max={1000} 
              step={50}
              onValueChange={([value]) => setChargeStrength(-value)}
              className="w-48"
            />
          </div>
        </div>
        
        <div className="relative">
          <svg 
            ref={svgRef} 
            className="w-full border rounded-lg bg-white/5"
            style={{ height: isExpanded ? 'calc(100vh - 300px)' : '500px' }}
            onClick={() => setSelectedNode(null)}
          />
          
          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => {
                if (svgRef.current) {
                  const svg = d3.select(svgRef.current)
                  const zoom = d3.zoom<SVGSVGElement, unknown>()
                  svg.transition().call(zoom.scaleBy, 1.2)
                }
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => {
                if (svgRef.current) {
                  const svg = d3.select(svgRef.current)
                  const zoom = d3.zoom<SVGSVGElement, unknown>()
                  svg.transition().call(zoom.scaleBy, 0.8)
                }
              }}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Selected node details */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div 
                className="absolute left-4 bottom-4 w-64"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {getNodeIcon(selectedNode.type)}
                          <h4 className="font-semibold">
                            {selectedNode.type === 'skill'
