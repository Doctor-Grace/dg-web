import { ExamResultsView } from "@/components/exam-results-view"

interface AnaliseResultPageProps {
  params: {
    id: string
  }
}

export default function AnaliseResultPage({ params }: AnaliseResultPageProps) {
  return <ExamResultsView examId={params.id} />
}
