'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu } from 'react-icons/fi'
import { LiaSearchSolid } from 'react-icons/lia'
import { RxCross2 } from 'react-icons/rx'
import { assetPath } from '@/lib/assetPath'
import { siteConfig } from '@/lib/site.config'

interface MenuItem {
  label: string
  path: string
}

const SCROLL_OFFSET = 100

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  const menuItems: MenuItem[] = useMemo(
    () => [
      { label: 'Home', path: '/#hero' },
      { label: 'Mission', path: '/#mission' },
      { label: 'Programs', path: '/#programs' },
      { label: 'Volunteer', path: '/#volunteer' },
      { label: 'Donate', path: '/#donate' },
      { label: 'FAQ', path: '/#faq' },
      { label: 'Team', path: '/#team' },
    ],
    []
  )

  const sections = useMemo(
    () =>
      menuItems.map((item) => item.path.replace('/#', '')).filter((section) => section !== 'hero'),
    [menuItems]
  )

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId)
            return
          }
        }
      }
      // If at the top, set home as active
      if (window.scrollY < SCROLL_OFFSET) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScrollSpy)
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [sections])

  const handleSearchToggle = () => setIsSearchOpen(!isSearchOpen)
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    const sectionId = path.replace('/#', '')
    if (sectionId === 'hero') return activeSection === ''
    return activeSection === sectionId
  }

  return (
    <header
      id="header"
      className={`w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 ${
        isScrolled ? 'h-[55px]' : 'h-[80px]'
      }`}
    >
      <div className="w-full">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex items-center px-2 transition-all duration-300">
            {/* Logo */}
            <div
              className={`transition-all duration-300 ${isScrolled ? 'w-[110px]' : 'w-[150px]'}`}
            >
              <Link href="/" onClick={handleLinkClick} className="block">
                <Image
                  src={assetPath('/Images/logo.webp')}
                  alt={siteConfig.name}
                  width={686}
                  height={234}
                  priority
                  className={`w-auto max-w-none object-contain transition-all duration-300 ${
                    isScrolled ? 'h-7' : 'h-11'
                  }`}
                />
              </Link>
            </div>

            {/* Menu or Search */}
            {!isSearchOpen ? (
              <div className="flex items-center justify-end sm:pl-[50px] md:pl-[70px] w-full">
                {/* Desktop Menu */}
                <nav
                  aria-label="Primary navigation"
                  className="hidden lg:block transition-all duration-300"
                >
                  <ul className="flex items-center space-x-[1px] font-navbar font-[600]">
                    {menuItems.map((item, index) => (
                      <li key={index} className="relative py-6">
                        <Link
                          href={item.path}
                          onClick={handleLinkClick}
                          className={`flex items-center px-3 py-2 text-[14px] transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'text-blue-600'
                              : 'text-gray-600 hover:text-gray-500'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Search Icon */}
                <div className="hidden lg:flex items-center">
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Search"
                  >
                    <LiaSearchSolid className="h-5 w-5 cursor-pointer" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMobileMenuOpen ? (
                    <RxCross2 className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </button>
              </div>
            ) : (
              // Search Input
              <div className="w-full max-w-[750px] ml-auto flex items-center justify-between transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 focus:outline-none"
                  autoFocus
                  aria-label="Search input"
                />
                <button
                  onClick={handleSearchToggle}
                  className="ml-2 p-2 text-gray-600"
                  aria-label="Close search"
                >
                  <RxCross2 className="cursor-pointer h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu — mounted only when open (so its links aren't focusable
          while collapsed) and animated in with a CSS entrance. */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={`lg:hidden absolute left-0 w-full overflow-hidden z-40 animate-menuExpand ${
            isScrolled ? 'top-[53px]' : 'top-[77px]'
          }`}
        >
          <div
            className={`max-w-[700px] mx-auto px-6 py-4 bg-white border-t-[3px] border-[#2EA3F2] shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-h-[80vh] overflow-auto`}
          >
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={handleLinkClick}
                    className={`block px-4 py-2 rounded-lg text-sm font-[600] ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
