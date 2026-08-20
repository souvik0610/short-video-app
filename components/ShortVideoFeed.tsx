'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Compass,
  Heart,
  Home,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Share2,
  User,
  X,
} from 'lucide-react'

type Comment = {
  id: number
  user: string
  text: string
}

type VideoItem = {
  id: number
  videoUrl: string
  creator: string
  avatarUrl: string
  caption: string
  hashtags: string[]
  audio: string
  likes: number
  comments: Comment[]
  shares: number
}

const baseVideos: VideoItem[] = [
  {
    id: 1,
    videoUrl: 'https://videos.pexels.com/video-files/853870/853870-hd_720_1280_25fps.mp4',
    creator: 'maya.moves',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    caption: 'Golden hour city walk with clean transitions and cinematic city-light energy.',
    hashtags: ['reels', 'cityvibes', 'goldenhour'],
    audio: 'Original audio · Maya Moves',
    likes: 12840,
    comments: [
      { id: 1, user: 'riya.fit', text: 'This transition is so smooth.' },
      { id: 2, user: 'urbanlens', text: 'Golden hour never misses.' },
    ],
    shares: 94,
  },
  {
    id: 2,
    videoUrl: 'https://videos.pexels.com/video-files/2792370/2792370-hd_720_1280_30fps.mp4',
    creator: 'arjun.trails',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    caption: 'Weekend reset in the mountains. Fresh air, open skies, and a quiet trail.',
    hashtags: ['travel', 'mountains', 'weekend'],
    audio: 'Mountain breeze · Travel Beats',
    likes: 9231,
    comments: [
      { id: 1, user: 'hikeclub', text: 'Adding this place to my list.' },
      { id: 2, user: 'sneha.pix', text: 'The view is unreal.' },
    ],
    shares: 67,
  },
  {
    id: 3,
    videoUrl: 'https://videos.pexels.com/video-files/3255275/3255275-hd_720_1280_25fps.mp4',
    creator: 'nina.creates',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    caption: 'A tiny studio moment before the final cut. Making every frame count.',
    hashtags: ['creator', 'studio', 'behindthescenes'],
    audio: 'Studio loop · Creator Mix',
    likes: 18402,
    comments: [
      { id: 1, user: 'editbay', text: 'Love the setup.' },
      { id: 2, user: 'frameflow', text: 'Clean lighting and mood.' },
    ],
    shares: 143,
  },
]

function formatCount(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return String(value)
}

function CommentsDrawer({
  open,
  comments,
  creator,
  onClose,
  onAddComment,
}: {
  open: boolean
  comments: Comment[]
  creator: string
  onClose: () => void
  onAddComment: (text: string) => void
}) {
  const [text, setText] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanText = text.trim()
    if (!cleanText) return
    onAddComment(cleanText)
    setText('')
  }

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto bg-black/45' : 'pointer-events-none bg-transparent'}`}>
      <button type="button" aria-label="Close comments" className="absolute inset-0" onClick={onClose} />
      <section className={`absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-base font-bold">Comments</p>
            <p className="text-xs text-white/50">@{creator}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/10 p-2 transition hover:bg-white/20" aria-label="Close comments">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[45vh] min-h-64 space-y-4 overflow-y-auto px-5 py-4">
          {comments.map((comment) => (
            <article key={comment.id} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 text-sm font-bold">
                {comment.user.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">@{comment.user}</p>
                <p className="text-sm text-white/75">{comment.text}</p>
              </div>
            </article>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-4">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a comment..."
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
          />
          <button type="submit" className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition active:scale-95" aria-label="Post comment">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  )
}

function VideoCard({ video, active }: { video: VideoItem; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(video.likes)
  const [comments, setComments] = useState(video.comments)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [following, setFollowing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [shareLabel, setShareLabel] = useState('')

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (active) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      el.pause()
      setPlaying(false)
    }
  }, [active])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  const toggleLike = () => {
    setLiked((current) => {
      setLikes((count) => count + (current ? -1 : 1))
      return !current
    })
  }

  const shareVideo = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?video=${video.id}` : video.videoUrl
    try {
      if (navigator.share) {
        await navigator.share({ title: `@${video.creator}`, text: video.caption, url: shareUrl })
        setShareLabel('Shared')
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShareLabel('Copied')
      }
    } catch {
      setShareLabel('')
    }
    window.setTimeout(() => setShareLabel(''), 1600)
  }

  return (
    <section className="relative h-[100svh] w-full snap-start snap-always overflow-hidden bg-black text-white">
      <button type="button" aria-label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay} className="absolute inset-0 z-10 h-full w-full">
        <video ref={videoRef} src={video.videoUrl} className="h-full w-full object-cover" muted loop playsInline preload="metadata" />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
        <span className={`pointer-events-none absolute inset-0 grid place-items-center transition ${playing ? 'opacity-0' : 'opacity-100'}`}>
          <span className="rounded-full bg-black/40 p-5 backdrop-blur-md">
            {playing ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 fill-white" />}
          </span>
        </span>
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-5 px-5 pt-5 text-sm font-bold">
        <span className="text-white/55">Following</span>
        <span className="border-b-2 border-white pb-1">For You</span>
      </div>

      <aside className="absolute bottom-28 right-4 z-30 flex flex-col items-center gap-5">
        <button type="button" onClick={toggleLike} className="flex flex-col items-center gap-1 transition active:scale-90" aria-label="Like video">
          <span className={`grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur-md transition ${liked ? 'scale-110 bg-rose-500' : ''}`}>
            <Heart className={`h-7 w-7 ${liked ? 'fill-white' : ''}`} />
          </span>
          <span className="text-xs font-bold drop-shadow">{formatCount(likes)}</span>
        </button>
        <button type="button" onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 transition active:scale-90" aria-label="Comments">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur-md">
            <MessageCircle className="h-7 w-7" />
          </span>
          <span className="text-xs font-bold drop-shadow">{formatCount(comments.length)}</span>
        </button>
        <button type="button" onClick={shareVideo} className="relative flex flex-col items-center gap-1 transition active:scale-90" aria-label="Share">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur-md">
            <Share2 className="h-7 w-7" />
          </span>
          <span className="text-xs font-bold drop-shadow">{shareLabel || formatCount(video.shares)}</span>
        </button>
        <button type="button" className="grid h-12 w-12 animate-spin place-items-center rounded-full border border-white/20 bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-600 shadow-xl" aria-label="Open audio details">
          <img src={video.avatarUrl} alt="Audio disc" className="h-8 w-8 rounded-full object-cover" />
        </button>
      </aside>

      <div className="absolute bottom-24 left-4 right-24 z-30 space-y-3">
        <div className="flex items-center gap-3">
          <img src={video.avatarUrl} alt={`${video.creator} avatar`} className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-lg" />
          <button type="button" className="font-bold drop-shadow" aria-label={`Open ${video.creator} profile`}>@{video.creator}</button>
          <button type="button" onClick={() => setFollowing((value) => !value)} className={`rounded-full px-3 py-1 text-xs font-bold transition ${following ? 'bg-white/20 text-white' : 'bg-white text-black'}`}>
            {following ? 'Following' : 'Follow'}
          </button>
        </div>
        <p className={`${expanded ? '' : 'line-clamp-2'} text-sm leading-5 drop-shadow-md`}>
          {video.caption}{' '}
          {video.hashtags.map((tag) => <span key={tag} className="font-semibold text-white">#{tag} </span>)}
        </p>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="text-xs font-semibold text-white/70">
          {expanded ? 'less' : 'more'}
        </button>
        <div className="flex items-center gap-2 overflow-hidden text-xs text-white/85">
          <Music2 className="h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="animate-[ticker_8s_linear_infinite] whitespace-nowrap">{video.audio} · {video.audio}</p>
          </div>
        </div>
      </div>

      <CommentsDrawer open={drawerOpen} comments={comments} creator={video.creator} onClose={() => setDrawerOpen(false)} onAddComment={(text) => setComments((items) => [...items, { id: Date.now(), user: 'you', text }])} />
    </section>
  )
}

function BottomTabs() {
  const items = [
    { label: 'Home', icon: Home, active: true },
    { label: 'Discover', icon: Search },
    { label: 'Create', icon: Plus, primary: true },
    { label: 'Inbox', icon: Bell },
    { label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-white/10 bg-black/80 px-3 py-2 text-white backdrop-blur-xl">
      <div className="grid grid-cols-5 items-end gap-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.label} type="button" className={`flex flex-col items-center gap-1 rounded-2xl py-1 text-[11px] transition active:scale-95 ${item.active ? 'text-white' : 'text-white/55'}`}>
              <span className={`${item.primary ? 'grid h-11 w-14 place-items-center rounded-2xl bg-white text-black shadow-lg' : ''}`}>
                <Icon className={item.primary ? 'h-6 w-6' : 'h-5 w-5'} />
              </span>
              <span className={item.primary ? 'sr-only' : ''}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function ShortVideoFeed() {
  const feed = useMemo(() => Array.from({ length: 4 }).flatMap((_, cycle) => baseVideos.map((video) => ({ ...video, id: video.id + cycle * baseVideos.length }))), [])
  const [activeId, setActiveId] = useState(feed[0]?.id ?? 0)
  const itemRefs = useRef(new Map<number, HTMLElement>())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveId(Number((visible.target as HTMLElement).dataset.videoId))
      },
      { threshold: [0.55, 0.75, 0.9] }
    )

    itemRefs.current.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [feed])

  return (
    <main className="relative mx-auto h-[100svh] max-w-md overflow-hidden bg-black">
      <div className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth">
        {feed.map((video) => (
          <div
            key={video.id}
            data-video-id={video.id}
            ref={(node) => {
              if (node) itemRefs.current.set(video.id, node)
              else itemRefs.current.delete(video.id)
            }}
          >
            <VideoCard video={video} active={activeId === video.id} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-5 z-40 mx-auto flex max-w-md items-center justify-between px-5 text-white">
        <Compass className="h-6 w-6" />
        <p className="text-sm font-black tracking-wide">ShortVideo</p>
        <Search className="h-6 w-6" />
      </div>
      <BottomTabs />
      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  )
}
