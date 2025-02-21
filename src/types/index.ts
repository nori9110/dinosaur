export interface Dinosaur {
  rank: number
  name: string
  image_url: string | null
  image_filename: string | null
}

export interface QuizQuestion {
  correctDinosaur: Dinosaur
  options: Dinosaur[]
  answered?: boolean
  isCorrect?: boolean
}

export interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  startTime: number | null
  endTime: number | null
  score: number
  isComplete: boolean
} 