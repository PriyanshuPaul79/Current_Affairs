import { useState, useCallback } from 'react'

// Minimum articles needed for a meaningful quiz (1 correct + 3 distractors)
const MIN_ARTICLES_FOR_QUIZ = 4

function generateQuestions(articles) {
  return articles.slice(0, 10).map((article, index) => {
    const title = article.title || ''
    const desc = article.description || ''

    // Extract a key fact from title
    const question = `What is the main topic of: "${title.slice(0, 120)}${title.length > 120 ? '...' : ''}"?`

    const correctAnswer = desc.slice(0, 100) || title

    // Generate plausible wrong answers by mixing parts of other articles
    const others = articles.filter((_, i) => i !== index)
    const distractors = []
    for (let i = 0; i < 3; i++) {
      const other = others[i % Math.max(others.length, 1)]
      if (other) {
        distractors.push((other.description || other.title || '').slice(0, 100))
      }
    }
    // Pad if not enough distractors
    while (distractors.length < 3) {
      distractors.push(`Related to ${article.source || 'India'} financial news`)
    }

    const options = [correctAnswer, ...distractors]
      .map((opt, i) => ({ id: i, text: opt || `Option ${i + 1}`, isCorrect: i === 0 }))
      .sort(() => Math.random() - 0.5)

    return {
      id: `q-${index}`,
      question,
      options,
      explanation: `This question is based on an article from ${article.source}. ${desc.slice(0, 200)}`,
      articleIndex: index,
    }
  })
}

export function useQuiz(articles) {
  const [questions] = useState(() => generateQuestions(articles))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answeredMap, setAnsweredMap] = useState({})

  const currentQuestion = questions[currentIndex]

  const selectAnswer = useCallback((optionId) => {
    if (selectedAnswer !== null) return
    const option = currentQuestion?.options.find((o) => o.id === optionId)
    if (!option) return
    setSelectedAnswer(optionId)
    if (option.isCorrect) {
      setScore((s) => s + 1)
    }
    setAnsweredMap((prev) => ({ ...prev, [currentIndex]: optionId }))
  }, [selectedAnswer, currentQuestion, currentIndex])

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }, [currentIndex, questions.length])

  const restart = useCallback(() => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinished(false)
    setAnsweredMap({})
  }, [])

  return {
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    score,
    finished,
    answeredMap,
    selectAnswer,
    nextQuestion,
    restart,
    total: questions.length,
  }
}

export { MIN_ARTICLES_FOR_QUIZ }
