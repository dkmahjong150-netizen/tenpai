"use client"

import { useState } from "react"

// --- LOGIKA HMAC (Sama persis dengan standar tenpai) ---
const LICENSE_SALT = process.env.NEXT_PUBLIC_LICENSE_SALT || "MSK_SECRET_SALT_2026"

async function generateHMAC(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
}

export default function AdminPage() {
  const [deviceId, setDeviceId] = useState("")
  const [months, setMonths] = useState(1)
  const [generatedKey, setGeneratedKey] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!deviceId.trim()) return
    setLoading(true)

    // Clean Device ID
    const cleanId = deviceId.trim().toUpperCase()

    // Calculate expiry date
    const now = new Date()
    const expDate = new Date(now)
    expDate.setMonth(expDate.getMonth() + months)

    const yyyy = expDate.getFullYear()
    const mm = String(expDate.getMonth() + 1).padStart(2, "0")
    const dd = String(expDate.getDate()).padStart(2, "0")
    const dateStr = `${yyyy}${mm}${dd}`

    // String to Sign: cleanDeviceId::YYYYMMDD
    const stringToSign = `${cleanId}::${dateStr}`
    const signature = await generateHMAC(stringToSign, LICENSE_SALT)
    const shortHash = signature.substring(0, 12)

    // Final Key Format: MSK-YYYYMMDD-HASH
    const fullKey = `MSK-${dateStr}-${shortHash}`

    setGeneratedKey(fullKey)
    setValidUntil(expDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))
    setCopied(false)
    setLoading(false)
  }

  const handleCopy = () => {
    if (!generatedKey) return
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "#1e1e1e",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        border: "1px solid #2a2a2a"
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
          Generate Subscription Key
        </h1>
        <p style={{ color: "#a0a0a0", fontSize: "14px", marginBottom: "24px" }}>
          Enter the player's Device ID and choose duration.
        </p>

        {/* Device ID Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ccc", marginBottom: "8px" }}>
            Player's Device ID
          </label>
          <input
            type="text"
            placeholder="e.g. MAH-04146690"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #3a3a3a",
              color: "#fff",
              fontSize: "15px",
              outline: "none"
            }}
          />
        </div>

        {/* Duration Options */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#ccc", marginBottom: "8px" }}>
            Subscription Duration
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              { label: "+1 Month", val: 1 },
              { label: "+3 Months", val: 3 },
              { label: "+1 Year", val: 12 },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setMonths(item.val)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: months === item.val ? "2px solid #fff" : "1px solid #3a3a3a",
                  backgroundColor: months === item.val ? "#333" : "#222",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !deviceId.trim()}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            opacity: deviceId.trim() ? 1 : 0.5,
            marginBottom: "24px"
          }}
        >
          {loading ? "Generating..." : "Generate Subscription Key 🔑"}
        </button>

        {/* Generated Key Result */}
        {generatedKey && (
          <div style={{
            backgroundColor: "#161616",
            borderRadius: "10px",
            padding: "16px",
            border: "1px solid #333"
          }}>
            <span style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "6px" }}>
              Subscription Key
            </span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", color: "#22c55e", wordBreak: "break-all" }}>
                {generatedKey}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  border: "1px solid #444",
                  fontSize: "12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            {validUntil && (
              <span style={{ fontSize: "11px", color: "#666", display: "block", marginTop: "10px" }}>
                Valid through {validUntil}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
