import { useSubscribeDev } from '@subscribe.dev/react'

export function SignInScreen() {
  const { signIn } = useSubscribeDev()

  return (
    <div className="sign-in-screen">
      <div className="sign-in-card">
        <div className="header">
          <h1>AI Image Generator</h1>
          <p className="subtitle">Create stunning images with AI</p>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">✨</span>
            <div>
              <h3>High-Quality Images</h3>
              <p>Generate beautiful images using state-of-the-art AI models</p>
            </div>
          </div>

          <div className="feature">
            <span className="feature-icon">⚡</span>
            <div>
              <h3>Lightning Fast</h3>
              <p>Get your images in seconds with optimized processing</p>
            </div>
          </div>

          <div className="feature">
            <span className="feature-icon">🎨</span>
            <div>
              <h3>Unlimited Creativity</h3>
              <p>Transform your ideas into visual masterpieces</p>
            </div>
          </div>
        </div>

        <button onClick={signIn} className="sign-in-button">
          Sign In to Get Started
        </button>

        <p className="terms">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}