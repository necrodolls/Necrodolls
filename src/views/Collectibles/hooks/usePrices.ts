import { useEffect, useState } from 'react'
import { getBidsContract } from 'utils/contractHelpers'
import {Nft} from 'config/constants/types'

const bidsContract = getBidsContract()


const usePrices = (nfts:Nft []) => {
  /* eslint-disable no-param-reassign */
  useEffect(() => {
    const modifyNft = () => {
      nfts.map(async (nft)=>{
        nft.lastPrice = await bidsContract.methods.lastPrice(nft.bunnyId).call()
        nft.lastBid = await bidsContract.methods.lastBid(nft.bunnyId).call()
      })
    }

    modifyNft()
  }, [nfts])
  /* eslint-enable no-param-reassign */

  return {
    nfts,
  }
}

export default usePrices
