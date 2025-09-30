import { useSubscribeDev } from '@subscribe.dev/react'
import { SignInScreen } from './components/SignInScreen'
import { ImageGenerator } from './components/ImageGenerator'
import './App.css'

function App() {
  const { isSignedIn } = useSubscribeDev()

  return isSignedIn ? <ImageGenerator /> : <SignInScreen />
}

export default App
