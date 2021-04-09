// GAMES
export const GET_GAMES = 'GET_GAMES'
export const CREATE_GAME = 'ADD_GAME'
export const GET_GAME = 'GET_GAME'
export const UPDATE_GAME = 'UPDATE_GAME'
export const DELETE_GAME = 'DELETE_GAME'
export interface GameProp {
  id: string;
  title: string;
  players: [];
  questions: [];
}

// PLAYERS
export const GET_PLAYERS = 'GET_PLAYERS'
export const ADD_PLAYER = 'ADD_PLAYER'
export const GET_PLAYER = 'GET_PLAYER'
export const UPDATE_PLAYER = 'UPDATE_PLAYER'
export const DELETE_PLAYER = 'DELETE_PLAYER'
export interface PlayerProp {
  id: string;
  name: string;
}

// QUESTIONS
export const GET_QUESTIONS = 'GET_QUESTIONS'
export const ADD_QUESTION = 'ADD_QUESTION'
export const GET_QUESTION = 'GET_QUESTION'
export const UPDATE_QUESTION = 'UPDATE_QUESTION'
export const DELETE_QUESTION = 'DELETE_QUESTION'
export interface QuestionProp {
  id: string;
  title: string;
}