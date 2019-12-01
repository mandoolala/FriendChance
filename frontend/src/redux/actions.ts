import actionTypes from 'Redux/actionTypes'
import { User } from 'Src/types'

export interface defaultActionType {
  type: string
  payload: any
}

const actionCreator = <T = any>(actionType: string) => (payload: T) => {
  return {
    type: actionType,
    payload,
  }
}

export default {
  defaultAction: actionCreator(actionTypes.REQUEST_DEFAULT),
  setUser: actionCreator<User>(actionTypes.SET_USER),
}