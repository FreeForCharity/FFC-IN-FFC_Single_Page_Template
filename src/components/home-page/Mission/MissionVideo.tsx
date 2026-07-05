'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const VIDEO_TITLE = "Learn about Free For Charity's mission to help nonprofits reduce costs"

/**
 * Click-to-play facade for the mission video. The multi-megabyte mp4 is not
 * referenced in the initial HTML (outside <noscript>) — only the poster image
 * loads with the page. The real <video> is mounted (and autoplays) on first
 * click, keeping the homepage transfer size small on slow or mobile
 * connections.
 *
 * Progressive enhancement: without JavaScript the facade button is inert, so
 * a <noscript> block hides it and serves the plain <video> element directly.
 * Browsers with scripting enabled treat <noscript> content as text and never
 * fetch it, preserving the page-weight win; crawlers still see the mp4 URL.
 */
const MissionVideo = () => {
  const [activated, setActivated] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Activating the facade unmounts the focused button; move focus onto the
  // mounted video so keyboard and screen-reader users land on the controls
  // (WCAG 2.4.3) instead of falling back to <body> while audio plays.
  useEffect(() => {
    if (activated) videoRef.current?.focus()
  }, [activated])

  if (!activated) {
    return (
      <>
        <noscript>
          <style>{'.mission-video-facade{display:none}'}</style>
          <video
            className="w-full max-w-[800px] rounded-lg shadow-lg"
            controls
            playsInline
            preload="metadata"
            poster={assetPath('/videos/mission-video-poster.webp')}
            aria-label="Free For Charity mission video"
            title={VIDEO_TITLE}
          >
            <source src={assetPath('/videos/mission-video.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </noscript>
        <button
          type="button"
          onClick={() => setActivated(true)}
          className="mission-video-facade group relative block w-full max-w-[800px] cursor-pointer overflow-hidden rounded-lg shadow-lg"
          aria-label="Play the Free For Charity mission video"
          title={VIDEO_TITLE}
        >
          <Image
            src={assetPath('/videos/mission-video-poster.webp')}
            alt=""
            width={1920}
            height={1080}
            className="w-full"
          />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 transition-colors group-hover:bg-[#b35000]">
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
                <path d="M28 16 0 32V0l28 16Z" fill="#fff" />
              </svg>
            </span>
          </span>
        </button>
      </>
    )
  }

  return (
    <video
      ref={videoRef}
      className="w-full max-w-[800px] rounded-lg shadow-lg"
      controls
      autoPlay
      playsInline
      poster={assetPath('/videos/mission-video-poster.webp')}
      aria-label="Free For Charity mission video"
      title={VIDEO_TITLE}
    >
      <source src={assetPath('/videos/mission-video.mp4')} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

export default MissionVideo
