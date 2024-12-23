// GAMES
export interface GameProp {
  gameId: string;
  title: string;
  winner: PlayerProp;
  players: PlayerProp[];
  questions: QuestionProp[];
}
export interface UpdateGameProp {
  gameId: string;
  title: string;
  winner: PlayerProp;
}

// PLAYERS
export interface PlayerProp {
  gameId?: string;
  playerId: string;
  name: string;
  score: number;
}
export interface DeletePlayerProp {
  gameId: string;
  playerId: string;
}

// QUESTIONS
export interface QuestionProp {
  gameId?: string;
  questionId: string;
  question: string;
  isAsked: boolean;
}

export interface DeleteQuestionProp {
  gameId: string;
  questionId: string;
}