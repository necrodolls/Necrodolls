import React from 'react'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'

const WalletNotConnected = () => {
  const TranslateString = useI18n()

  return (
    <div>
      <UnlockButton />
    </div>
  )
}

export default WalletNotConnected
