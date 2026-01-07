// moovy-frontend/src/components/auth/LoginForm.tsx

import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { localLoginThunk } from '@/features/auth/authSlice'

import { EmailInput, NameInput, PasswordInput } from '@/components/common/Input'
import { LoginButton } from '@/components/common/Button/Button'
import { IdSaveCheckbox } from '@/components/common/Checkbox'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!email) {
         alert('이메일을 입력하세요.')
         return
      }
      if (!password) {
         alert('비밀번호를 입력하세요.')
         return
      }

      try {
         await dispatch(localLoginThunk({ email, password })).unwrap()
         alert('환영합니다!')
         navigate('/')
      } catch (err) {
         alert('로그인에 실패했습니다.')
      }
   }

   return (
      <div id="loginform">
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <h3>로그인</h3>
               <div className="mb-3 mt-5 form-item">
                  <label htmlFor="email">이메일</label>
                  <EmailInput value={email} onChange={setEmail} showRightButton={false} />
               </div>
               <div className="mb-3 form-item">
                  <label htmlFor="password">비밀번호</label>
                  <PasswordInput value={password} onChange={setPassword} />
               </div>

               <IdSaveCheckbox />
               <div className="row mt-5 form-item">
                  <LoginButton loginType="local" type="submit" />
               </div>
               <div className="row mt-6 form-item">
                  <LoginButton loginType="google" />
               </div>
               <div className="row mt-3 form-item">
                  <LoginButton loginType="kakao" />
               </div>
            </div>
         </form>

         <div className="row mt-6 auth-link">
            <a href="/register">회원가입</a>
            <a href="">아이디 찾기</a>
            <a href="">비밀번호 찾기</a>
         </div>
      </div>
   )
}

export default LoginForm
