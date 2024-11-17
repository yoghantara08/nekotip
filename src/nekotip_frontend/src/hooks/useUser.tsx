import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '@/store'
import { setPrincipal } from '@/store/reducers/userSlice'

const useUser = () => {
  const { principal } = useSelector((state: RootState) => state.user)
  const dispatch: AppDispatch = useDispatch()

  const updatePrincipal = (principal: string) => {
    dispatch(setPrincipal(principal))
  }

  return { principal, updatePrincipal }
}

export default useUser
