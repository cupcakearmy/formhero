import React from 'react'
import { createRoot } from 'react-dom/client'

export function mount(Node: React.FC) {
  const section = window.document.createElement('section')
  window.document.body.appendChild(section)
  createRoot(section).render(<Node />)
}
