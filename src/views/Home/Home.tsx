import React, {lazy} from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPYCard from 'views/Home/components/EarnAPYCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const Collectibles = lazy(() => import('../Collectibles'))

let coll=false

const changeColl = () =>{
  coll=true
  
}

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.png');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg2.png');
    background-position: left center;
    height: 165px;
    padding-top: 0;
  }
`

const Roadmap = styled.div`
  align-items: center;
  background-image: url('/images/Roadmap.png');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/Roadmap.png');
    background-position: center;
    height: 600px;
    width: 100%;
    padding-top: 10;
  }
`

const AppButton = styled(Button)`
  margin-top:10px;
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Page>

        
      <Hero>
      
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          {TranslateString(576, 'NecroDolls')}
        </Heading>

        <Text>{TranslateString(578, 'The #1 NFT collectibles platform on Binance Smart Chain.')}</Text> 
       
          <AppButton onClick={changeColl}><Link to="/Collectibles">Go to app</Link></AppButton>
 
      
        
        

      </Hero>
      <Roadmap />
     
    </Page>
  )
}

export default Home
