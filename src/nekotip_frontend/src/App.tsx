import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { nekotip_backend } from '../../declarations/nekotip_backend'

import useUser from './hooks/useUser'

function App() {
  const { principal, updatePrincipal } = useUser()

  const [text, setText] = useState('')

  const handleGreet = async () => {
    const result = await nekotip_backend.greet('NekoTip')
    setText(result)
    updatePrincipal(result)
  }

  return (
    <main className="text-3xl" onClick={handleGreet}>
      <Button type="button" variant="default">
        Click me!
      </Button>
      principal:"{principal}"<span className="ms-4 text-red-400">{text}</span>
    </main>
  )
}

export default App
