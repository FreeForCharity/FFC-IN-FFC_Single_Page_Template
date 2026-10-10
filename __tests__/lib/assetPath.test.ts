import { assetPath } from '../../src/lib/assetPath'

describe('assetPath utility', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return path without basePath when NEXT_PUBLIC_BASE_PATH is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    expect(assetPath('/logo.png')).toBe('/logo.png')
  })

  it('should return path without basePath when NEXT_PUBLIC_BASE_PATH is empty', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    expect(assetPath('/logo.png')).toBe('/logo.png')
  })

  it('should prepend basePath when NEXT_PUBLIC_BASE_PATH is set', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/FFC-IN-FFC_Single_Page_Template'
    expect(assetPath('/logo.png')).toBe('/FFC-IN-FFC_Single_Page_Template/logo.png')
  })

  it('should handle paths with subdirectories', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/FFC-IN-FFC_Single_Page_Template'
    expect(assetPath('/images/hero.jpg')).toBe('/FFC-IN-FFC_Single_Page_Template/images/hero.jpg')
  })

  it('should handle root path', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/FFC-IN-FFC_Single_Page_Template'
    expect(assetPath('/')).toBe('/FFC-IN-FFC_Single_Page_Template/')
  })
})
