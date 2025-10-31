import React from 'react'
import { useParams } from 'react-router-dom'

export default function ContentDetailPage() {
  const { id } = useParams()
  return (
    <div className="container py-4">
      <h2 className="mb-3">Content Detail</h2>
      <p>Content ID: {id}</p>
    </div>
  )
}


