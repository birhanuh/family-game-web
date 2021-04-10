import axios from 'axios'
import { ADD_QUESTION, GET_QUESTIONS, GET_QUESTION, UPDATE_QUESTION, DELETE_QUESTION, QuestionProp } from './types'

export function addQuestionAction(title: string) {
  return {
    type: ADD_QUESTION,
    title
  }
}

export function getQuestionsAction(questions: [QuestionProp]) {
  return {
    type: GET_QUESTIONS,
    questions
  }
}

export function getQuestionAction(question: QuestionProp) {
  return {
    type: GET_QUESTION,
    question
  }
}

export function updatedQuestionAction(question: QuestionProp) {
  return {
    type: UPDATE_QUESTION,
    question
  }
}

export function deletedQuestionAction(id: string) {
  return {
    type: DELETE_QUESTION,
    id
  }
}

export function addQuestion(question: QuestionProp) {
  return (dispatch: any) => {
    return axios.post(`${process.env.API_URL}/questions`, question).then(res => {
      dispatch(addQuestionAction(res.data.result))
    })
  }
}

export function gethQuestions() {
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/questions`).then(res => {
      dispatch(getQuestionsAction(res.data.results))
    })
  }
}

export function gethQuestion(id: string) {
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/questions/${id}`).then(res => {
      dispatch(getQuestionAction(res.data.result))
    })
  }
}

export function updateQuestion(question: QuestionProp) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/questions/${question.id}`, question).then(res => {
      dispatch(updatedQuestionAction(res.data.result))
    })
  }
}

export function deleteQuestion(id: string) {
  return (dispatch: any) => {
    return axios.delete(`${process.env.API_URL}/questions/${id}`).then(() => {
      dispatch(deletedQuestionAction(id))
    })
  }
}