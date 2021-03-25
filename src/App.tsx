import React, { useEffect, Suspense, lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'

import { ResetCSS } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'

import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import Home from './views/Home'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import Pools from './views/Pools'
import GlobalCheckBullHiccupClaimStatus from './views/Collectibles/components/GlobalCheckBullHiccupClaimStatus'
import history from './routerHistory'
import Collectibles from './views/Collectibles'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'

const Farms = lazy(() => import('./views/Farms'))
const Lottery = lazy(() => import('./views/Lottery'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))

const Teams = lazy(() => import('./views/Teams'))
const Team = lazy(() => import('./views/Teams/Team'))
const Profile = lazy(() => import('./views/Profile'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  

  return (
      <Suspense fallback={<PageLoader />}>
        
      <Router history={history}>
      <ResetCSS />
      <Switch>
      <Route path="/" exact>
              <Home />
        </Route>
        <Route path="/collectibles">
              <Collectibles />
        </Route>
        </Switch>
      </Router>
      
        <GlobalStyle />
        
      </Suspense>
  )
}

export default React.memo(App)
