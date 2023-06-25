'use client'

import { twMerge } from 'tailwind-merge'
import { useEffect, useRef } from 'react'

import useMobileSidebar from '@/hooks/useMobileSidebar'
import usePlayer from '@/hooks/usePlayer'
import { Song } from '@/types'
import Box from './Box'
import Library from './Library'

interface MobileSidebarProps {
  songs: Song[]
}
const MobileSidebar: React.FC<MobileSidebarProps> = ({ songs }) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { isOpen, onClose } = useMobileSidebar()
  const player = usePlayer()

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={sidebarRef}
      className={twMerge(
        `md:hidden fixed top-0 left-0 h-full w-64 bg-neutral-400/40 mt-1 rounded-lg backdrop-blur-sm
      gap-y-1 pb-1 pr-1 z-10 text-white transition-all duration-700 transform`,
        isOpen ? 'translate-x-0' : '-translate-x-full',
        player.activeId && 'h-[calc(100%-87px)]'
      )}
    >
      <Box className="overflow-y-auto h-full bg-neutral-900/90 backdrop-blur-sm">
        <Library songs={songs} />
      </Box>
    </div>
  )
}

export default MobileSidebar
