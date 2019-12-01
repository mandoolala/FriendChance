import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Front from './Front'

export default () => {
  return(
    <Switch>
      <Route path="/main" component={Front} />
    </Switch>
  )
}