import { Dinosaur, QuizQuestion } from '../types'

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateQuizQuestions(dinosaurs: Dinosaur[], questionCount: number = 5): QuizQuestion[] {
  const shuffledDinosaurs = shuffleArray(dinosaurs)
  const questions: QuizQuestion[] = []

  for (let i = 0; i < questionCount && i < shuffledDinosaurs.length; i++) {
    const correctDinosaur = shuffledDinosaurs[i]
    const otherDinosaurs = shuffledDinosaurs.filter(d => d.rank !== correctDinosaur.rank)
    const options = shuffleArray([
      correctDinosaur,
      ...shuffleArray(otherDinosaurs).slice(0, 2)
    ])

    questions.push({
      correctDinosaur,
      options,
      answered: false,
      isCorrect: false
    })
  }

  return questions
}

export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
} 