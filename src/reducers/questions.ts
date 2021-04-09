import { ADD_QUESTION, GET_QUESTIONS, GET_QUESTION, UPDATE_QUESTION, DELETE_QUESTION, QuestionProp } from '../actions/types'

export default function questions(state = [], action = { id: '', type: '', questions: [], question: { id: '' } }) {
  switch (action.type) {

    case GET_QUESTIONS:
      return action.questions

    case ADD_QUESTION:
      return [
        ...state,
        action.question
      ]

    case GET_QUESTION:
      const index = state.findIndex((item: QuestionProp) => item.id === action.question.id)
      if (index > -1) {
        return state.map((item: QuestionProp) => {
          if (item.id === action.question.id) return action.question
          return item
        })
      } else {
        return [
          ...state,
          action.question
        ]
      }

    case UPDATE_QUESTION:
      return state.map((item: QuestionProp) => {
        if (item.id === action.question.id) return action.question
        return item
      })

    case DELETE_QUESTION:
      return state.filter((item: QuestionProp) => item.id !== action.id)

    default: return state
  }
}