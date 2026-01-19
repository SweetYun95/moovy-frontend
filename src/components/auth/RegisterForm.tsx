// moovy-frontend/src/components/auth/RegisterForm.tsx

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { localSignUpThunk } from '@/features/auth/authSlice'

import { EmailInput, Input, NameInput, NicknameInput, PasswordInput } from '@/components/common/Input'
import { LoginButton } from '@/components/common/Button/Button'
import { PasswordCheckInput } from '../common/Input/InputComponents'

const RegisterForm = () => {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [checkPassword, setCheckPassword] = useState('')
   const [matched, setMatched] = useState(true)

   const dispatch = useDispatch()

   useEffect(() => {
      if (checkPassword.length === 0) {
         setMatched(true)
         return
      }

      setMatched(password === checkPassword)
   }, [password, checkPassword])

   const onClick = () => {
      // 이메일 중복확인 로직
      if (!email || email.length <= 1) {
         alert('올바른 이메일을 입력해 주세요.')
         return
      }
      console.log(email)
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (password != checkPassword) {
         alert('비밀번호가 일치하지 않습니다.')
         return
      }

      const registerData = {
         name,
         email,
         password,
      }

      dispatch(localSignUpThunk(registerData))
   }

   return (
      <div id="registerform">
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <h3>회원가입</h3>

               <div className="mb-3 mt-5 form-item">
                  <label htmlFor="name">이름</label>
                  <NameInput value={name} onChange={setName} />
               </div>
               <div className="mb-3 form-item">
                  <label htmlFor="email">이메일</label>
                  <EmailInput value={email} onChange={setEmail} onClick={onClick} />
               </div>
               <div className="mb-3 form-item gap">
                  <label htmlFor="password">비밀번호</label>
                  <PasswordInput value={password} onChange={setPassword} />
                  <PasswordCheckInput value={checkPassword} onChange={setCheckPassword} matched={matched} />
               </div>

               <div className="row mt-5 form-item">
                  <LoginButton loginType="register" type="submit" />
               </div>
            </div>
         </form>

         <div className="row mt-6 auth-link">
            {/* 기능 추가 후 처리 */}
            <a href="">아이디 찾기</a>
            <a href="">비밀번호 찾기</a>
         </div>
      </div>
   )
}

export default RegisterForm
