
import { configureStore } from '@reduxjs/toolkit'


import { gameReducer } from "./reducers/games";

export const store = configureStore({
  reducer: {
    games: gameReducer as any,
  }
})


