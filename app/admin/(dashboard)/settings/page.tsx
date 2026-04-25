'use client'

import { useState } from 'react'
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Book,
  Activity,
  Layers,
  Zap
} from 'lucide-react'

export default function SettingsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [summary, setSummary] = useState<{ totalExtracted: number; totalChunks: number } | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus('idle')
      setSummary(null)
      setProgress(0)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setStatus('processing')
    setProgress(0)
    
    try {
      // 1. Initialize PDF.js
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

      // 2. Read PDF locally
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        fullText += pageText + '\n'
        
        // Update local reading progress (first 10%)
        setProgress(Math.round((i / pdf.numPages) * 10))
      }

      // 3. Chunk Text
      const chunkSize = 3000
      const chunks: string[] = []
      for (let i = 0; i < fullText.length; i += chunkSize) {
        chunks.push(fullText.slice(i, i + chunkSize))
      }

      setTotalChunks(chunks.length)
      let totalExtracted = 0

      // 4. Send Chunks One by One
      for (let i = 0; i < chunks.length; i++) {
        setCurrentChunk(i + 1)
        
        const res = await fetch('/api/admin/process-chunk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chunk: chunks[i],
            source: source || file.name,
            extractionPrompt: null // Will use default on server
          })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed at chunk ' + (i + 1))
        
        totalExtracted += data.count
        
        // Progress from 10% to 100%
        const processingProgress = 10 + Math.round(((i + 1) / chunks.length) * 90)
        setProgress(processingProgress)
      }

      setSummary({
        totalExtracted,
        totalChunks: chunks.length
      })
      setStatus('success')
    } catch (err: any) {
      console.error('Extraction Error:', err)
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  // Inline Styles
  const styles: Record<string, React.CSSProperties> = {
    wrapper: {
      padding: '40px',
      color: '#e5e5e5',
      fontFamily: 'monospace',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'fadeIn 0.5s ease-out'
    },
    header: {
      marginBottom: '40px',
      borderBottom: '1px solid #111',
      paddingBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'black',
      margin: 0,
      color: '#fff',
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    section: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #111',
      padding: '32px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    },
    label: {
      display: 'block',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#444',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '12px'
    },
    input: {
      width: '100%',
      backgroundColor: '#000',
      border: '1px solid #222',
      color: '#fff',
      padding: '16px',
      fontSize: '13px',
      fontFamily: 'monospace',
      outline: 'none',
      marginBottom: '24px'
    },
    uploadBox: {
      border: '2px dashed #222',
      padding: '40px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: '#050505'
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#c5ff00',
      color: '#000',
      border: 'none',
      fontWeight: 'black',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      cursor: file ? 'pointer' : 'not-allowed',
      opacity: file ? 1 : 0.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    progressContainer: {
      width: '100%',
      height: '4px',
      backgroundColor: '#111',
      marginTop: '24px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#c5ff00',
      transition: 'width 0.3s ease'
    },
    summaryCard: {
      marginTop: '24px',
      padding: '24px',
      backgroundColor: 'rgba(197, 255, 0, 0.05)',
      border: '1px solid #c5ff00',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Layers size={24} color="#c5ff00" />
          KNOWLEDGE_INGESTION_V2
        </h1>
        <p style={{ fontSize: '10px', color: '#444', marginTop: '8px' }}>SYSTEM_CORE / PDF_EXTRACTION_PIPELINE</p>
      </div>

      <div style={styles.section}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1 }}>
          <Zap size={60} color="#c5ff00" />
        </div>

        <label style={styles.label}>SOURCE_IDENTIFIER (e.g. Book Name / Video Transcript)</label>
        <input 
          style={styles.input}
          placeholder="ENTER_SOURCE_NAME..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <label style={styles.label}>PDF_DOCUMENT_PAYLOAD</label>
        <div 
          style={styles.uploadBox}
          onClick={() => document.getElementById('file-upload')?.click()}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#c5ff00'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#222'}
        >
          <input 
            id="file-upload"
            type="file" 
            accept=".pdf" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          {file ? (
            <>
              <FileText size={40} color="#c5ff00" />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{file.name}</p>
                <p style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </>
          ) : (
            <>
              <Upload size={40} color="#444" />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#666' }}>CLICK_TO_UPLOAD_PDF</p>
                <p style={{ fontSize: '10px', color: '#333', marginTop: '4px' }}>MAX_FILE_SIZE: 10MB</p>
              </div>
            </>
          )}
        </div>

        {status === 'processing' ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader2 size={32} className="animate-spin" color="#c5ff00" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#c5ff00' }}>
              {progress <= 10 ? 'READING_PDF_LOCALLY...' : `ANALYZING_PATTERNS (${currentChunk}/${totalChunks})...`}
            </p>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <button 
            style={styles.button}
            onClick={handleUpload}
            disabled={!file}
          >
            <Activity size={18} />
            Initialize Extraction
          </button>
        )}

        {status === 'success' && summary && (
          <div style={styles.summaryCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#c5ff00' }}>
              <CheckCircle2 size={24} />
              <span style={{ fontSize: '14px', fontWeight: 'black', letterSpacing: '1px' }}>EXTRACTION_COMPLETE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '9px', color: '#444', fontWeight: 'bold' }}>CHUNKS_PROCESSED</p>
                <p style={{ fontSize: '20px', fontWeight: 'black', color: '#fff' }}>{summary.totalChunks}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#444', fontWeight: 'bold' }}>PATTERNS_IDENTIFIED</p>
                <p style={{ fontSize: '20px', fontWeight: 'black', color: '#fff' }}>{summary.totalExtracted}</p>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#666', borderTop: '1px solid rgba(197, 255, 0, 0.1)', paddingTop: '12px' }}>
              Extracted items have been injected into the Knowledge Core.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ ...styles.summaryCard, borderColor: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ff4444' }}>
              <AlertCircle size={24} />
              <span style={{ fontSize: '14px', fontWeight: 'black', letterSpacing: '1px' }}>SYSTEM_ERROR</span>
            </div>
            <p style={{ fontSize: '12px', color: '#fff' }}>{errorMessage}</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
