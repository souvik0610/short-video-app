'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Music2, Send } from 'lucide-react'

type FeedVideo = {
  id: number
  videoUrl: string
  avatarUrl: string
  username: string
  caption: string
  likes: number
  comments: number
  shares: number
  audio: string
}

const videos: FeedVideo[] = [
  {
    id: 1,
    videoUrl: 'https://videos.pexels.com/video-files/853870/853870-hd_720_1280_25fps.mp4',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    username: 'maya.moves',
    caption: 'Golden hour city walk ✨ #reels #urbanvibes',
    likes: 12840,
    comments: 328,
    shares: 94,
    audio: 'Original audio · Maya Moves',
  },
  {
    id: 2,
    videoUrl: 'https://videos.pexels.com/video-files/2792370/2792370-hd_720_1280_30fps.mp4',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    username: 'arjun.trails',
    caption: 'Weekend reset in the mountains. Fresh air fixes everything.',
    likes: 9231,
    comments: 211,
    shares: 67,
    audio: 'Mountain breeze · Travel Beats',
  },
  {
    id: 3,
    videoUrl: 'https://videos.pexels.com/video-files/3255275/3255275-hd_720_1280_25fps.mp4',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    username: 'nina.creates',
    caption: 'A tiny studio moment before the final cut 🎬',
    likes: 18402,
    comments: 592,
    shares: 143,
    audio: 'Studio loop · Creator Mix',
  },
]

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return String(value)
}

function FeedCard({ video }: { video: FeedVideo }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(video.likes)

  const toggleLike = () => {
    setLiked((current) => {
      setLikes((count) => count + (current ? -1 : 1))
      return !current
    })
  }

  return (
    <section className="relative h-[100svh] w-full snap-start snap-always overflow-hidden bg-black text-white">
      <video
        src={video.videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5 text-sm font-semibold">
        <span className="rounded-full bg-black/25 px-3 py-1 backdrop-blur-md">Following</span>
        <span className="rounded-full bg-white px-3 py-1 text-black">For You</span>
      </div>

      <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center gap-5 sm:right-6">
        <button
          type="button"
          onClick={toggleLike}
          className="group flex flex-col items-center gap-1"
          aria-label="Like video"
        >
          <span
            className={`grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-md transition duration-200 group-active:scale-90 ${
              liked ? 'scale-110 bg-rose-500/85' : 'hover:bg-black/50'
            }`}
          >
            <Heart className={`h-7 w-7 transition ${liked ? 'fill-white text-white' : 'text-white'}`} />
          </span>
          <span className="text-xs font-bold drop-shadow">{formatCount(likes)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1" aria-label="Open comments">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-md transition hover:bg-black/50 active:scale-90">
            <MessageCircle className="h-7 w-7" />
          </span>
          <span className="text-xs font-bold drop-shadow">{formatCount(video.comments)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1" aria-label="Share video">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-md transition hover:bg-black/50 active:scale-90">
            <Send className="h-6 w-6" />
          </span>
          <span className="text-xs font-bold drop-shadow">{formatCount(video.shares)}</span>
        </button>

        <div className="grid h-12 w-12 animate-spin place-items-center rounded-full border border-white/20 bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-xl">
          <img src={video.avatarUrl} alt="Audio artwork" className="h-8 w-8 rounded-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-8 left-4 right-24 z-20 space-y-3 sm:left-6 sm:right-28">
        <div className="flex items-center gap-3">
          <img
            src={video.avatarUrl}
            alt={`${video.username} avatar`}
            className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-lg"
          />
          <p className="font-bold drop-shadow">@{video.username}</p>
          <button className="rounded-full border border-white/80 px-3 py-1 text-xs font-bold backdrop-blur-md transition hover:bg-white hover:text-black">
            Follow
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-white drop-shadow-md">{video.caption}</p>
        <div className="flex items-center gap-2 overflow-hidden text-xs text-white/85">
          <Music2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{video.audio}</span>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="h-[100svh] w-full overflow-y-auto snap-y snap-mandatory bg-black overscroll-contain scroll-smooth">
      {videos.map((video) => (
        <FeedCard key={video.id} video={video} />
      ))}
    </main>
  )
}
