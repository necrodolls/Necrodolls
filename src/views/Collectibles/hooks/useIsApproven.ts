import {
  useEffect,
  useState,
  useRef
} from 'react'
import {
  getNecroDollsContract, getBidsContract
} from 'utils/contractHelpers'
import {
  Nft
} from 'config/constants/types'

const necroDollsContract = getNecroDollsContract()
const bidsContract= getBidsContract()


const useApproven = (necroId) => {
  const isApprovenRef = useRef(null)

  useEffect(() => {
      const getApproved = async() => {

          try {
              isApprovenRef.current = await necroDollsContract.methods.getApproved(necroId).call() === bidsContract.options.address
          } catch (err) {
              console.log(err)
          }
      }

      getApproved()
  }, [necroId])

  return {
      isApprovenRef,
  }
}

export default useApproven