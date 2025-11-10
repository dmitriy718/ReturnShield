import './LoadingScreen.css'

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

