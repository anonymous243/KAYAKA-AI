import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock localStorage
const localStorageMock = {
  store: {},
  clear: () => {
    localStorageMock.store = {}
  },
  getItem: (key) => {
    return localStorageMock.store[key] || null
  },
  setItem: (key, value) => {
    localStorageMock.store[key] = String(value)
  },
  removeItem: (key) => {
    delete localStorageMock.store[key]
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
