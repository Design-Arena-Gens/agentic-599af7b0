'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

const defaultWebsites = [
  {
    id: 1,
    name: 'neal.fun',
    url: 'https://neal.fun',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    description: 'Interactive projects and games'
  },
  {
    id: 2,
    name: 'The Useless Web',
    url: 'https://theuselessweb.com',
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
    description: 'Random weird websites'
  },
  {
    id: 3,
    name: 'A Soft Murmur',
    url: 'https://asoftmurmur.com',
    image: 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=400&h=300&fit=crop',
    description: 'Ambient sounds mixer'
  }
]

export default function Home() {
  const [websites, setWebsites] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    image: '',
    description: ''
  })
  const [draggedCard, setDraggedCard] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('websites')
    if (saved) {
      setWebsites(JSON.parse(saved))
    } else {
      setWebsites(defaultWebsites)
    }
  }, [])

  useEffect(() => {
    if (websites.length > 0) {
      localStorage.setItem('websites', JSON.stringify(websites))
    }
  }, [websites])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newWebsite = {
      id: Date.now(),
      ...newSite
    }
    setWebsites([...websites, newWebsite])
    setNewSite({ name: '', url: '', image: '', description: '' })
    setShowForm(false)
  }

  const deleteWebsite = (id) => {
    setWebsites(websites.filter(site => site.id !== id))
  }

  const handleDragStart = (e, index) => {
    setDraggedCard(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedCard === null || draggedCard === index) return

    const newWebsites = [...websites]
    const draggedItem = newWebsites[draggedCard]
    newWebsites.splice(draggedCard, 1)
    newWebsites.splice(index, 0, draggedItem)

    setWebsites(newWebsites)
    setDraggedCard(index)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>✨ Website Cards</h1>
        <p className={styles.subtitle}>Your personal collection of cool websites</p>
      </header>

      <div className={styles.controls}>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Website'}
        </button>
        {websites.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={() => {
              if (confirm('Clear all websites?')) {
                setWebsites([])
                localStorage.removeItem('websites')
              }
            }}
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Website name (e.g., neal.fun)"
            value={newSite.name}
            onChange={(e) => setNewSite({...newSite, name: e.target.value})}
            required
            className={styles.input}
          />
          <input
            type="url"
            placeholder="URL (e.g., https://neal.fun)"
            value={newSite.url}
            onChange={(e) => setNewSite({...newSite, url: e.target.value})}
            required
            className={styles.input}
          />
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={newSite.image}
            onChange={(e) => setNewSite({...newSite, image: e.target.value})}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newSite.description}
            onChange={(e) => setNewSite({...newSite, description: e.target.value})}
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            Add to Collection
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {websites.map((site, index) => (
          <div
            key={site.id}
            className={`${styles.card} ${draggedCard === index ? styles.dragging : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <button
              className={styles.deleteButton}
              onClick={() => deleteWebsite(site.id)}
              aria-label="Delete"
            >
              ✕
            </button>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <div className={styles.imageContainer}>
                {site.image ? (
                  <img
                    src={site.image}
                    alt={site.name}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    🌐
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{site.name}</h3>
                {site.description && (
                  <p className={styles.cardDescription}>{site.description}</p>
                )}
                <span className={styles.cardUrl}>{site.url}</span>
              </div>
            </a>
          </div>
        ))}
      </div>

      {websites.length === 0 && !showForm && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No websites yet! Click "Add Website" to get started.</p>
        </div>
      )}
    </div>
  )
}
