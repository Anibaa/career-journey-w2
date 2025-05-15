"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  MapPin,
  Target,
  Award,
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
  Link2,
  FileText,
  ExternalLink,
  Info,
  Tag,
  Users,
  Code,
  Layout,
  Code2,
  Palette,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EnhancedParticleCanvas } from "@/components/enhanced-particle-canvas"

// Types for our career data
interface Media {
  type: "image" | "video"
  url: string
  thumbnail?: string
  caption: string
}

interface DateEvent {
  id: string
  date: string
  title: string
  description: string
  achievements: string[]
  media: Media
  links?: Array<{
    title: string
    url: string
  }>
  tags?: string[]
}

interface CareerEntry {
  id: number
  title: string
  company: string
  location: string
  period: string
  startDate: string
  endDate: string
  color: string
  description: string
  missions: string[]
  skills: string[]
  image: string
  icon: string
  detailedEvents: DateEvent[]
  collaborators?: Array<{
    name: string
    role: string
    avatar?: string
  }>
  keyMetrics?: Array<{
    label: string
    value: string
    icon?: string
  }>
}

// Sample career data with enhanced details
const careerData: CareerEntry[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    period: "Jan 2020 - Present",
    startDate: "2020-01-15",
    endDate: "present",
    color: "#10b981", // emerald-500
    description:
      "Leading the development of cloud-based solutions for enterprise clients. Responsible for architecture decisions and mentoring junior developers. Implemented CI/CD pipelines that reduced deployment time by 40%.",
    missions: [
      "Redesigned the microservices architecture resulting in 30% improved performance",
      "Led a team of 5 developers to deliver a major product update ahead of schedule",
      "Implemented automated testing strategies that increased code coverage to 85%",
    ],
    skills: ["React", "Node.js", "AWS", "Docker", "Kubernetes", "TypeScript", "GraphQL"],
    image: "/placeholder.svg?height=400&width=600",
    icon: "Briefcase",
    collaborators: [
      { name: "Sarah Johnson", role: "Product Manager", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Michael Chen", role: "UX Designer", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "David Kim", role: "DevOps Engineer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    keyMetrics: [
      { label: "Projects Delivered", value: "12", icon: "CheckCircle" },
      { label: "Team Size", value: "8", icon: "Users" },
      { label: "Code Coverage", value: "85%", icon: "Code" },
    ],
    detailedEvents: [
      {
        id: "1-1",
        date: "Mar 2023",
        title: "Project Lead - Enterprise Dashboard",
        description:
          "Led the development of a comprehensive enterprise dashboard that consolidated data from multiple sources. The dashboard provided real-time analytics and actionable insights for C-level executives. Implemented advanced data visualization components and optimized data processing algorithms to handle large datasets efficiently.\n\nThe project involved close collaboration with data scientists and business analysts to ensure that the dashboard met the specific needs of different stakeholders. We conducted multiple user testing sessions to refine the interface and improve the user experience.",
        achievements: [
          "Reduced data processing time by 60% through optimized algorithms",
          "Implemented real-time data visualization that handled over 10,000 data points",
          "Integrated with 5 different data sources using custom API adapters",
          "Received company-wide recognition for innovation and technical excellence",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Enterprise Dashboard UI showing real-time analytics",
        },
        links: [
          { title: "Project Documentation", url: "https://example.com/docs" },
          { title: "Technical Presentation", url: "https://example.com/presentation" },
        ],
        tags: ["Dashboard", "Data Visualization", "Enterprise", "React"],
      },
      {
        id: "1-2",
        date: "Sep 2022",
        title: "Architecture Redesign Initiative",
        description:
          "Spearheaded a complete architecture redesign to improve scalability and performance. Migrated from a monolithic structure to a microservices architecture using Kubernetes and Docker. This initiative resulted in significant improvements in system reliability and development efficiency.\n\nThe redesign involved breaking down the existing monolith into logical service boundaries, implementing inter-service communication patterns, and establishing robust monitoring and observability solutions. We also implemented automated deployment pipelines to streamline the release process.",
        achievements: [
          "Reduced system downtime by 90% through improved fault tolerance",
          "Decreased deployment time from hours to minutes with automated CI/CD",
          "Improved developer productivity by enabling parallel development streams",
          "Established architecture patterns that became company standards",
        ],
        media: {
          type: "video",
          url: "https://example.com/architecture-presentation.mp4",
          thumbnail: "/placeholder.svg?height=300&width=500",
          caption: "Architecture presentation at company tech talk",
        },
        links: [
          { title: "Architecture Diagram", url: "https://example.com/architecture" },
          { title: "Migration Strategy Document", url: "https://example.com/migration" },
        ],
        tags: ["Microservices", "Kubernetes", "Docker", "DevOps"],
      },
      {
        id: "1-3",
        date: "Apr 2021",
        title: "Team Expansion & Mentorship Program",
        description:
          "Established a structured mentorship program for junior developers as the team expanded from 3 to 12 members. Created comprehensive onboarding materials and coding standards documentation. Conducted weekly knowledge-sharing sessions on advanced topics.\n\nThe program included pair programming sessions, code reviews, and regular feedback mechanisms to ensure continuous improvement. We also organized hackathons and innovation days to foster creativity and collaboration within the team.",
        achievements: [
          "Reduced onboarding time for new developers from 4 weeks to 2 weeks",
          "Improved code quality metrics by 40% through standardized practices",
          "Facilitated 15 technical workshops covering advanced development topics",
          "Increased team retention rate by 25% through improved engagement",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Team photo after successful product launch",
        },
        tags: ["Mentorship", "Team Building", "Knowledge Sharing"],
      },
      {
        id: "1-4",
        date: "Jan 2020",
        title: "Initial Role & Responsibilities",
        description:
          "Joined Tech Innovations as a Senior Software Engineer with initial responsibilities focused on improving the existing product infrastructure and establishing development best practices. Conducted a comprehensive audit of the codebase and created a roadmap for technical debt reduction.\n\nInitial projects involved optimizing database queries, implementing caching strategies, and refactoring critical components to improve maintainability. Also established automated testing practices to ensure code quality and prevent regressions.",
        achievements: [
          "Identified and resolved 25 critical performance bottlenecks",
          "Established coding standards and review processes",
          "Implemented automated testing that caught 30% more bugs before production",
          "Created documentation for key system components",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "First day at Tech Innovations office",
        },
        tags: ["Code Quality", "Performance Optimization", "Testing"],
      },
    ],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    location: "Boston, MA",
    period: "Mar 2017 - Dec 2019",
    startDate: "2017-03-01",
    endDate: "2019-12-15",
    color: "#3b82f6", // blue-500
    description:
      "Developed and maintained web applications for clients in the finance sector. Collaborated with UX designers to implement responsive interfaces and optimize user experiences across devices.",
    missions: [
      "Built a real-time dashboard for financial data visualization used by over 5,000 users",
      "Optimized database queries resulting in 50% faster page load times",
      "Integrated third-party payment gateways for a new e-commerce platform",
    ],
    skills: ["JavaScript", "Python", "PostgreSQL", "Redis", "GraphQL", "React", "Django"],
    image: "/placeholder.svg?height=400&width=600",
    icon: "Code",
    collaborators: [
      { name: "Emily Wong", role: "UX Designer", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Robert Taylor", role: "Project Manager", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    keyMetrics: [
      { label: "Client Projects", value: "8", icon: "Briefcase" },
      { label: "Avg. Performance Improvement", value: "45%", icon: "TrendingUp" },
    ],
    detailedEvents: [
      {
        id: "2-1",
        date: "Oct 2019",
        title: "Financial Dashboard Project",
        description:
          "Designed and implemented a comprehensive financial dashboard for a major banking client. The dashboard provided real-time insights into market trends, portfolio performance, and risk assessments. Integrated with multiple financial data providers and implemented complex data visualization components.\n\nThe project required extensive knowledge of financial instruments and market data structures. Worked closely with financial analysts to ensure accurate representation of complex financial metrics and indicators.",
        achievements: [
          "Delivered a solution that processed over 1 million financial transactions daily",
          "Implemented responsive design that maintained performance across all devices",
          "Created custom data visualization components that became company standards",
          "Received client commendation for exceeding project requirements",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Financial dashboard showing market analytics",
        },
        links: [
          { title: "Case Study", url: "https://example.com/case-study" },
          { title: "Client Testimonial", url: "https://example.com/testimonial" },
        ],
        tags: ["Finance", "Dashboard", "Data Visualization", "React"],
      },
      {
        id: "2-2",
        date: "May 2019",
        title: "Database Optimization Initiative",
        description:
          "Led a database optimization project that significantly improved application performance. Analyzed query patterns, implemented indexing strategies, and refactored database schema to eliminate bottlenecks. Introduced caching mechanisms and query optimization techniques.\n\nThe optimization process involved profiling existing queries, identifying performance bottlenecks, and implementing both schema-level and query-level optimizations. Also implemented a comprehensive monitoring solution to track database performance metrics over time.",
        achievements: [
          "Reduced average query time from 1.2 seconds to 0.3 seconds",
          "Implemented database sharding strategy that improved scalability",
          "Created automated performance monitoring tools for ongoing optimization",
          "Documented optimization techniques for future reference",
        ],
        media: {
          type: "video",
          url: "https://example.com/database-presentation.mp4",
          thumbnail: "/placeholder.svg?height=300&width=500",
          caption: "Database optimization presentation to technical team",
        },
        tags: ["Database", "Performance", "PostgreSQL", "Optimization"],
      },
      {
        id: "2-3",
        date: "Jan 2018",
        title: "E-commerce Payment Integration",
        description:
          "Developed a secure payment processing system for an e-commerce platform. Integrated multiple payment gateways including Stripe, PayPal, and local banking solutions. Implemented robust error handling and transaction reconciliation processes.\n\nThe system needed to handle various payment methods, currencies, and regional compliance requirements. Security was a primary concern, requiring implementation of encryption, tokenization, and compliance with PCI DSS standards.",
        achievements: [
          "Processed over $2 million in transactions within the first quarter",
          "Achieved PCI DSS compliance for all payment processing systems",
          "Reduced payment processing failures by 75% through improved error handling",
          "Implemented fraud detection mechanisms that saved an estimated $150,000",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Payment system architecture diagram",
        },
        links: [
          { title: "Security Whitepaper", url: "https://example.com/security" },
          { title: "Integration Documentation", url: "https://example.com/integration" },
        ],
        tags: ["E-commerce", "Payments", "Security", "API Integration"],
      },
      {
        id: "2-4",
        date: "Mar 2017",
        title: "Initial Position & Projects",
        description:
          "Joined Digital Solutions as a Full Stack Developer working on financial technology applications. Initial responsibilities included maintaining existing client applications and contributing to new feature development for the company's flagship products.\n\nEarly projects focused on implementing new features, fixing bugs, and improving the overall user experience of the company's financial applications. Quickly became proficient in the company's technology stack and development processes.",
        achievements: [
          "Contributed to 5 major feature releases within first 6 months",
          "Resolved 120+ backlog issues improving overall system stability",
          "Introduced unit testing practices that were adopted company-wide",
          "Received early promotion based on performance and contributions",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "First team meeting at Digital Solutions",
        },
        tags: ["Fintech", "Full Stack", "Feature Development"],
      },
    ],
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Creative Web Agency",
    location: "New York, NY",
    period: "Jun 2015 - Feb 2017",
    startDate: "2015-06-15",
    endDate: "2017-02-28",
    color: "#8b5cf6", // violet-500
    description:
      "Created responsive and interactive web experiences for various clients. Focused on accessibility and cross-browser compatibility while maintaining high visual standards.",
    missions: [
      "Developed the frontend for an award-winning marketing campaign website",
      "Implemented accessibility improvements that brought the site to WCAG 2.1 AA compliance",
      "Created reusable component library that reduced development time by 25%",
    ],
    skills: ["HTML5", "CSS3", "JavaScript", "Vue.js", "SASS", "Accessibility", "Animation"],
    image: "/placeholder.svg?height=400&width=600",
    icon: "Layout",
    collaborators: [
      { name: "Jessica Lee", role: "Creative Director", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Thomas Brown", role: "UI Designer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    keyMetrics: [
      { label: "Client Projects", value: "15", icon: "Briefcase" },
      { label: "Design Awards", value: "3", icon: "Award" },
    ],
    detailedEvents: [
      {
        id: "3-1",
        date: "Dec 2016",
        title: "Award-Winning Marketing Campaign",
        description:
          "Led frontend development for a major marketing campaign website that won industry recognition for its innovative design and user experience. Implemented complex animations and interactive elements while maintaining performance across all devices.\n\nThe campaign website featured parallax scrolling, WebGL animations, and interactive storytelling elements. Despite the rich media content, the site maintained excellent performance metrics and accessibility standards.",
        achievements: [
          "Site won 'Best Digital Campaign' at the Annual Marketing Awards",
          "Achieved 98/100 Google PageSpeed score despite rich media content",
          "Implemented innovative scroll-based animations that became case studies",
          "Featured in web design publications for technical implementation",
        ],
        media: {
          type: "video",
          url: "https://example.com/campaign-showcase.mp4",
          thumbnail: "/placeholder.svg?height=300&width=500",
          caption: "Marketing campaign website showcase",
        },
        links: [
          { title: "Award Announcement", url: "https://example.com/award" },
          { title: "Case Study", url: "https://example.com/case-study" },
        ],
        tags: ["Marketing", "Animation", "Interactive", "Award-Winning"],
      },
      {
        id: "3-2",
        date: "Aug 2016",
        title: "Accessibility Compliance Project",
        description:
          "Spearheaded an initiative to bring all client websites into WCAG 2.1 AA compliance. Conducted comprehensive audits, implemented necessary changes, and established accessibility guidelines for future projects. Trained team members on accessibility best practices.\n\nThe project involved working with screen readers, keyboard navigation, and other assistive technologies to ensure that all websites were fully accessible. Created documentation and training materials to help the team maintain accessibility standards in future projects.",
        achievements: [
          "Brought 12 client websites into full WCAG 2.1 AA compliance",
          "Created an accessibility checklist that became standard in development workflow",
          "Reduced accessibility-related issues in new projects by 90%",
          "Conducted 5 training sessions on accessibility best practices",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Accessibility testing session with team",
        },
        tags: ["Accessibility", "WCAG", "Training", "Best Practices"],
      },
      {
        id: "3-3",
        date: "Mar 2016",
        title: "Component Library Development",
        description:
          "Designed and implemented a comprehensive component library that standardized UI elements across all client projects. Created detailed documentation and usage examples. The library significantly reduced development time and improved consistency.\n\nThe component library included form elements, navigation components, cards, modals, and other common UI patterns. Each component was thoroughly tested for accessibility, performance, and cross-browser compatibility.",
        achievements: [
          "Reduced UI development time by 25% through reusable components",
          "Improved design consistency across 20+ client projects",
          "Created interactive documentation that facilitated rapid adoption",
          "Implemented automated testing for all components",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Component library documentation interface",
        },
        links: [{ title: "Component Documentation", url: "https://example.com/components" }],
        tags: ["Component Library", "Documentation", "Reusability", "UI"],
      },
      {
        id: "3-4",
        date: "Jun 2015",
        title: "Initial Role & Responsibilities",
        description:
          "Joined Creative Web Agency as a Frontend Developer responsible for implementing designs for client websites. Initial focus was on creating responsive layouts and ensuring cross-browser compatibility for agency clients in retail and entertainment sectors.\n\nEarly projects involved translating design mockups into responsive, interactive websites. Quickly adapted to the agency's workflow and became proficient in their preferred technologies and tools.",
        achievements: [
          "Completed onboarding and delivered first client project within 3 weeks",
          "Introduced responsive design techniques that improved mobile experience",
          "Optimized image loading strategies that reduced page load times by 40%",
          "Received positive feedback from clients on attention to detail",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "First client project mockup review",
        },
        tags: ["Frontend", "Responsive Design", "Client Work"],
      },
    ],
  },
  {
    id: 4,
    title: "Junior Web Developer",
    company: "StartUp Ventures",
    location: "Austin, TX",
    period: "Sep 2013 - May 2015",
    startDate: "2013-09-01",
    endDate: "2015-05-31",
    color: "#ec4899", // pink-500
    description:
      "Assisted in the development of web applications for early-stage startups. Gained experience in agile methodologies and rapid prototyping while working in a fast-paced environment.",
    missions: [
      "Contributed to the development of an MVP that secured $2M in funding",
      "Built and maintained the company website and blog platform",
      "Participated in user testing sessions to gather feedback for product improvements",
    ],
    skills: ["HTML", "CSS", "jQuery", "PHP", "MySQL", "WordPress", "Agile"],
    image: "/placeholder.svg?height=400&width=600",
    icon: "Code2",
    collaborators: [
      { name: "Alex Rivera", role: "CTO", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Samantha Lee", role: "Product Owner", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    keyMetrics: [
      { label: "Startup Clients", value: "6", icon: "Rocket" },
      { label: "Features Shipped", value: "45", icon: "Package" },
    ],
    detailedEvents: [
      {
        id: "4-1",
        date: "Feb 2015",
        title: "Funding Pitch MVP",
        description:
          "Developed a minimum viable product for a startup's funding pitch that successfully secured $2M in Series A funding. Created an interactive prototype that demonstrated the core functionality and potential of the product.\n\nThe MVP focused on the key differentiating features of the product, with an emphasis on user experience and visual polish. Worked closely with the founding team to refine the product based on feedback from potential investors.",
        achievements: [
          "Delivered MVP two weeks ahead of schedule",
          "Implemented key features that differentiated the product from competitors",
          "Created demo scripts that were used in investor presentations",
          "Contributed to pitch deck technical sections",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "MVP demonstration during investor pitch",
        },
        links: [{ title: "Funding Announcement", url: "https://example.com/funding" }],
        tags: ["MVP", "Startup", "Funding", "Product Development"],
      },
      {
        id: "4-2",
        date: "Sep 2014",
        title: "Company Website Redesign",
        description:
          "Led the complete redesign of the company website to improve brand perception and user engagement. Implemented modern design principles and optimized for conversion. The new website significantly improved lead generation and user engagement metrics.\n\nThe redesign included a complete overhaul of the site architecture, content strategy, and visual design. Implemented analytics tracking to measure the impact of the changes and inform future optimizations.",
        achievements: [
          "Increased website conversion rate by 35%",
          "Reduced bounce rate from 65% to 40%",
          "Implemented SEO best practices that improved organic traffic by 50%",
          "Created a custom CMS solution for easy content updates",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Before and after comparison of website redesign",
        },
        tags: ["Website Redesign", "SEO", "Conversion Optimization", "UX"],
      },
      {
        id: "4-3",
        date: "Sep 2013",
        title: "Initial Role & Projects",
        description:
          "Joined StartUp Ventures as a Junior Web Developer working on various client projects. Responsibilities included implementing designs, fixing bugs, and contributing to feature development under the guidance of senior developers.\n\nInitial projects involved working with early-stage startups to build their web presence and product prototypes. Gained valuable experience in agile development methodologies and the startup ecosystem.",
        achievements: [
          "Completed training program and became productive team member within 4 weeks",
          "Contributed code to 8 different client projects in first quarter",
          "Received recognition for attention to detail and problem-solving skills",
          "Implemented responsive design principles across all projects",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "First day at StartUp Ventures office",
        },
        tags: ["Junior Developer", "Startups", "Web Development"],
      },
    ],
  },
  {
    id: 5,
    title: "Web Design Intern",
    company: "Design Studio Co.",
    location: "Chicago, IL",
    period: "May 2012 - Aug 2013",
    startDate: "2012-05-01",
    endDate: "2013-08-31",
    color: "#f59e0b", // amber-500
    description:
      "Assisted senior designers with website layouts and implemented designs using HTML and CSS. Participated in client meetings and contributed to brainstorming sessions for new projects.",
    missions: [
      "Redesigned the company portfolio website resulting in 35% increase in inquiries",
      "Created wireframes and mockups for client presentations",
      "Learned and applied responsive design principles to existing projects",
    ],
    skills: ["Photoshop", "Illustrator", "HTML", "CSS", "WordPress", "UI Design", "Wireframing"],
    image: "/placeholder.svg?height=400&width=600",
    icon: "Palette",
    collaborators: [
      { name: "James Wilson", role: "Creative Director", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Lisa Chen", role: "Senior Designer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    keyMetrics: [
      { label: "Design Projects", value: "12", icon: "Palette" },
      { label: "Client Satisfaction", value: "98%", icon: "ThumbsUp" },
    ],
    detailedEvents: [
      {
        id: "5-1",
        date: "May 2013",
        title: "Portfolio Website Redesign",
        description:
          "Led the redesign of the company's portfolio website to showcase recent projects and improve lead generation. Implemented modern design principles and optimized for conversion. The new website significantly improved client inquiries.\n\nThe redesign focused on highlighting the studio's best work with large, immersive project showcases. Implemented filtering and categorization to help potential clients find relevant examples of the studio's capabilities.",
        achievements: [
          "Increased client inquiries by 35% following launch",
          "Implemented responsive design that improved mobile user experience",
          "Created a custom CMS solution for easy portfolio updates",
          "Received praise from company leadership for initiative and execution",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Portfolio website homepage design",
        },
        links: [{ title: "Design Process Documentation", url: "https://example.com/process" }],
        tags: ["Portfolio", "Web Design", "Responsive", "CMS"],
      },
      {
        id: "5-2",
        date: "May 2012",
        title: "Internship Start",
        description:
          "Started internship at Design Studio Co., assisting senior designers with website layouts and implementing designs using HTML and CSS. Participated in client meetings and contributed to brainstorming sessions for new projects.\n\nThe internship provided valuable exposure to professional design processes and client interactions. Quickly progressed from basic implementation tasks to contributing design ideas and solutions for client projects.",
        achievements: [
          "Completed 3 client projects within first 2 months",
          "Received positive feedback from senior designers and clients",
          "Learned industry-standard design tools and workflows",
          "Transitioned from intern to part-time employee based on performance",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "First design mockup created during internship",
        },
        tags: ["Internship", "Web Design", "Professional Development"],
      },
    ],
  },
]

export function CareerJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapView, setMapView] = useState<"immersive" | "timeline" | "network" | "3d">("immersive")
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const activeCareer = careerData[activeIndex]

  // Find the active event based on activeEventId
  const activeEvent = useMemo(() => {
    if (!activeEventId) return activeCareer.detailedEvents[0]
    return activeCareer.detailedEvents.find((event) => event.id === activeEventId) || activeCareer.detailedEvents[0]
  }, [activeCareer, activeEventId])

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setDirection(-1)
      setActiveIndex(activeIndex - 1)
      setActiveTab("overview")
      setActiveEventId(null)
    }
  }

  const goToNext = () => {
    if (activeIndex < careerData.length - 1) {
      setDirection(1)
      setActiveIndex(activeIndex + 1)
      setActiveTab("overview")
      setActiveEventId(null)
    }
  }

  const goToPosition = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setActiveTab("overview")
    setActiveEventId(null)
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
            <div
              ref={mapRef}
              className="overflow-x-auto hide-scrollbar cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <EnhancedTimelineMapView activeIndex={activeIndex} goToPosition={goToPosition} />
            </div>
          )}
          {mapView === "network" && (
            <div ref={networkRef} className="overflow-hidden">
              <EnhancedNetworkMapView activeIndex={activeIndex} goToPosition={goToPosition} />
            </div>
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
            <span>Previous</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={activeIndex === careerData.length - 1}
            className="rounded-full"
          >
            <span>Next</span>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Detailed Timeline</TabsTrigger>
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
                    <h3 className="text-lg font-semibold mb-2">Skills & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCareer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {activeCareer.collaborators && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-emerald-600" />
                        Key Collaborators
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {activeCareer.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                              {collaborator.avatar && (
                                <Image
                                  src={collaborator.avatar || "/placeholder.svg"}
                                  alt={collaborator.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{collaborator.name}</div>
                              <div className="text-xs text-slate-500">{collaborator.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCareer.keyMetrics && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-emerald-600" />
                        Key Metrics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {activeCareer.keyMetrics.map((metric, index) => (
                          <div key={index} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold" style={{ color: activeCareer.color }}>
                              {metric.value}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Section */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={activeCareer.image || "/placeholder.svg"}
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

                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeCareer.detailedEvents.map((event) => (
                          <Badge
                            key={event.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => {
                              setActiveTab("timeline")
                              setActiveEventId(event.id)
                            }}
                          >
                            {event.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                      Timeline Events
                    </h3>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {activeCareer.detailedEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-all",
                              event.id === activeEventId
                                ? "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-l-4"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800",
                            )}
                            style={event.id === activeEventId ? { borderLeftColor: activeCareer.color } : {}}
                            onClick={() => setActiveEventId(event.id)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-slate-500 mt-1">{event.date}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Event Details */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeEvent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <h3 className="text-xl font-bold">{activeEvent.title}</h3>
                            <Badge variant="outline" className="mt-2 md:mt-0 w-fit">
                              {activeEvent.date}
                            </Badge>
                          </div>

                          {/* Media */}
                          <div className="mb-6">
                            <div className="relative rounded-lg overflow-hidden">
                              {activeEvent.media.type === "image" ? (
                                <div className="relative aspect-video w-full">
                                  <Image
                                    src={activeEvent.media.url || "/placeholder.svg"}
                                    alt={activeEvent.media.caption}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
                                  <div className="absolute inset-0">
                                    <Image
                                      src={activeEvent.media.thumbnail || "/placeholder.svg"}
                                      alt={activeEvent.media.caption}
                                      fill
                                      className="object-cover opacity-70"
                                    />
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full bg-white/20 backdrop-blur-sm"
                                  >
                                    <Play className="h-6 w-6 text-white" />
                                    <span className="sr-only">Play video</span>
                                  </Button>
                                </div>
                              )}
                              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                                {activeEvent.media.caption}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold mb-3 flex items-center">
                              <Info className="h-4 w-4 mr-2" style={{ color: activeCareer.color }} />
                              Description
                            </h4>
                            <div className="text-slate-700 dark:text-slate-300 space-y-4">
                              {activeEvent.description.split("\n\n").map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                              ))}
                            </div>
                          </div>

                          {/* Achievements */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold mb-3 flex items-center">
                              <Star className="h-4 w-4 mr-2" style={{ color: activeCareer.color }} />
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {activeEvent.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                  <span
                                    className="inline-block w-1.5 h-1.5 rounded-full mt-2 mr-2"
                                    style={{ backgroundColor: activeCareer.color }}
                                  />
                                  <span className="text-slate-700 dark:text-slate-300">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Links */}
                          {activeEvent.links && activeEvent.links.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-md font-semibold mb-3 flex items-center">
                                <Link2 className="h-4 w-4 mr-2" style={{ color: activeCareer.color }} />
                                Related Links
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {activeEvent.links.map((link, index) => (
                                  <Button key={index} variant="outline" size="sm" className="gap-1.5" asChild>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                      <FileText className="h-3.5 w-3.5" />
                                      {link.title}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {activeEvent.tags && activeEvent.tags.length > 0 && (
                            <div>
                              <h4 className="text-md font-semibold mb-3 flex items-center">
                                <Tag className="h-4 w-4 mr-2" style={{ color: activeCareer.color }} />
                                Tags
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {activeEvent.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
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

function EnhancedTimelineMapView({ activeIndex, goToPosition }: MapViewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Calculate dates for timeline
  const timelineData = useMemo(() => {
    const startDate = new Date(careerData[careerData.length - 1].startDate).getFullYear()
    const endDate = new Date().getFullYear()
    const years = []

    for (let year = startDate; year <= endDate; year++) {
      years.push(year)
    }

    return years
  }, [])

  return (
    <div className="relative min-w-max py-8">
      {/* Timeline Years */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-slate-500 dark:text-slate-400">
        {timelineData.map((year, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700 mb-1"></div>
            <span>{year}</span>
          </div>
        ))}
      </div>

      {/* Timeline Path */}
      <div className="relative mx-8 mb-8">
        {/* Main Timeline Line */}
        <div className="absolute top-16 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-full shadow-lg"></div>

        {/* Career Nodes */}
        <div className="flex items-center relative">
          {careerData.map((career, index) => {
            // Calculate position based on dates
            const startYear = new Date(career.startDate).getFullYear()
            const endYear =
              career.endDate === "present" ? new Date().getFullYear() : new Date(career.endDate).getFullYear()
            const startPos = ((startYear - timelineData[0]) / (timelineData.length - 1)) * 100
            const endPos = ((endYear - timelineData[0]) / (timelineData.length - 1)) * 100
            const width = endPos - startPos

            return (
              <div
                key={career.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${startPos}%`, width: `${width}%` }}
              >
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => goToPosition(index)}
                          className={cn(
                            "relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                            index === activeIndex
                              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md"
                              : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                          )}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          animate={index === activeIndex ? { y: -10 } : {}}
                          aria-label={`View ${career.title} at ${career.company}`}
                        >
                          {career.icon === "Briefcase" && <Briefcase className="w-6 h-6" />}
                          {career.icon === "Code" && <Code className="w-6 h-6" />}
                          {career.icon === "Layout" && <Layout className="w-6 h-6" />}
                          {career.icon === "Code2" && <Code2 className="w-6 h-6" />}
                          {career.icon === "Palette" && <Palette className="w-6 h-6" />}
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

                  {/* Career Period Bar */}
                  <div
                    className={cn(
                      "absolute top-20 left-0 h-3 rounded-full transition-all duration-300",
                      index === activeIndex || index === hoveredIndex
                        ? "opacity-100 bg-gradient-to-r shadow-md"
                        : "opacity-50 bg-slate-300 dark:bg-slate-700",
                    )}
                    style={{
                      width: "100%",
                      backgroundImage:
                        index === activeIndex || index === hoveredIndex
                          ? `linear-gradient(to right, ${career.color}, ${career.color}90)`
                          : "none",
                    }}
                  />

                  {/* Career Info Card */}
                  <AnimatePresence>
                    {(index === activeIndex || index === hoveredIndex) && (
                      <motion.div
                        className={cn(
                          "absolute mt-8 w-64 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md",
                          index === activeIndex ? "top-24" : "top-24 opacity-90",
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                          borderLeft: `4px solid ${career.color}`,
                        }}
                      >
                        <div className="font-semibold mb-1" style={{ color: career.color }}>
                          {career.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{career.company}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{career.period}</div>

                        {index === activeIndex && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"
                          >
                            <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                              {career.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {career.skills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {career.skills.length > 3 && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  +{career.skills.length - 3}
                                </span>
                              )}
                            </div>
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
      </div>

      {/* Timeline Milestones */}
      <div className="mt-40 mx-8 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700" />

        {activeIndex !== null && (
          <div className="space-y-8">
            {careerData[activeIndex].detailedEvents.map((event, eventIndex) => (
              <div key={event.id} className="relative pl-8">
                <div className="absolute left-[-9px] top-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-4 border-emerald-500 z-10" />

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{event.title}</h4>
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {event.description.split("\n")[0]}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags &&
                      event.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EnhancedNetworkMapView({ activeIndex, goToPosition }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 })

  // Calculate node positions in a force-directed layout simulation
  const nodePositions = useMemo(() => {
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2
    const radius = Math.min(centerX, centerY) * 0.6

    return careerData.map((_, index) => {
      const angle = (index / careerData.length) * Math.PI * 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return { x, y }
    })
  }, [containerSize])

  // Calculate connections between nodes
  const connections = useMemo(() => {
    const result = []

    // Direct career progression connections
    for (let i = 0; i < careerData.length - 1; i++) {
      result.push({
        source: i,
        target: i + 1,
        type: "direct",
        strength: 3,
      })
    }

    // Skill-based connections
    for (let i = 0; i < careerData.length; i++) {
      for (let j = i + 1; j < careerData.length; j++) {
        const sourceSkills = new Set(careerData[i].skills)
        const targetSkills = new Set(careerData[j].skills)
        const commonSkills = [...sourceSkills].filter((skill) => targetSkills.has(skill))

        if (commonSkills.length > 0) {
          result.push({
            source: i,
            target: j,
            type: "skill",
            strength: commonSkills.length,
            skills: commonSkills,
          })
        }
      }
    }

    return result
  }, [])

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

  return (
    <div ref={containerRef} className="relative h-[600px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
      {/* Background Grid */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connection Lines */}
        <g>
          {connections.map((connection, index) => {
            const source = nodePositions[connection.source]
            const target = nodePositions[connection.target]
            const isActive = connection.source === activeIndex || connection.target === activeIndex
            const isHovered = connection.source === hoveredNode || connection.target === hoveredNode

            // Calculate control points for curved lines
            const midX = (source.x + target.x) / 2
            const midY = (source.y + target.y) / 2
            const dx = target.x - source.x
            const dy = target.y - source.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Perpendicular offset for curve
            const offsetX = -dy * 0.2
            const offsetY = dx * 0.2

            // Different curve for different connection types
            const curve =
              connection.type === "direct"
                ? `M ${source.x} ${source.y} L ${target.x} ${target.y}`
                : `M ${source.x} ${source.y} Q ${midX + offsetX} ${midY + offsetY} ${target.x} ${target.y}`

            return (
              <g key={`connection-${index}`}>
                <path
                  d={curve}
                  stroke={isActive || isHovered ? careerData[connection.source].color : "#cbd5e1"}
                  strokeWidth={isActive || isHovered ? 3 : 1 + connection.strength * 0.5}
                  fill="none"
                  strokeDasharray={connection.type === "direct" ? "0" : "5,5"}
                  opacity={isActive || isHovered ? 1 : 0.6}
                  className="transition-all duration-300"
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
          {careerData.map((career, index) => {
            const { x, y } = nodePositions[index]
            const isActive = index === activeIndex
            const isHovered = index === hoveredNode

            return (
              <g
                key={career.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => goToPosition(index)}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Node highlight effect */}
                <circle
                  r={isActive || isHovered ? 50 : 0}
                  fill={`${career.color}20`}
                  className="transition-all duration-500"
                />

                {/* Node circle */}
                <circle
                  r={isActive ? 40 : isHovered ? 35 : 30}
                  fill={isActive || isHovered ? career.color : `${career.color}40`}
                  stroke={isActive || isHovered ? "white" : "transparent"}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Node icon */}
                <foreignObject x={-15} y={-15} width={30} height={30} className="pointer-events-none">
                  <div className="flex items-center justify-center w-full h-full text-white">
                    {getNodeIcon(career.icon)}
                  </div>
                </foreignObject>

                {/* Node label */}
                <text
                  y={isActive ? 60 : 50}
                  textAnchor="middle"
                  fill="#1e293b"
                  className="font-medium transition-all duration-300"
                  style={{ fontSize: isActive ? "16px" : "14px" }}
                >
                  {career.title}
                </text>

                <text
                  y={isActive ? 80 : 70}
                  textAnchor="middle"
                  fill="#64748b"
                  className="transition-all duration-300"
                  style={{ fontSize: isActive ? "14px" : "12px" }}
                >
                  {career.company}
                </text>

                <text
                  y={isActive ? 100 : 85}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="transition-all duration-300"
                  style={{ fontSize: "12px" }}
                >
                  {career.period}
                </text>

                {/* Skills display for active node */}
                {isActive && (
                  <g>
                    {career.skills.slice(0, 5).map((skill, skillIndex) => (
                      <g key={skill} transform={`translate(0, ${120 + skillIndex * 20})`}>
                        <rect x={-50} y={-10} width={100} height={20} rx={10} fill={`${career.color}20`} />
                        <text textAnchor="middle" fill="#1e293b" fontSize="10" dominantBaseline="middle">
                          {skill}
                        </text>
                      </g>
                    ))}
                    {career.skills.length > 5 && (
                      <text y={120 + 5 * 20} textAnchor="middle" fill="#64748b" fontSize="10">
                        +{career.skills.length - 5} more
                      </text>
                    )}
                  </g>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium mb-2">Network Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-slate-800 dark:bg-slate-200 mr-2"></div>
            <span>Career Progression</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-slate-800 dark:bg-slate-200 mr-2 dashed-line"></div>
            <span>Shared Skills</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
            <span>Active Position</span>
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
