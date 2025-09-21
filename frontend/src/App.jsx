import React from 'react'
import UploadForm from './components/UploadForm'
import FileList from './components/FileList'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Dropbox-lite</h1>
        <UploadForm />
        <hr className="my-4" />
        <FileList />
      </div>
    </div>
  )
}