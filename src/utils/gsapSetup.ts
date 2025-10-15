// moovy-frontend/src/utils/gsapSetup.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initGSAP() {
   // 플러그인 등록 (필요 없으면 제거해도 무방)
   gsap.registerPlugin(ScrollTrigger)

   // 기본 이징/지속시간
   gsap.defaults({
      ease: 'power2.out',
      duration: 0.6,
   })

   // 스크롤 트리거 기본 옵션(선택)
   ScrollTrigger.defaults({
      markers: false, // 디버깅 시 true
   })
}
