import { defaultActionType } from 'Redux/actions'
import actionTypes from 'Redux/actionTypes'
import { User } from 'Src/types'

export interface reducerType {
  id: string
  user?: User;
}

const initialState = {
  id: ''
}

export default function RootReducer(state: reducerType = initialState, action: defaultActionType) {
  switch (action.type) {
    case actionTypes.REQUEST_DEFAULT:
      return {
        ...state,
        id: action.payload.id
      }
    case actionTypes.SET_USER: 
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}