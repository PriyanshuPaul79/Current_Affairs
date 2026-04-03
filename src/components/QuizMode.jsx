import { useQuiz } from '../hooks/useQuiz'

export default function QuizMode({ articles }) {
  if (!articles || articles.length < 2) {
    return (
      <div className="quiz-start">
        <h2>🧠 Quiz Mode</h2>
        <p>Please fetch at least 2 news articles first, then return here to start a quiz based on them.</p>
      </div>
    )
  }

  return <QuizGame articles={articles} />
}

function QuizGame({ articles }) {
  const {
    questions, currentQuestion, currentIndex,
    selectedAnswer, score, finished,
    selectAnswer, nextQuestion, restart, total,
  } = useQuiz(articles)

  if (finished) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="quiz-results">
        <h2>🎉 Quiz Complete!</h2>
        <div className="quiz-score-display">{score}/{total}</div>
        <p>
          You scored <strong>{pct}%</strong>.{' '}
          {pct >= 80 ? '🌟 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
        </p>
        <button className="quiz-restart-btn" onClick={restart}>
          🔄 Try Again
        </button>
      </div>
    )
  }

  if (!currentQuestion) return null

  const progress = ((currentIndex) / total) * 100

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>🧠 Banking Current Affairs Quiz</h2>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="quiz-score-badge">
          Question {currentIndex + 1} of {total} · Score: {score}
        </p>
      </div>

      <div className="quiz-question-card">
        <p className="quiz-question-num">Question {currentIndex + 1}</p>
        <p className="quiz-question-text">{currentQuestion.question}</p>
      </div>

      <div className="quiz-options">
        {currentQuestion.options.map((option, idx) => {
          let cls = 'quiz-option-btn'
          if (selectedAnswer !== null) {
            if (option.isCorrect) cls += ' correct'
            else if (option.id === selectedAnswer) cls += ' incorrect'
          }
          const letter = String.fromCharCode(65 + idx)
          return (
            <button
              key={option.id}
              className={cls}
              onClick={() => selectAnswer(option.id)}
              disabled={selectedAnswer !== null}
            >
              <span className="quiz-option-letter">{letter}</span>
              {option.text}
            </button>
          )
        })}
      </div>

      {selectedAnswer !== null && (
        <>
          <div className="quiz-explanation">{currentQuestion.explanation}</div>
          <button className="quiz-next-btn" onClick={nextQuestion}>
            {currentIndex + 1 < total ? 'Next Question →' : 'See Results 🎉'}
          </button>
        </>
      )}
    </div>
  )
}
