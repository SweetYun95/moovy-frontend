// eslint.config.js (ESLint v9 flat config)
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
   // dist, build 산출물 무시
   globalIgnores(['dist', 'build']),

   // TS/TSX 대상
   {
      files: ['**/*.{ts,tsx}'],

      // 권장 세트들
      extends: [
         js.configs.recommended,
         // 타입 체크 없이 기본 규칙만 사용 — 빠름
         tseslint.configs.recommended,
         // 타입 정보까지 사용하려면 위 줄 대신 ↓ 두 줄로 교체하고 parserOptions.project 설정 필요
         // ...tseslint.configs.recommendedTypeChecked,
         // ...tseslint.configs.stylisticTypeChecked,

         reactHooks.configs['recommended-latest'],
         reactRefresh.configs.vite,
      ],

      languageOptions: {
         ecmaVersion: 2023,
         sourceType: 'module',
         globals: globals.browser,
         // 타입체크 규칙을 쓸 때만 활성화 (위 주석 참고)
         // parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: import.meta.dirname },
      },

      plugins: {
         prettier,
      },

      rules: {
         // --- 미사용 변수: '경고'로 (TS 버전 사용)
         'no-unused-vars': 'off',
         '@typescript-eslint/no-unused-vars': [
            'warn',
            {
               argsIgnorePattern: '^_', // _arg 형태는 무시
               varsIgnorePattern: '^_', // _var 형태는 무시
               ignoreRestSiblings: true,
            },
         ],

         // React Hooks
         'react-hooks/rules-of-hooks': 'error',
         'react-hooks/exhaustive-deps': 'warn',

         // HMR 안전 (Vite)
         'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

         // Prettier를 경고로만 보고 (형식 문제로 빌드 막히지 않게)
         'prettier/prettier': 'warn',
      },
   },
])
