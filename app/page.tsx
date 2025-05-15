import { AdvancedCareerMap } from "@/components/advanced-career-map"
import { careerData } from "@/data/career-data"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">My Career Journey</h1>

      <div className="max-w-6xl mx-auto">
        <AdvancedCareerMap careerData={careerData} />
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Explore the interactive map above to visualize my professional journey.</p>
        <p>Click on locations to see detailed information about each position.</p>
      </div>
    </main>
  )
}
