import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useEffect, useReducer } from 'react'
import { getNecroDollsContract, getBidsContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const pancakeRabbitsContract = getNecroDollsContract()
const bidsContract = getBidsContract()

export type NftMap = {
  [key: number]: {
    tokenUri: string
    tokenIds: number[]
    lastPrice: number
    lastBid: number
  }
}

type Action = { type: 'set_nfts'; data: NftMap } | { type: 'reset' } | { type: 'refresh'; timestamp: number }

type State = {
  isLoading: boolean
  nfts: NftMap
  lastUpdated: number
}

const initialState: State = {
  isLoading: true,
  nfts: {},
  lastUpdated: Date.now(),
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set_nfts':
      return {
        ...initialState,
        isLoading: false,
        nfts: action.data,
      }
    case 'refresh':
      return {
        ...initialState,
        lastUpdated: action.timestamp,
      }
    case 'reset':
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

const useGetWalletNfts = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account } = useWallet()
  const { lastUpdated } = state

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const balanceOf = await pancakeRabbitsContract.methods.balanceOf(account).call()
        if (balanceOf > 0) {
          let nfts: NftMap = {}

          const getTokenIdAndNecroId = async (index: number) => {
            try {
              const { tokenOfOwnerByIndex, getNecroId, tokenURI } = pancakeRabbitsContract.methods
              const tokenId = await tokenOfOwnerByIndex(account, index).call()
              const lastPrice = await bidsContract.methods.lastPrice(tokenId).call()
              const lastBid = await bidsContract.methods.lastBid(tokenId).call()

              const [bunnyId, tokenUri] = await makeBatchRequest([getNecroId(tokenId).call, tokenURI(tokenId).call])

              return [Number(bunnyId), Number(tokenId), tokenUri, Number(lastPrice), Number(lastBid)]
            } catch (error) {
              return null
            }
          }

          const tokenIdPromises = []

          for (let i = 0; i < balanceOf; i++) {
            tokenIdPromises.push(getTokenIdAndNecroId(i))
          }

          const tokenIdsOwnedByWallet = await Promise.all(tokenIdPromises)


          nfts = tokenIdsOwnedByWallet.reduce((accum, association) => {
            if (!association) {
              return accum
            }

            const [necroId, tokenId, tokenUri] = association

            return {
              ...accum,
              [necroId]: {
                tokenUri,
                tokenIds: accum[necroId] ? [...accum[necroId].tokenIds, tokenId] : [tokenId],
              },
            }
          }, {})


          dispatch({ type: 'set_nfts', data: nfts })
        } else {
          // Reset it in case of wallet change
          dispatch({ type: 'reset' })
        }
      } catch (error) {
        dispatch({ type: 'reset' })
      }
    }

    if (account) {
      fetchNfts()
    }
  }, [account, lastUpdated, dispatch])

  const refresh = () => dispatch({ type: 'refresh', timestamp: Date.now() })

  return { ...state, refresh }
}

export default useGetWalletNfts
