// moovy-frontend/src/components/auth/RegisterForm.tsx
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { localSignUpThunk } from '@/features/auth/authSlice'

import { EmailInput, NameInput, PasswordInput } from '@/components/common/Input'
import { LoginButton } from '@/components/common/Button/Button'
import { PasswordCheckInput } from '../common/Input/InputComponents'

const RegisterForm = () => {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [checkPassword, setCheckPassword] = useState('')
   const [matched, setMatched] = useState(true)

   // ✅ 필드별 에러 상태
   const [fieldErrors, setFieldErrors] = useState<{
      email?: string
      password?: string
      name?: string
   }>({})

   const dispatch = useAppDispatch()
   const { error, loading } = useAppSelector((state) => state.auth)

   // ✅ 비밀번호 일치 여부 체크
   useEffect(() => {
      if (checkPassword.length === 0) {
         setMatched(true)
         return
      }

      setMatched(password === checkPassword)
   }, [password, checkPassword])

   // ✅ 서버 에러 → 필드 에러로 변환
   useEffect(() => {
      if (!error) return

      if (typeof error === 'object') {
         const err = error as any

         setFieldErrors({
            email: err?.errors?.fieldErrors?.email?.[0],
            password: err?.errors?.fieldErrors?.password?.[0],
            name: err?.errors?.fieldErrors?.name?.[0],
         })
      } else {
         alert(error)
      }
   }, [error])

   // ✅ 제출
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      // 초기화
      setFieldErrors({})

      if (!email) {
         setFieldErrors({ email: '이메일을 입력해주세요.' })
         return
      }

      if (!name) {
         setFieldErrors({ name: '닉네임을 입력해주세요.' })
         return
      }

      if (password !== checkPassword) {
         setFieldErrors({ password: '비밀번호가 일치하지 않습니다.' })
         return
      }

      dispatch(localSignUpThunk({ name, email, password }))
   }

   return (
      <div id="registerform">
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <h3>회원가입</h3>

               {/* 이름 */}
               <div className="mb-3 mt-5 form-item">
                  <label htmlFor="name">이름</label>
                  <NameInput value={name} onChange={setName} />
                  {fieldErrors.name && <p className="error">{fieldErrors.name}</p>}
               </div>

               {/* 이메일 */}
               <div className="mb-3 form-item">
                  <label htmlFor="email">이메일</label>
                  <EmailInput value={email} onChange={setEmail} />
                  {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
               </div>

               {/* 비밀번호 */}
               <div className="mb-3 form-item gap">
                  <label htmlFor="password">비밀번호</label>

                  <PasswordInput value={password} onChange={setPassword} />

                  <PasswordCheckInput value={checkPassword} onChange={setCheckPassword} matched={matched} />

                  {/* 힌트 */}
                  <p className="hint">비밀번호는 8자 이상, 대문자·소문자·숫자를 각각 포함해야 합니다.</p>

                  {fieldErrors.password && <p className="error">{fieldErrors.password}</p>}
               </div>

               {/* 버튼 */}
               <div className="row mt-5 form-item">
                  <LoginButton loginType="register" type="submit" disabled={loading} />
               </div>
            </div>
         </form>

         <div className="row mt-6 auth-link">
            <a href="">아이디 찾기</a>
            <a href="">비밀번호 찾기</a>
         </div>
      </div>
   )
}

export default RegisterForm
