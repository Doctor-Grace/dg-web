"use client"

import { useFeatureAccess } from "@/hooks/use-feature-access"

const ExamAnalysis = () => {
  const { checkAccess } = useFeatureAccess()

  const handleAnalyzeExams = () => {
    if (!checkAccess()) {
      return
    }

    // Continuar com a análise de exames
    // Resto do código...
  }

  return (
    <div>
      <h2>Exam Analysis</h2>
      <button onClick={handleAnalyzeExams}>Analyze Exams</button>
    </div>
  )
}

export default ExamAnalysis
