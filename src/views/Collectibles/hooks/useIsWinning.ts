import {
  useEffect,
  useState,
  useRef
} from 'react'
import {
  getBidsContract
} from 'utils/contractHelpers'
import {
  Nft
} from 'config/constants/types'
import { useWallet } from '@binance-chain/bsc-use-wallet'

const bidsContract = getBidsContract()


const useIsWinning = (necroId) => {
  const isWinningRef = useRef(null)
  const address = useWallet().account

  useEffect(() => {
      const getApproved = async() => {

          try {
              isWinningRef.current = await bidsContract.methods.isWinningBid(necroId).call()===address
          } catch (err) {
              console.log(err)
          }
      }

      getApproved()
  }, [necroId,address])

  return {
      isWinningRef,
  }
}

export default useIsWinning