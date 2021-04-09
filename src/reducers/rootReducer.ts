import { combineReducers } from 'redux'

import games from './games'
import players from './players'
import questions from './questions'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  games,
  players,
  questions
});