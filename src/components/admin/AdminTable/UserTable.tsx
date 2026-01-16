// moovy-frontend/src/components/admin/AdminTable/UserTable.tsx

import React, { useMemo, useState } from 'react'

import Avatar from '../../../assets/Avatar.png'
import AdminUserDetailModal, { type AdminUserTableRow } from '../../modals/AdminUserDetailModal/AdminUserDetailModal'
import type { AdminUserSummary } from '../../../services/api/admin/adminUserApi'

interface TableProps {
   content: string
   columns: string[]
   filters?: Record<string, any>
   users: AdminUserSummary[]
   onRefresh?: () => void
}

const parseNumberOrNull = (value: unknown): number | null => {
   if (value === undefined || value === null) return null
   if (typeof value === 'number') return Number.isFinite(value) ? value : null
   if (typeof value !== 'string') return null
   const trimmed = value.trim()
   if (!trimmed) return null
   const n = Number(trimmed)
   return Number.isFinite(n) ? n : null
}

const parseStringOrEmpty = (value: unknown): string => {
   if (value === undefined || value === null) return ''
   return String(value).trim()
}

const toSafeNumber = (value: unknown): number => {
   if (typeof value === 'number') return Number.isFinite(value) ? value : 0
   if (typeof value === 'string') {
      const n = Number(value)
      return Number.isFinite(n) ? n : 0
   }
   return 0
}

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

const toProfileImageUrl = (raw: unknown): string | null => {
   if (typeof raw !== 'string') return null
   const trimmed = raw.trim()
   if (!trimmed) return null
   if (isHttpUrl(trimmed)) return trimmed

   // local uploads: VITE_APP_API_URL은 보통 .../api 이므로 origin으로 환원
   const apiBase = (import.meta.env.VITE_APP_API_URL as string) || ''
   const origin = apiBase.replace(/\/?api\/?$/i, '')
   const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
   return `${origin}${path}`
}

const UserTable: React.FC<TableProps> = ({ content, columns, filters, users, onRefresh }) => {
   const [selectedUser, setSelectedUser] = useState<AdminUserTableRow | null>(null)
   const [isUserModalOpen, setIsUserModalOpen] = useState(false)

   const filteredTableData = useMemo(() => {
      const userId = parseNumberOrNull(filters?.userId)
      const nickname = parseStringOrEmpty(filters?.nickname).toLowerCase()
      const email = parseStringOrEmpty(filters?.email).toLowerCase()
      const replyMin = parseNumberOrNull(filters?.reply_min)
      const replyMax = parseNumberOrNull(filters?.reply_max)
      const commentMin = parseNumberOrNull(filters?.comment_min)
      const commentMax = parseNumberOrNull(filters?.comment_max)
      const warning = parseStringOrEmpty(filters?.warning)

      const hasAnyFilter = userId !== null || nickname.length > 0 || email.length > 0 || replyMin !== null || replyMax !== null || commentMin !== null || commentMax !== null || warning.length > 0

      if (!hasAnyFilter) return users

      return users.filter((row) => {
         if (userId !== null && row.user_id !== userId) return false
         if (nickname && !row.name.toLowerCase().includes(nickname)) return false
         if (email && !row.email.toLowerCase().includes(email)) return false

         const replyCount = toSafeNumber(row.reply_count)
         const commentCount = toSafeNumber(row.comment_count)
         const sanctionCount = toSafeNumber(row.sanction_count)

         if (replyMin !== null && replyCount < replyMin) return false
         if (replyMax !== null && replyCount > replyMax) return false
         if (commentMin !== null && commentCount < commentMin) return false
         if (commentMax !== null && commentCount > commentMax) return false

         if (warning === 'none' && sanctionCount > 0) return false
         if (warning === 'warning' && sanctionCount === 0) return false

         return true
      })
   }, [filters, users])

   const openUserModal = (row: AdminUserSummary) => {
      const sanctionCount = toSafeNumber(row.sanction_count)
      const profileImage = toProfileImageUrl(row.profile_img) ?? Avatar
      setSelectedUser({
         user_id: row.user_id,
         name: row.name,
         email: row.email,
         sanctionCount,
         profileImage,
      })
      setIsUserModalOpen(true)
   }

   const closeUserModal = () => {
      setIsUserModalOpen(false)
   }

   return (
      <>
         {filteredTableData.map((data) => (
            <ul className="data" key={data.user_id} style={{ cursor: 'pointer' }} onClick={() => openUserModal(data)}>
               <li>
                  <img src={toProfileImageUrl(data.profile_img) ?? Avatar} alt="user avatar" /> {data.user_id}
               </li>
               <li>{data.name}</li>
               <li>{data.email}</li>
               <li>{toSafeNumber(data.comment_count)}</li>
               <li>{toSafeNumber(data.reply_count)}</li>
               <li>{toSafeNumber(data.sanction_count)}회</li>
            </ul>
         ))}

         <AdminUserDetailModal
            isOpen={isUserModalOpen}
            onClose={closeUserModal}
            user={selectedUser}
            onUpdated={(next) => {
               setSelectedUser(next)
               onRefresh?.()
            }}
         />
      </>
   )
}

export default UserTable
