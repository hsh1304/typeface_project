import React, { useState } from 'react'
import axios from 'axios'

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    
    setError('')
    
    // Check file type on frontend
    const allowedTypes = ['.txt', '.jpg', '.jpeg', '.png', '.json']
    const fileExt = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExt)) {
      setError('File type not allowed. Please upload .txt, .jpg, .jpeg, .png, or .json files only.')
      return
    }
    
    setStatus('Uploading...')
    
    const form = new FormData()
    form.append('file', file)
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStatus('Uploaded')
      setError('')
      setFile(null) // Clear the file input
      window.dispatchEvent(new Event('files-updated'))
    } catch (err) {
      console.error(err)
      setStatus('')
      
      // Extract error message from response
      const errorMessage = err.response?.data?.error || 'Upload failed. Please try again.'
      setError(errorMessage)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex items-center gap-4">
        <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
        <div>{status}</div>
      </form>
      {error && (
        <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}