import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from '@pancakeswap-libs/uikit'
import { useProfile, useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { Nft } from 'config/constants/types'
import { useBids, useNecroDolls } from 'hooks/useContract'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'
import MakeOfferModal from '../MakeOfferModal'
import Preview from './Preview'
import useIsApproven from '../../hooks/useIsApproven'
import useIsWinning from '../../hooks/useIsWinning'



interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  tokenIds?: number[]
  onSuccess: () => void
  lastPrice: number
  lastBid: number
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text', fullWidth: true })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 24px;
`
const BidPrices = styled.div`
  float: left;
  margin-top:10px;
  margin-left:10px;
`
const LastPrices = styled.div`
  float: left;
  margin-top:10px;
  margin-left:10px;
`

const OfferButton = styled(Button)`
  float:right;
  margin-right:10px;
  margin-top:10px;
`

const AcceptButton = styled(Button)`
  margin-top:10px;
`

const NftCard: React.FC<NftCardProps> = ({ nft, onSuccess, canClaim = false, tokenIds = [], lastPrice, lastBid}) => {
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const { profile } = useProfile()
  const { account } = useWallet()
  const [error, setError] = useState(null)
  const { bunnyId, name, description } = nft
  const walletOwnsNft = tokenIds.length > 0
  const bidsContract = useBids()
  const necroDollsContract = useNecroDolls()
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon
  const { toastSuccess } = useToast()
  const isApproven = useIsApproven(bunnyId).isApprovenRef.current
  const isWinningBid = useIsWinning(bunnyId).isWinningRef.current



  const handleAcceptBid = async () => {
    try {
        await bidsContract.methods
          .acceptBid(bunnyId)
          .send({ from: account })
          .on('receipt', () => {
            onSuccess()
            window.location.reload()
            toastSuccess('Accepted bid!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to accept bid')
          })
      
    } catch (err) {
      console.error('Unable to accept bid:', err)
    }
  }

  const handleApprove= async () => {
    try {
        await necroDollsContract.methods
          .approve(bidsContract.options.address, bunnyId)
          .send({ from: account })
          .on('receipt', () => {
            onSuccess()
            window.location.reload()
            toastSuccess('Approved!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to approve')
          })
      
    } catch (err) {
      console.error('Unable to approve:', err)
    }
  }

  const handleRetire= async () => {
    try {
        await bidsContract.methods
          .retireBid( bunnyId)
          .send({ from: account })
          .on('receipt', () => {
            onSuccess()
            window.location.reload()
            toastSuccess('Offer retired!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to retire')
          })
      
    } catch (err) {
      console.error('Unable to retire:', err)
    }
  }


  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={onSuccess} />)
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={onSuccess} />)
  const [onPresentMakeOfferModal] = useModal(<MakeOfferModal nft={nft} lastBid= {lastBid} bunnyId={bunnyId} onSuccess={onSuccess}/>)
  
  return (
    <Card isActive={walletOwnsNft || canClaim}>
      <Preview nft={nft} isOwned={walletOwnsNft} />
      <CardBody>
        <Header>
          <Heading>{name}</Heading>
          {walletOwnsNft && (
            <Tag outline variant="secondary">
              {TranslateString(999, 'In Wallet')}
            </Tag>
          )}
          {profile?.nft?.bunnyId === bunnyId && (
            <Tag outline variant="success">
              {TranslateString(999, 'Profile Pic')}
            </Tag>
          )}
        </Header>
        {canClaim && (
          <Button fullWidth mt="24px" onClick={onPresentClaimModal}>
            {TranslateString(999, 'Claim this NFT')}
          </Button>
        )}
        {walletOwnsNft && (
          <Button fullWidth variant="secondary" mt="24px" onClick={onPresentTransferModal}>
            {TranslateString(999, 'Transfer')}
          </Button>
        )}
      </CardBody>
      <CardFooter p="0">
        <BidPrices>Last Price: {lastPrice/1000000000000000000} BNB</BidPrices><OfferButton  onClick={onPresentMakeOfferModal}>{TranslateString(999, 'Offer')}</OfferButton>
        <LastPrices>Last Bid: {lastBid/1000000000000000000} BNB</LastPrices>
        {walletOwnsNft && lastBid>0 && isApproven && (<AcceptButton onClick={handleAcceptBid} fullWidth>{TranslateString(999, 'Accept Bid')}</AcceptButton>)}
        {walletOwnsNft && lastBid>0 && !isApproven && (<AcceptButton onClick={handleApprove} fullWidth>{TranslateString(999, 'Approve Accept')}</AcceptButton>)}
        {!walletOwnsNft && lastBid>0 && isWinningBid && (<AcceptButton onClick={handleRetire} fullWidth>{TranslateString(999, 'Retire Bid')}</AcceptButton>)}
        <DetailsButton endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
          {TranslateString(658, 'Details')}
        </DetailsButton>
        {isOpen && (
          <InfoBlock>
            <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
              {description}
            </Text>
          </InfoBlock>
        )}
      </CardFooter>
    </Card>
  )
}

export default NftCard
