import {
  CREATE_GAME, GET_GAMES, GET_GAME, UPDATE_GAME, RESET_GAME, DELETE_GAME, GameProp,
  ADD_PLAYER, UPDATE_PLAYER, DELETE_PLAYER,
  ADD_QUESTION, UPDATE_QUESTION, DELETE_QUESTION,
} from '../actions/types'

export default function games(state: GameProp[] = [], action = { id: '', type: '', games: [], game: { gameId: '' }, player: { gameId: '', playerId: '', name: '', score: 0 }, question: { gameId: '', questionId: '', question: '', isAsked: false } }) {
  switch (action.type) {

    case GET_GAMES:
      return action.games

    case CREATE_GAME:
      return [
        ...state,
        action.game
      ]

    case GET_GAME:
      const index = state.findIndex((item: GameProp) => item.gameId === action.game.gameId)
      if (index > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.game.gameId) return action.game
          return item
        })
      } else {
        return [
          ...state,
          action.game
        ]
      }

    case UPDATE_GAME:
      return state.map((item: GameProp) => {
        if (item.gameId === action.game.gameId) return action.game
        return item
      })

    case RESET_GAME:
      const indexReset = state.findIndex((item: GameProp) => item.gameId === action.game.gameId)
      if (indexReset > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.game.gameId) return action.game
          return item
        })
      } else {
        return [
          ...state,
          action.game
        ]
      }

    case DELETE_GAME:
      return state.filter((item: GameProp) => item.gameId !== action.id)

    case ADD_PLAYER:
      const indexOfAddPlayer = state.findIndex((item: GameProp) => item.gameId === action.player.gameId)
      if (indexOfAddPlayer > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.player.gameId) {
            return {
              ...item,
              players: [...item.players, action.player]
            }
          }
          return item
        })
      } else {
        return [...state]
      }

    case UPDATE_PLAYER:
      const indexOfUpdatePlayer = state.findIndex((item: GameProp) => item.gameId === action.player.gameId)
      if (indexOfUpdatePlayer > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.player.gameId) {
            const indexToUpdate = findWithAttr(item.players, 'playerId', action.player.playerId);
            item.players[indexToUpdate] = action.player;
            return {
              ...item,
              players: item.players
            }
          }
          return item
        })
      } else {
        return [...state]
      }

    case DELETE_PLAYER:
      const indexOfDeletePlayer = state.findIndex((item: GameProp) => item.gameId === action.player.gameId)
      if (indexOfDeletePlayer > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.player.gameId) {
            return {
              ...item,
              players: [...item.players.filter(playerItem => playerItem.playerId !== action.player.playerId)]
            }
          }
          return item
        })
      } else {
        return [...state]
      }

    case ADD_QUESTION:
      const indexOfAddQuestion = state.findIndex((item: GameProp) => item.gameId === action.question.gameId)
      if (indexOfAddQuestion > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.question.gameId) {
            return {
              ...item,
              questions: [...item.questions, action.question]
            }
          }
          return item
        })
      } else {
        return [...state]
      }

    case UPDATE_QUESTION:
      const indexOfUpdateQuestion = state.findIndex((item: GameProp) => item.gameId === action.question.gameId)
      if (indexOfUpdateQuestion > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.question.gameId) {
            return {
              ...item,
              questions: [...item.questions.filter(questionItem => questionItem.questionId !== action.question.questionId), action.question]
            }
          }
          return item
        })
      } else {
        return [...state]
      }

    case DELETE_QUESTION:
      const indexOfDeleteQuestion = state.findIndex((item: GameProp) => item.gameId === action.question.gameId)
      if (indexOfDeleteQuestion > -1) {
        return state.map((item: GameProp) => {
          if (item.gameId === action.question.gameId) {
            return {
              ...item,
              questions: [...item.questions.filter(questionItem => questionItem.questionId !== action.question.questionId)]
            }
          }
          return item
        })
      } else {
        return [...state]
      }
    default: return state
  }
}

function findWithAttr(array: any, attr: any, value: any) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}