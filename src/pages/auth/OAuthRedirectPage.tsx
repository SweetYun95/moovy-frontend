import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function OAuthRedirectPage() {
   const [searchParams] = useSearchParams()
   const provider = searchParams.get('provider')

   useEffect(() => {
      if (provider) {
         // Redirect to backend auth endpoint
         // VITE_APP_API_URL is http://localhost:8000/api
         // Backend route is /api/auth/{provider}
         // So we need to construct: http://localhost:8000/api/auth/{provider}
         const apiUrl = import.meta.env.VITE_APP_API_URL
         window.location.href = `${apiUrl}/auth/${provider}`
      }
   }, [provider])

   return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
         <p>Redirecting to {provider}...</p>
      </div>
   )
}
