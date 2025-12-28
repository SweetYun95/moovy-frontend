import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { localLoginThunk, localSignUpThunk, logoutThunk, checkAuthThunk } from '@/features/auth/authSlice'

export default function TestAuthPage() {
   const dispatch = useAppDispatch()
   const { user, loading, error } = useAppSelector((state) => state.auth)

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')

   const handleLogin = () => {
      if (!email || !password) {
         alert('이메일과 비밀번호를 입력해주세요.')
         return
      }
      dispatch(localLoginThunk({ email, password }))
   }

   const handleSignUp = () => {
      if (!email || !password || !name) {
         alert('이메일, 비밀번호, 이름을 모두 입력해주세요.')
         return
      }
      dispatch(localSignUpThunk({ email, password, name }))
   }

   const handleLogout = () => {
      dispatch(logoutThunk())
   }

   const handleSocialLogin = (provider: string) => {
      const width = 500
      const height = 600
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      window.open(`/oauth?provider=${provider}`, 'oauthPopup', `width=${width},height=${height},left=${left},top=${top}`)
   }

   useEffect(() => {
      // 1. Window Message Listener
      const handleMessage = (event: MessageEvent) => {
         if (event.origin !== window.location.origin) return
         if (event.data.type === 'OAUTH_SUCCESS') {
            dispatch(checkAuthThunk())
         }
      }
      window.addEventListener('message', handleMessage)

      // 2. BroadcastChannel Listener
      const channel = new BroadcastChannel('oauth_channel')
      channel.onmessage = (event) => {
         if (event.data.type === 'OAUTH_SUCCESS') {
            dispatch(checkAuthThunk())
         }
      }

      return () => {
         window.removeEventListener('message', handleMessage)
         channel.close()
      }
   }, [dispatch])

   return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#333' }}>
         <h1 style={{ color: '#fff' }}>Test Auth Page</h1>

         <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', background: '#f5f5f5' }}>
            <h2>Status</h2>
            <p>Loading: {loading ? 'True' : 'False'}</p>
            <p style={{ color: 'red' }}>Error: {error ? JSON.stringify(error) : 'None'}</p>
            <p>User: {user ? JSON.stringify(user, null, 2) : 'Not Logged In'}</p>
            {user && (
               <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Logout
               </button>
            )}
         </div>

         {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
               <h3>Sign Up / Login Form</h3>
               <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} placeholder="test@example.com" />
               </div>
               <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password:</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} placeholder="password" />
               </div>
               <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Name (Sign Up Only):</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} placeholder="Your Name" />
               </div>

               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={handleLogin} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                     Login
                  </button>
                  <button onClick={handleSignUp} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                     Sign Up
                  </button>
               </div>

               <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  <h3>Social Login</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <button onClick={() => handleSocialLogin('google')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#db4437', color: 'white', border: 'none' }}>
                        Google Login
                     </button>
                     <button onClick={() => handleSocialLogin('kakao')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#fee500', color: 'black', border: 'none' }}>
                        Kakao Login
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
