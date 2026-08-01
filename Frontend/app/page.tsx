'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Building2, ArrowRight, MapPin, Search, Shield, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const rooms = [
  {
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=90',
    title: 'Luxury Living Room',
    location: 'DHA Phase 6, Lahore',
    price: 'Rs. 85,000/mo',
    tag: 'Premium Villa'
  },
  {
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=90',
    title: 'Modern Kitchen',
    location: 'Gulshan-e-Iqbal, Karachi',
    price: 'Rs. 45,000/mo',
    tag: '3 Bed House'
  },
  {
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=90',
    title: 'Master Bedroom',
    location: 'F-10, Islamabad',
    price: 'Rs. 35,000/mo',
    tag: 'Apartment'
  },
  {
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&q=90',
    title: 'Rooftop Terrace',
    location: 'Clifton, Karachi',
    price: 'Rs. 120,000/mo',
    tag: 'Penthouse'
  },
]

const properties = [
  { id: 1, name: '2 Bedroom Flat', location: 'DHA Lahore', price: 25000, type: 'Flat', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
  { id: 2, name: '3 Bedroom House', location: 'Karachi', price: 35000, type: 'House', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' },
  { id: 3, name: '4 Bedroom Villa', location: 'Islamabad', price: 80000, type: 'Villa', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { id: 4, name: 'Studio Flat', location: 'Karachi', price: 12000, type: 'Studio', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' },
  { id: 5, name: 'Bungalow', location: 'Lahore', price: 150000, type: 'Bungalow', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { id: 6, name: '2 Bed Apartment', location: 'Rawalpindi', price: 22000, type: 'Apartment', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
]

export default function HomePage() {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    // Hero entrance
    gsap.fromTo('.hero-enter',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.15, delay: 0.3 }
    )

    // Hero image parallax
    gsap.to('.hero-img-bg', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // ===== ROOM TRAVEL EFFECT =====
    // Jaise train ki khidki se bahar dekhte hain — ek room se doosra room guzarta hai
    const roomsTrack = document.querySelector('.rooms-track') as HTMLElement
    if (roomsTrack) {
      const totalWidth = roomsTrack.scrollWidth
      const viewWidth = window.innerWidth

      gsap.to('.rooms-track', {
        x: -(totalWidth - viewWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '.rooms-wrapper',
          start: 'top top',
          end: () => `+=${totalWidth - viewWidth + 400}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        }
      })

      // Text for each room
      rooms.forEach((_, i) => {
        gsap.fromTo(`.room-label-${i}`,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.rooms-wrapper',
              start: () => `top+=${i * (totalWidth - viewWidth) / rooms.length} top`,
              end: () => `top+=${(i + 0.5) * (totalWidth - viewWidth) / rooms.length} top`,
              scrub: 0.5,
            }
          }
        )
        gsap.fromTo(`.room-label-${i}`,
          { opacity: 1, y: 0 },
          {
            opacity: 0, y: -50,
            duration: 0.4,
            ease: 'power3.in',
            scrollTrigger: {
              trigger: '.rooms-wrapper',
              start: () => `top+=${(i + 0.6) * (totalWidth - viewWidth) / rooms.length} top`,
              end: () => `top+=${(i + 1) * (totalWidth - viewWidth) / rooms.length} top`,
              scrub: 0.5,
            }
          }
        )
      })
    }

    // Properties
    gsap.utils.toArray('.prop-item').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 80, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      )
    })

    // Features
    gsap.utils.toArray('.feat-item').forEach((el: any, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      )
    })

    // CTA
    gsap.fromTo('.cta-wrap',
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-wrap', start: 'top 80%' }
      }
    )

    // Marquee
    gsap.to('.marquee-inner', {
      xPercent: -50,
      ease: 'none',
      duration: 22,
      repeat: -1
    })

    // Float
    gsap.to('.float-badge', {
      y: -12,
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    })

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={wrapperRef} className="bg-[#080808] text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-16 py-4 flex items-center justify-between bg-black/50 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">PropertyHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {['Properties', 'Features', 'About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push('/login')} className="text-gray-300 hover:text-white text-sm">Login</Button>
          <Button onClick={() => router.push('/signup')} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm px-5 shadow-lg shadow-blue-600/20">Get Started</Button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero-sec relative h-screen flex items-center overflow-hidden">
        <div className="hero-img-bg absolute inset-0 scale-110 origin-center">
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=90"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-20 max-w-5xl">
          <div className="hero-enter inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">Pakistan's #1 AI Property Platform</span>
          </div>

          <h1 className="hero-enter text-6xl md:text-8xl font-black leading-[0.9] mb-6 tracking-tight">
            Find Your<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dream Home.
            </span>
          </h1>

          <p className="hero-enter text-gray-300 text-xl mb-8 max-w-lg leading-relaxed">
            Scroll karo — kamron ke andar se guzro — apni perfect property dhundho!
          </p>

          <div className="hero-enter flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => router.push('/signup')}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-black rounded-2xl hover:-translate-y-1 transition-all duration-300 shadow-2xl"
            >
              Start Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push('/login')}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Sign In
            </Button>
          </div>

          <div className="hero-enter flex items-center gap-10 mt-12">
            {[
              { val: '500+', label: 'Properties' },
              { val: '1K+', label: 'Happy Tenants' },
              { val: '10+', label: 'Cities' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.val}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Float badges */}
        <div className="float-badge absolute right-10 top-1/3 hidden xl:block">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-xs text-white font-bold">1000+ Happy Tenants</p>
            <p className="text-xs text-gray-500">Pakistan's Best</p>
          </div>
        </div>
        <div className="float-badge absolute right-32 bottom-1/3 hidden xl:block">
          <div className="bg-blue-600/10 backdrop-blur-2xl border border-blue-500/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">New Listing</span>
            </div>
            <p className="text-white font-bold text-sm">DHA Lahore</p>
            <p className="text-blue-400 font-black">Rs. 25,000/mo</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          <p className="text-[10px] text-gray-600 tracking-[0.3em] uppercase">Scroll to explore</p>
        </div>
      </section>

      {/* ===== ROOM TRAVEL ===== */}
      <div className="rooms-wrapper relative bg-[#080808]">
        {/* Top label */}
        <div className="absolute top-8 left-0 right-0 z-30 text-center pointer-events-none">
          <p className="text-gray-500 text-xs tracking-[0.4em] uppercase mb-1">Virtual Walkthrough</p>
          <h2 className="text-2xl font-black text-white/20">Scroll to travel through rooms →</h2>
        </div>

        {/* Rooms horizontal track */}
        <div className="rooms-track flex h-screen" style={{ width: `${rooms.length * 100}vw` }}>
          {rooms.map((room, i) => (
            <div key={i} className="relative flex-shrink-0 overflow-hidden" style={{ width: '100vw', height: '100vh' }}>

              {/* Room image */}
              <Image
                src={room.img}
                alt={room.title}
                fill
                className="object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* Room number indicator */}
              <div className="absolute top-24 right-8 flex flex-col gap-2 z-20">
                {rooms.map((_, j) => (
                  <div
                    key={j}
                    className={`w-1 rounded-full transition-all duration-500 ${j === i ? 'h-8 bg-white' : 'h-2 bg-white/20'}`}
                  />
                ))}
              </div>

              {/* Room label */}
              <div className={`room-label-${i} absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20`}
                style={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {room.tag}
                  </span>
                  <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                    ● Available
                  </span>
                  <span className="text-gray-500 text-xs">{i + 1} of {rooms.length}</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-3 leading-tight">
                  {room.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-300 text-lg mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Monthly Rent</p>
                    <p className="text-4xl font-black text-blue-400">{room.price}</p>
                  </div>
                  <Button
                    onClick={() => router.push('/signup')}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 font-bold rounded-2xl px-8 hover:-translate-y-1 transition-all"
                  >
                    Book Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Divider line between rooms */}
              {i < rooms.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10 z-20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="py-5 bg-blue-600 overflow-hidden">
        <div className="marquee-inner flex gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex gap-12">
              {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'AI Search', 'Voice Agent', 'Secure Payments', 'Verified Properties', 'Smart Platform'].map(t => (
                <span key={t} className="text-white/80 text-sm font-medium">✦ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== PROPERTIES GRID ===== */}
      <section id="properties" className="py-32 px-6 md:px-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">All Listings</p>
            <h2 className="text-4xl md:text-6xl font-black">
              Featured <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Properties</span>
            </h2>
            <p className="text-gray-500 mt-4">Pakistan ke best properties — AI se search karein!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="prop-item group cursor-pointer" onClick={() => router.push('/signup')}>
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900/50 hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20">
                  <div className="relative h-60 overflow-hidden">
                    <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">{p.type}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">● Available</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors text-lg">{p.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                      <MapPin className="w-3 h-3" />
                      <span>{p.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Monthly Rent</p>
                        <p className="text-blue-400 font-black text-2xl">Rs. {p.price.toLocaleString()}</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-32 px-6 md:px-16 bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Why Us</p>
            <h2 className="text-4xl md:text-6xl font-black">
              Built <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Different.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Search, title: 'AI Smart Search', desc: 'Natural language mein search — Urdu ya English dono mein!', color: 'bg-blue-600', glow: 'shadow-blue-600/30' },
              { icon: Shield, title: 'Verified & Secure', desc: 'Har property verify ki gayi. SSL encrypted payments!', color: 'bg-green-600', glow: 'shadow-green-600/30' },
              { icon: Sparkles, title: 'Voice AI Agent', desc: 'Bol ke dhundho — AI 24/7 available hai!', color: 'bg-purple-600', glow: 'shadow-purple-600/30' },
              { icon: Building2, title: '3 Role Dashboard', desc: 'Admin, Owner, Tenant — sab ke liye alag dashboard!', color: 'bg-orange-600', glow: 'shadow-orange-600/30' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="feat-item group p-6 rounded-3xl border border-white/10 bg-[#0f0f0f] hover:border-white/20 hover:-translate-y-2 transition-all duration-400 cursor-pointer">
                  <div className={`${f.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80"
            alt="CTA"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-[#080808] to-purple-900/50" />
        </div>
        <div className="cta-wrap relative z-10 max-w-3xl mx-auto text-center bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 shadow-2xl">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Ready to Start?</p>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Your Dream Home<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Is One Click Away.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Pakistan ka best AI property platform — free signup — seconds mein results!
          </p>
          <Button
            onClick={() => router.push('/signup')}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-12 py-6 text-lg font-black rounded-2xl shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Get Started Free 🚀
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg">PropertyHub</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 PropertyHub — AI Powered Property Rental Platform</p>
          <div className="flex gap-6 text-sm text-gray-500">
            {['Privacy', 'Terms', 'Contact'].map(t => (
              <a key={t} href="#" className="hover:text-white transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}