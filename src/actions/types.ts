// GAMES
export const GET_GAMES = 'GET_GAMES'
export const CREATE_GAME = 'ADD_GAME'
export const GET_GAME = 'GET_GAME'
export const UPDATE_GAME = 'UPDATE_GAME'
export const RESET_GAME = 'RESET_GAME'
export const DELETE_GAME = 'DELETE_GAME'
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
export const ADD_PLAYER = 'ADD_PLAYER'
export const UPDATE_PLAYER = 'UPDATE_PLAYER'
export const DELETE_PLAYER = 'DELETE_PLAYER'
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
export const ADD_QUESTION = 'ADD_QUESTION'
export const UPDATE_QUESTION = 'UPDATE_QUESTION'
export const DELETE_QUESTION = 'DELETE_QUESTION'
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