import { combineReducers } from 'redux'

import games from './games'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  games
});