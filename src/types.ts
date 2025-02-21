export interface Dinosaur {
  id: number;
  name: string;
  image: string;
  choices: string[];
}

export interface GameState {
  currentLevel: number;
  startTime: number | null;
  bestTimes: Record<number, number>;
  score: number;
}