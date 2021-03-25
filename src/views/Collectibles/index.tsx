import styled from 'styled-components'
import { Heading, ResetCSS } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect } from 'react'
import { useFetchProfile, useFetchPublicData } from 'state/hooks'
import NftList from './components/NftList'
import WalletNotConnected from '../Profile/components/WalletNotConnected'

import GlobalStyle from '../../style/Global'

const StyledHero = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
`

const Collectibles = () => {
  const TranslateString = useI18n()
  const { account, connect } = useWallet()

  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null
  }, [])

  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()
  useFetchProfile()
  if(account){
    return (
      
      <Page>
        <ResetCSS />
      <GlobalStyle />
        <StyledHero>
          <Heading as="h1" size="xxl" color="secondary">
            {TranslateString(999, 'Necrodolls')}
          </Heading>
          <Heading color="secondary">
            
            {account}
          </Heading>
        </StyledHero>
        <NftList />
      </Page>
    )
  }
    return (
  
      <Page>
        <ResetCSS />
      <GlobalStyle />
        <StyledHero>
          <Heading as="h1" size="xxl" color="secondary">
            {TranslateString(999, 'Necrodolls')}
          </Heading>
          <WalletNotConnected />
        </StyledHero>
        <NftList />
      </Page>
    )
  
}

export default Collectibles
