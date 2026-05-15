// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key'
process.env.NEXT_PUBLIC_MAIN_ORG_ID = '123e4567-e89b-42d3-a456-426614174000'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.ADMIN_EMAIL = 'admin@example.com'

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
