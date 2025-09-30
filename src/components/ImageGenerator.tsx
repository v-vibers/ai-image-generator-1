import { useState } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
}

interface ErrorState {
  type: 'insufficient_credits' | 'rate_limit_exceeded' | 'network' | null
  message: string
  retryAfter?: number
}

export function ImageGenerator() {
  const { client, signOut, usage, subscriptionStatus, subscribe, user } = useSubscribeDev()

  const [prompt, setPrompt] = useState('')
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>({ type: null, message: '' })

  const handleGenerate = async () => {
    if (!client || !prompt.trim()) return

    setLoading(true)
    setError({ type: null, message: '' })

    try {
      const { output } = await client.run('black-forest-labs/flux-schnell', {
        input: {
          prompt: prompt.trim(),
          width: 1024,
          height: 1024
        }
      })

      const newImage: GeneratedImage = {
        url: output[0] as string,
        prompt: prompt.trim(),
        timestamp: Date.now()
      }

      setGeneratedImages(prev => [newImage, ...prev])
      setPrompt('')
    } catch (err: any) {
      console.error('Generation failed:', err)

      switch (err.type) {
        case 'insufficient_credits':
          setError({
            type: 'insufficient_credits',
            message: 'You have run out of credits. Please upgrade your plan to continue generating images.'
          })
          break
        case 'rate_limit_exceeded':
          setError({
            type: 'rate_limit_exceeded',
            message: `Rate limit exceeded. Please try again in ${Math.ceil((err.retryAfter || 0) / 1000)} seconds.`,
            retryAfter: err.retryAfter
          })
          break
        default:
          setError({
            type: 'network',
            message: 'Failed to generate image. Please check your connection and try again.'
          })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="image-generator">
      <header className="app-header">
        <div className="header-content">
          <h1>AI Image Generator</h1>
          <div className="user-info">
            <div className="usage-info">
              <span className="credits">
                {usage?.remainingCredits ?? 0} credits
              </span>
              <span className="plan">
                {subscriptionStatus?.plan?.name ?? 'Free'} Plan
              </span>
            </div>
            <button onClick={subscribe!} className="manage-button">
              Manage Plan
            </button>
            <button onClick={signOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="generator-main">
        <div className="generator-section">
          <div className="prompt-container">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image you want to create... (Press Enter to generate, Shift+Enter for new line)"
              className="prompt-input"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              className="generate-button"
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {error.type && (
            <div className={`error-message error-${error.type}`}>
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <p>{error.message}</p>
                {error.type === 'insufficient_credits' && (
                  <button onClick={subscribe!} className="upgrade-button">
                    Upgrade Now
                  </button>
                )}
                {error.type === 'network' && (
                  <button onClick={handleGenerate} className="retry-button">
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-skeleton">
              <div className="skeleton-image"></div>
              <div className="loading-text">
                <span className="spinner"></span>
                Creating your image...
              </div>
            </div>
          )}
        </div>

        <div className="gallery">
          {generatedImages.length === 0 && !loading && (
            <div className="empty-state">
              <span className="empty-icon">🖼️</span>
              <h2>No images yet</h2>
              <p>Enter a prompt above to generate your first AI image</p>
            </div>
          )}

          {generatedImages.map((image, index) => (
            <div key={index} className="image-card">
              <img
                src={image.url}
                alt={image.prompt}
                loading="lazy"
              />
              <div className="image-info">
                <p className="image-prompt">{image.prompt}</p>
                <time className="image-time">
                  {new Date(image.timestamp).toLocaleString()}
                </time>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}