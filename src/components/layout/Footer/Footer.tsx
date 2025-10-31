import React from 'react'
import './Footer.scss'
import { Icon } from '@iconify/react'
import { NavLink } from 'react-router-dom'
import moovyLogo from '@/assets/moovy-logo.svg'

export interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`moovy-footer ${className}`}>
      <div className="container">
        <div className="row">
          <div className="footer-top-content col-12 d-flex align-items-center justify-content-center mb-4">
            <span>지금까지</span>
            <Icon icon="mdi:star" width={24} height={24} className="text-warning" />
            <span className="moovy-footer__count">000,000,000 개의 평가가</span>
            <span className="fw-normal">쌓였어요.</span>
          </div>
          <ul className="footer-top-links col-12">
            <li><NavLink to="/terms">서비스 이용약관</NavLink></li>
            <li><span className="sep">|</span></li>
            <li><NavLink to="/privacy">개인정보 처리방침</NavLink></li>
            <li><span className="sep">|</span></li>
            <li><NavLink to="/about">회사 안내</NavLink></li>
          </ul>
        </div>

        <div className="row">
          <div className='col-8'>
          <div className='d-flex flex-column mb-3'>
              <div className="mb-2">고객센터<span className="sep">|</span><span>cs@moovy.co.kr, 02-515-9985</span></div>
              <div className="mb-2">광고 문의<span className="sep">|</span><span>ad-sales@moovy.com 최신 광고 소개서</span></div>
              <div className="mb-2">제휴 및 대외 협력<span className="sep">|</span><a className="text-decoration-underline" href="https://moovy.team/contact">https://moovy.team/contact</a></div>
            </div>
            <ul className="footer-company">
              <li className="fw-bold">주식회사 MOOVY</li>
              <li><span className="sep">|</span></li>
              <li>대표 000</li>
              <li><span className="sep">|</span></li>
              <li>인천광역시 남동구 00로 000 00빌딩 1층</li>
              <li><span className="sep">|</span></li>
              <li>사업자 등록 번호 211-88-000000</li>
            </ul>
          </div>
            <div className="col-4 d-flex flex-column align-items-end justify-content-end">
            <div className="d-flex align-items-center mb-3">한국어 <Icon icon="mdi:chevron-down" width={18} height={18} /></div>
            <div className="d-flex moovy-footer__social">
              <a aria-label="instagram" href="#" className="opacity-75"><Icon icon="mdi:instagram" width={24} height={24} /></a>
              <a aria-label="kakao" href="#" className="opacity-75"><Icon icon="mdi:message-processing" width={24} height={24} /></a>
              <a aria-label="facebook" href="#" className="opacity-75"><Icon icon="mdi:facebook" width={24} height={24} /></a>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-start mt-2">
          <img src={moovyLogo} alt="MOOVY" height={24} />
          <div className="text-muted sep">© 2025 by MOOVY, Inc. All rights reserved.</div>
        </div>
      </div>

    </footer>
  )
}

export default Footer


