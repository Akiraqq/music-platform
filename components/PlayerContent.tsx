'use client'

import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai'
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import { SkewLoader } from 'react-spinners'
import useSound from 'use-sound'

import { Song } from '@/types'

import MediaItem from './MediaItem'
import LikeButton from './LikeButton'
import Slider from './Slider'
import usePlayer from '@/hooks/usePlayer'

interface PlayerContentProps {
  song: Song
  songUrl: string
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer()
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isLoaded, setIsLoaded] = useState(false)

  const Icon = isPlaying ? BsPauseFill : BsPlayFill
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId)
    const nextSong = player.ids[currentIndex + 1]

    if (!nextSong) {
      return player.setId(player.ids[0])
    }

    player.setId(nextSong)
  }

  const onPlayPrevius = () => {
    if (player.ids.length === 0) {
      return
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId)
    const previusSong = player.ids[currentIndex - 1]

    if (!previusSong) {
      return player.setId(player.ids[player.ids.length - 1])
    }

    player.setId(previusSong)
  }

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      setIsLoaded(true)
      setIsPlaying(true)
    },
    onend: () => {
      setIsPlaying(false)
      onPlayNext()
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  })

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  useEffect(() => {
    setIsPlaying(false)
    setDuration(sound?.duration() || 0)
    sound?.play()

    const updateCurrentTime = () => {
      if (sound) {
        setCurrentTime(sound?.seek() || 0)
      }
    }

    const intervalId = setInterval(updateCurrentTime, 1000)

    return () => {
      clearInterval(intervalId)
      sound?.unload()
    }
  }, [sound])

  const handlePlay = () => {
    if (!isLoaded) {
      return
    }

    if (!isPlaying) {
      play()
    } else {
      pause()
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1)
    } else {
      setVolume(0)
    }
  }

  const progress = (currentTime / duration) * 100

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 h-full relative max-w-[1920px]">
      {/* tst */}
      <div
        className="absolute top-0 left-[-16px] h-1 bg-blue-500 rounded"
        style={{ width: `${progress}%` }}
      ></div>
      {/* tst */}

      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <div className="order-1 sm:order-4">
            <LikeButton songId={song.id} />
          </div>
          <div className="hidden lg:flex text-neutral-400 text-sm sm:order-3 w-[90px]">
            {`${formatTime(currentTime)} / ${formatTime(duration)}`}
          </div>
          <div className="order-2">
            <MediaItem data={song} style />
          </div>
        </div>
      </div>

      <div
        className="
      flex
      lg:hidden
      col-auto
      gap-x-3
      justify-end
      items-center
      "
      >
        <AiFillStepBackward
          onClick={onPlayPrevius}
          size={25}
          className="
        text-neutral-400
        cursor-pointer
        hover:text-white
        transition
        "
        />
        <div
          onClick={handlePlay}
          className="
        h-9
        w-9
        flex
        items-center
        justify-center
        rounded-full
        bg-white
        p-1
        cursor-pointer
        "
        >
          {isLoaded ? (
            <Icon size={25} className="text-black" />
          ) : (
            <SkewLoader color="black" size={10} />
          )}
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={25}
          className="
       text-neutral-400
       cursor-pointer
       hover:text-white
       transition
       "
        />
      </div>

      <div
        className="
      hidden
      h-full
    lg:flex
      justify-center
      items-center
      w-full
      max-w-[722px]
      gap-x-6
      "
      >
        <AiFillStepBackward
          onClick={onPlayPrevius}
          size={30}
          className="
        text-neutral-400
        cursor-pointer
        hover:text-white
        transition
        "
        />
        <div
          onClick={handlePlay}
          className="
        flex
        items-center
        justify-center
        h-10
        w-10
        rounded-full
        bg-white
        p-1
        cursor-pointer
        "
        >
          {isLoaded ? (
            <Icon size={30} className="text-black" />
          ) : (
            <SkewLoader color="black" size={13} />
          )}
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="
       text-neutral-400
       cursor-pointer
       hover:text-white
       transition
       "
        />
      </div>

      <div className="hidden lg:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            size={34}
            className="cursor-pointer"
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  )
}

export default PlayerContent
