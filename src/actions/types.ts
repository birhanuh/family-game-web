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
  playerId: string;
  name: string;
  score: number;
}

export interface DeletePlayerProp {
  playerId: string;
}

// QUESTIONS
export interface QuestionProp {
  questionId: string;
  question: string;
  isAsked: boolean;
}

export interface DeleteQuestionProp {
  questionId: string;
}

// Action
export interface ActionProp {
  id: string;
  type: string;
  game: GameProp;
  games: GameProp[];
  gameId: string;
  player: PlayerProp;
  question: QuestionProp;
}