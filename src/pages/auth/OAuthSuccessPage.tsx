import { useEffect } from 'react'

export default function OAuthSuccessPage() {
   useEffect(() => {
      // 1. Try window.opener
      if (window.opener) {
         window.opener.postMessage({ type: 'OAUTH_SUCCESS', status: 'success' }, window.location.origin)
      }

      // 2. Try BroadcastChannel (fallback if opener is lost)
      const channel = new BroadcastChannel('oauth_channel')
      channel.postMessage({ type: 'OAUTH_SUCCESS', status: 'success' })
      channel.close()

      // Close the popup
      window.close()

      // If window.close() fails (e.g. not opened by script), redirect to home
      const timer = setTimeout(() => {
         window.location.href = '/'
      }, 1000)

      return () => clearTimeout(timer)
   }, [])

   return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
         <p>Login successful! Closing window...</p>
      </div>
   )
}
