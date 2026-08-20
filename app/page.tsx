export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="mx-auto max-w-md space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">ShortVideoApp</p>
        <h1 className="text-4xl font-bold">Next.js + Capacitor Build Scaffold</h1>
        <p className="text-sm text-white/70">
          This minimal App Router scaffold exists so the mobile build pipeline can produce
          the exported web bundle and sync native shells successfully.
        </p>
      </div>
    </main>
  )
}
