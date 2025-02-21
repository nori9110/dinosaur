import { Box, Button, Container, Heading, SimpleGrid, Text, Image, VStack, useToast } from '@chakra-ui/react'
import type { StackProps, SimpleGridProps } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Dinosaur, QuizState, QuizQuestion } from '../types'
import { generateQuizQuestions, formatTime } from '../utils/quiz'
import dinosaurData from '../../docs/data.json'

const buttonHover = {
  transform: 'scale(1.05)',
  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
}

interface HomeProps {
  dinosaurs: Dinosaur[]
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      dinosaurs: dinosaurData.dinosaurs,
    },
  }
}

export default function Home({ dinosaurs }: HomeProps) {
  const toast = useToast()
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    startTime: null,
    endTime: null,
    score: 0,
    isComplete: false,
  })
  const [elapsedTime, setElapsedTime] = useState<string>("00:00")

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (quizState.startTime && !quizState.isComplete) {
      intervalId = setInterval(() => {
        const startTime = quizState.startTime;
        if (startTime === null) return;
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [quizState.startTime, quizState.isComplete]);

  const startQuiz = () => {
    const questions = generateQuizQuestions(dinosaurs)
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      startTime: Date.now(),
      endTime: null,
      score: 0,
      isComplete: false,
    })
    setElapsedTime("00:00")
  }

  const handleAnswer = (selectedDinosaur: Dinosaur) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const isCorrect = selectedDinosaur.rank === currentQuestion.correctDinosaur.rank

    const updatedQuestions = [...quizState.questions]
    updatedQuestions[quizState.currentQuestionIndex] = {
      ...currentQuestion,
      answered: true,
      isCorrect,
    }

    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1
    const newScore = quizState.score + (isCorrect ? 1 : 0)

    setQuizState((prev: QuizState) => ({
      ...prev,
      questions: updatedQuestions,
      score: newScore,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
      endTime: isLastQuestion ? Date.now() : null,
      isComplete: isLastQuestion,
    }))

    toast({
      title: isCorrect ? '正解！' : '不正解',
      description: isCorrect ? 'すごい！その通りです！' : 'また挑戦してみよう！',
      status: isCorrect ? 'success' : 'error',
      duration: 1500,
      position: 'top',
      variant: 'solid',
    })
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]

  return (
    <>
      <Head>
        <title>恐竜クイズ</title>
        <meta name="description" content="恐竜に関する知識を楽しく学べるクイズアプリ" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Box
        minH="100vh"
        py={8}
        bgGradient="linear(to-b, yellow.100, green.100)"
        backgroundSize="200px"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          zIndex: 0,
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')",
          backgroundRepeat: "repeat",
        }}
      >
        <Container maxW="container.md" position="relative" zIndex={1}>
          <VStack spacing={8} as="div">
            <Heading
              as="h1"
              textAlign="center"
              fontSize={["4xl", "5xl"]}
              color="green.700"
              textShadow="2px 2px 4px rgba(0,0,0,0.2)"
              _hover={{ transform: 'translateY(-10px)' }}
              transition="transform 0.3s ease-in-out"
            >
              恐竜クイズ
            </Heading>

            {!quizState.questions.length ? (
              <Button
                colorScheme="green"
                size="lg"
                fontSize="2xl"
                p={8}
                borderRadius="full"
                boxShadow="lg"
                _hover={buttonHover}
                onClick={startQuiz}
                bgGradient="linear(to-r, green.400, teal.500)"
              >
                クイズを始めよう！
              </Button>
            ) : quizState.isComplete ? (
              <VStack spacing={6} p={8} bg="white" borderRadius="2xl" boxShadow="xl" as="div">
                <Heading size="lg" color="green.600">
                  クイズ完了！
                </Heading>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  正解率: {quizState.score}/{quizState.questions.length}問
                </Text>
                <Text fontSize="xl" color="blue.600">
                  所要時間: {formatTime(quizState.endTime! - quizState.startTime!)}
                </Text>
                <VStack spacing={4} w="100%" align="stretch">
                  <Heading size="md" color="gray.700" textAlign="center">
                    結果詳細
                  </Heading>
                  {quizState.questions.map((question, index) => (
                    <Box
                      key={index}
                      p={4}
                      bg={question.isCorrect ? 'green.50' : 'red.50'}
                      borderRadius="lg"
                      borderWidth="2px"
                      borderColor={question.isCorrect ? 'green.200' : 'red.200'}
                    >
                      <Text fontSize="lg" fontWeight="bold" mb={2}>
                        問題 {index + 1}
                      </Text>
                      <Text color={question.isCorrect ? 'green.600' : 'red.600'} mb={1}>
                        {question.isCorrect ? '○ 正解！' : '× 不正解'}
                      </Text>
                      <Text fontSize="md" color="gray.600">
                        正解: {question.correctDinosaur.name}
                      </Text>
                    </Box>
                  ))}
                </VStack>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={startQuiz}
                  _hover={buttonHover}
                  mt={4}
                >
                  もう一度挑戦する
                </Button>
              </VStack>
            ) : (
              <VStack spacing={6} w="100%" as="div">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  maxW="500px"
                >
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="purple.700"
                    bgColor="white"
                    px={6}
                    py={2}
                    borderRadius="full"
                    boxShadow="md"
                  >
                    問題 {quizState.currentQuestionIndex + 1}/{quizState.questions.length}
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="orange.600"
                    bgColor="white"
                    px={6}
                    py={2}
                    borderRadius="full"
                    boxShadow="md"
                  >
                    {elapsedTime}
                  </Text>
                </Box>
                {currentQuestion.correctDinosaur.image_url && (
                  <Box
                    p={4}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="xl"
                    maxW="500px"
                    w="100%"
                  >
                    <Image
                      src={currentQuestion.correctDinosaur.image_url}
                      alt="恐竜の画像"
                      borderRadius="xl"
                      maxH="300px"
                      objectFit="contain"
                      mx="auto"
                    />
                  </Box>
                )}
                <SimpleGrid columns={1} spacing={4} w="100%" maxW="500px" as="div">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.rank}
                      size="lg"
                      onClick={() => handleAnswer(option)}
                      py={8}
                      fontSize="xl"
                      borderRadius="xl"
                      bgGradient="linear(to-r, orange.300, yellow.400)"
                      color="gray.800"
                      _hover={{
                        ...buttonHover,
                        bgGradient: "linear(to-r, orange.400, yellow.500)",
                      }}
                      boxShadow="md"
                      transition="all 0.3s ease-in-out"
                    >
                      {option.name}
                    </Button>
                  ))}
                </SimpleGrid>
              </VStack>
            )}
          </VStack>
        </Container>
      </Box>
    </>
  )
} 