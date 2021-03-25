import React, { useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Input, Modal, Text } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import { Nft } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { useBids } from 'hooks/useContract'
import InfoRow from './InfoRow'

interface MakeBidModalProps {
  nft: Nft
  bunnyId: number
  lastBid: number
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 24px;
`

const MakeOfferModal: React.FC<MakeBidModalProps> = ({ nft, bunnyId, lastBid ,onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const TranslateString = useI18n()
  const { account } = useWallet()
  const bidsContract = useBids()
  const { toastSuccess } = useToast()

  const handleConfirm = async () => {
    try {
      const isValidAddress = /^[0-9]\d*(\.\d+)?$/.test(value)

      if (!isValidAddress || parseFloat(value)*1000000000000000000<=lastBid) {
        setError(TranslateString(999, 'Please enter a valid BnB value'))
      } else {
        await bidsContract.methods
          .makeBid(bunnyId)
          .send({ from: account, value: parseFloat(value)*1000000000000000000 })
          .on('sending', () => {
            setIsLoading(true)
          })
          .on('receipt', () => {
            onDismiss()
            onSuccess()
            window.location.reload()
            toastSuccess('Bid made!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to make bid')
            setIsLoading(false)
          })
      }
    } catch (err) {
      console.error('Unable to make bid:', err)
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(inputValue)
  }

  return (
    <Modal title={TranslateString(999, 'Make Offer')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{TranslateString(999, 'Making Offer')}:</Text>
          <Value>{`1x "${nft.name}" NFT`}</Value>
        </InfoRow>
        <Label htmlFor="transferAddress">{TranslateString(999, 'BnB Amount')}:</Label>
        <Input
          id="transferAddress"
          name="address"
          type="text"
          placeholder={TranslateString(999, 'Insert Amount')}
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        />
      </ModalContent>
      <Actions>
        <Button fullWidth variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button fullWidth onClick={handleConfirm} disabled={!account || isLoading || !value}>
          {TranslateString(464, 'Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default MakeOfferModal
