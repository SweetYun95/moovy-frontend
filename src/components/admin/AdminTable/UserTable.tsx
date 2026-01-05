// moovy-frontend/src/components/admin/AdminTable/UserTable.tsx

import React, { useMemo, useState } from 'react'

import Avatar from '../../../assets/Avatar.png'
import AdminUserDetailModal, { type AdminUserTableRow } from '../../modals/AdminUserDetailModal/AdminUserDetailModal'

interface TableProps {
   content: string
   columns: string[]
   filters?: Record<string, any>
   onDataCountChange?: (count: number) => void
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

const getSanctionCount = (sanction: unknown): number => {
   if (typeof sanction !== 'string') return 0
   if (sanction.includes('회')) {
      const n = Number(sanction.replace('회', ''))
      return Number.isFinite(n) ? n : 0
   }
   return 0
}

const UserTable: React.FC<TableProps> = ({ content, columns, filters, onDataCountChange }) => {
   const [tableData, setTableData] = useState([
      {
         user_id: 1,
         name: 'Natali Craig',
         email: 'natali.craig@example.com',
         comment: 12,
         reply: 3,
         sanction: '없음',
      },
      {
         user_id: 2,
         name: 'Drew Cano',
         email: 'drew.cano@example.com',
         comment: 0,
         reply: 8,
         sanction: '1회',
      },
      {
         user_id: 3,
         name: 'Orlando Diggs',
         email: 'orlando.diggs@example.com',
         comment: 31,
         reply: 21,
         sanction: '없음',
      },
      {
         user_id: 4,
         name: 'Andi Lane',
         email: 'andi.lane@example.com',
         comment: 4,
         reply: 0,
         sanction: '3회',
      },
   ])

   const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
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

      if (!hasAnyFilter) return tableData

      return tableData.filter((row) => {
         if (userId !== null && row.user_id !== userId) return false
         if (nickname && !row.name.toLowerCase().includes(nickname)) return false
         if (email && !row.email.toLowerCase().includes(email)) return false

         if (replyMin !== null && row.reply < replyMin) return false
         if (replyMax !== null && row.reply > replyMax) return false
         if (commentMin !== null && row.comment < commentMin) return false
         if (commentMax !== null && row.comment > commentMax) return false

         const sanctionCount = getSanctionCount(row.sanction)
         if (warning === 'none' && sanctionCount > 0) return false
         if (warning === 'warning' && sanctionCount === 0) return false

         return true
      })
   }, [filters, tableData])

   React.useEffect(() => {
      onDataCountChange?.(filteredTableData.length)
   }, [filteredTableData.length, onDataCountChange])

   const selectedUser: AdminUserTableRow | null = useMemo(() => {
      if (!selectedUserId) return null
      const row = tableData.find((u) => u.user_id === selectedUserId)
      if (!row) return null
      const sanctionCount = getSanctionCount(row.sanction)

      return {
         user_id: row.user_id,
         name: row.name,
         email: row.email,
         sanctionCount,
         profileImage: Avatar,
      }
   }, [selectedUserId, tableData])

   const openUserModal = (userId: number) => {
      setSelectedUserId(userId)
      setIsUserModalOpen(true)
   }

   const closeUserModal = () => {
      setIsUserModalOpen(false)
   }

   return (
      <>
         {filteredTableData.map((data) => (
            <ul className="data" key={data.user_id}>
               <li>
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  <img src={Avatar} alt="user avatar" /> {data.user_id}
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  {data.name}
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  {data.email}
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  {data.comment}
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  {data.reply}
               </li>
               <li style={{ cursor: 'pointer' }} onClick={() => openUserModal(data.user_id)}>
                  {data.sanction}
               </li>
            </ul>
         ))}

         <AdminUserDetailModal
            isOpen={isUserModalOpen}
            onClose={closeUserModal}
            user={selectedUser}
            onUpdated={(next) => {
               setTableData((prev) =>
                  prev.map((row) => {
                     if (row.user_id !== next.user_id) return row
                     return {
                        ...row,
                        name: next.name,
                        sanction: next.sanctionCount > 0 ? `${next.sanctionCount}회` : '없음',
                     }
                  }),
               )
            }}
         />
      </>
   )
}

export default UserTable
