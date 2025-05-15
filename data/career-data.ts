import type { CareerEntry } from "@/types/career"

export const careerData: CareerEntry[] = [
  {
    id: 1,
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
          "Developed a minimum viable product for a startup's funding pitch that successfully secured $2M in Series A funding. Created an interactive prototype that demonstrated the core functionality and potential of the product.",
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
    ],
  },
  {
    id: 2,
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
          "Led the redesign of the company's portfolio website to showcase recent projects and improve lead generation. Implemented modern design principles and optimized for conversion. The new website significantly improved client inquiries.",
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
          "Led frontend development for a major marketing campaign website that won industry recognition for its innovative design and user experience. Implemented complex animations and interactive elements while maintaining performance across all devices.",
        achievements: [
          "Site won 'Best Digital Campaign' at the Annual Marketing Awards",
          "Achieved 98/100 Google PageSpeed score despite rich media content",
          "Implemented innovative scroll-based animations that became case studies",
          "Featured in web design publications for technical implementation",
        ],
        media: {
          type: "image",
          url: "/placeholder.svg?height=300&width=500",
          caption: "Marketing campaign website showcase",
        },
        links: [
          { title: "Award Announcement", url: "https://example.com/award" },
          { title: "Case Study", url: "https://example.com/case-study" },
        ],
        tags: ["Marketing", "Animation", "Interactive", "Award-Winning"],
      },
    ],
  },
  {
    id: 4,
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
          "Designed and implemented a comprehensive financial dashboard for a major banking client. The dashboard provided real-time insights into market trends, portfolio performance, and risk assessments. Integrated with multiple financial data providers and implemented complex data visualization components.",
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
    ],
  },
  {
    id: 5,
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
          "Led the development of a comprehensive enterprise dashboard that consolidated data from multiple sources. The dashboard provided real-time analytics and actionable insights for C-level executives. Implemented advanced data visualization components and optimized data processing algorithms to handle large datasets efficiently.",
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
    ],
  },
]
