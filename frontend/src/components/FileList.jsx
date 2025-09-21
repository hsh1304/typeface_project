import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function FileList() {
  const [files, setFiles] = useState([])

  async function fetchFiles() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/files`)
    setFiles(res.data)
  }

  useEffect(() => {
    fetchFiles()
    window.addEventListener('files-updated', fetchFiles)
    return () => window.removeEventListener('files-updated', fetchFiles)
  }, [])

  async function downloadFile(id) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/download/${id}`)
      window.open(res.data.url, '_blank')
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet</p>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <span className="font-medium">{file.filename}</span>
                <span className="text-sm text-gray-500 ml-2">({Math.round(file.size / 1024)} KB)</span>
              </div>
              <button 
                onClick={() => downloadFile(file.id)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}