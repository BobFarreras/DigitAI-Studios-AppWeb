// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock global de resize observer (necessari per alguns components UI)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Neteja de mocks després de cada test
afterEach(() => {
  vi.clearAllMocks()
})