import React, { useState } from 'react'
import axios from 'axios'

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    setStatus('Uploading...')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStatus('Uploaded')
      window.dispatchEvent(new Event('files-updated'))
    } catch (err) {
      console.error(err)
      setStatus('Upload failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-4">
      <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
      <div>{status}</div>
    </form>
  )
}