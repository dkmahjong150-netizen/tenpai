'use client'

import { useState } from 'react'

function generateKey(deviceId: string) {
  const cleanId = deviceId.trim().toUpperCase()
  if (!cleanId) return ''
  
  let hash = 0
  const combined = cleanId + 'TENPAI_SECRET_SALT_2024'
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  
  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')
  return `TENPAI-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}`
}

export default function AdminPage() {
  const [deviceId, setDeviceId] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deviceId) return
    const key = generateKey(deviceId)
    setGeneratedKey(key)
    setCopied(false)
  }

  const handleCopy = () => {
    if (!generatedKey) return
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#38bdf8' }}>
          Tenpai License Generator
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', textAlign: 'center' }}>
          Generate lisensi aktivasi aplikasi Tenpai
        </p>

        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Device ID Target
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Contoh: MAH-04146690"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Generate Subscription Key
          </button>
        </form>

        {generatedKey && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#cbd5e1' }}>
              Hasil License Key
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={generatedKey}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #22c55e',
                  color: '#4ade80',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: copied ? '#166534' : '#334155',
                  color: '#fff',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
