'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const VIDEO_TITLE = "Learn about Free For Charity's mission to help nonprofits reduce costs"

/**
 * Click-to-play facade for the mission video. The multi-megabyte mp4 is not
 * referenced in the initial HTML at all — only the poster image loads with
 * the page. The real <video> is mounted (and autoplays) on first click,
 * keeping the homepage transfer size small on slow or mobile connections.
 */
const MissionVideo = () => {
  const [activated, setActivated] = useState(false)

  if (!activated) {
    return (
      <button
        type="button"
        onClick={() => setActivated(true)}
        className="group relative block w-full max-w-[800px] cursor-pointer overflow-hidden rounded-lg shadow-lg"
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
    )
  }

  return (
    <video
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
