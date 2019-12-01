import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import selectors from 'Redux/selectors'
import actions from 'Redux/actions'
import './Front.scss'

export default function Front(props: any) {
  const [ inputValue, setInputValue ] = useState('')
  const store = useSelector(selectors.sampleSelector)
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(actions.defaultAction({ id: inputValue }))
  }
  
  return (
    <div className="container">
      {store.id}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={handleClick}
      >
        test
      </button>
    </div>
  )
}