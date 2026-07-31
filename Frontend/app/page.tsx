'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Building2, Search, Shield, Sparkles, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const properties = [
  {
    id: 1,
    name: '2 Bedroom Flat — DHA Lahore',
    price: 25000,
    location: 'DHA Phase 6, Lahore',
    type: 'Flat',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
  },
  {
    id: 2,
    name: '3 Bedroom House — Gulshan Karachi',
    price: 35000,
    location: 'Gulshan-e-Iqbal, Karachi',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
  },
  {
    id: 3,
    name: '4 Bedroom Villa — Islamabad',
    price: 80000,
    location: 'F-10, Islamabad',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  },
  {
    id: 4,
    name: 'Studio Flat — Clifton Karachi',
    price: 12000,
    location: 'Clifton Block 5, Karachi',
    type: 'Studio',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
  },
  {
    id: 5,
    name: '5 Bedroom Bungalow — Model Town',
    price: 150000,
    location: 'Model Town, Lahore',
    type: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },
  {
    id: 6,
    name: '2 Bedroom Apartment — Bahria Town',
    price: 22000,
    location: 'Bahria Town, Rawalpindi',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
  },
]

export default function HomePage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero text animation
    gsap.fromTo('.hero-title',
      { opacity: 0, y: 120, skewY: 5 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.4, ease: 'power4.out' }
    )
    gsap.fromTo('.hero-sub',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
    )
    gsap.fromTo('.hero-cta',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' }
    )

    // Hero image parallax
    gsap.to('.hero-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Property cards — 3D scroll reveal
    gsap.utils.toArray('.prop-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 200,
          rotateX: 30,
          scale: 0.85,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.5,
          }
        }
      )
    })

    // Features slide in
    gsap.utils.toArray('.feat-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -150 : 150 },
        {
          opacity: 1, x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      )
    })

    // Floating animation
    gsap.to('.float-el', {
      y: -15,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    })

    // CTA section
    gsap.fromTo('.cta-content',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
        }
      }
    )

  }, [])

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">PropertyHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#properties" className="hover:text-white transition">Properties</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push('/login')} className="text-gray-300 hover:text-white text-sm">
            Login
          </Button>
          <Button onClick={() => router.push('/signup')} className="bg-blue-600 hover:bg-blue-700 text-sm px-5 rounded-xl shadow-lg shadow-blue-600/20">
            Get Started
          </Button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* Background Image with Parallax */}
        <div className="hero-img absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=90"
            alt="Luxury Property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 md:px-20 max-w-4xl">
          <div className="hero-title overflow-hidden">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">🇵🇰 Pakistan's #1 AI Property Platform</p>
            <h1 className="text-5xl md:text-8xl font-black leading-none mb-6">
              Find Your<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
          </div>

          <p className="hero-sub text-gray-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            AI powered search — Lahore, Karachi, Islamabad — apni marzi ki property seconds mein dhundhein!
          </p>

          <div className="hero-cta flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => router.push('/signup')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-base font-bold rounded-2xl shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 transition-all hover:-translate-y-0.5"
            >
              Start Searching Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push('/login')}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-2xl backdrop-blur-sm"
            >
              Sign In
            </Button>
          </div>

          {/* Stats */}
          <div className="hero-cta mt-16 flex items-center gap-12">
            {[
              { value: '500+', label: 'Properties' },
              { value: '1K+', label: 'Happy Tenants' },
              { value: '10+', label: 'Cities' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating badges */}
        <div className="float-el absolute right-8 top-1/3 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
            <p className="text-xs text-gray-400">AI Powered Search</p>
            <p className="text-white font-bold">🤖 Smart Assistant</p>
          </div>
        </div>
        <div className="float-el absolute right-32 top-1/2 hidden lg:block">
          <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-2xl">
            <p className="text-xs text-blue-400">New Listing</p>
            <p className="text-white font-bold text-sm">🏠 DHA Lahore</p>
            <p className="text-blue-400 font-black">Rs. 25,000/mo</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-600 tracking-widest uppercase">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== PROPERTIES SECTION ===== */}
      <section id="properties" className="py-32 px-6 md:px-12 relative" style={{ perspective: '1200px' }}>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Top Listings</p>
            <h2 className="text-4xl md:text-6xl font-black">
              Featured
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Properties</span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">Scroll karo aur properties ko 3D mein dekhein</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <div
                key={p.id}
                className="prop-card group cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => router.push('/signup')}
              >
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900/80 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20">

                  {/* Real Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                        {p.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                        ● Available
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                      <MapPin className="w-3 h-3" />
                      <span>{p.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Monthly Rent</p>
                        <p className="text-blue-400 font-black text-xl">Rs. {p.price.toLocaleString()}</p>
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

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-32 px-6 md:px-12 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Why Us</p>
            <h2 className="text-4xl md:text-6xl font-black">
              Why Choose
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> PropertyHub?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'AI Smart Search',
                desc: 'Natural language mein search karein — "Lahore mein 2 bedroom flat 20 hazaar mein" — AI seconds mein dhundh dega!',
                color: 'from-blue-600 to-blue-400',
                img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'
              },
              {
                icon: Shield,
                title: 'Secure & Verified',
                desc: 'Har property verified hai. SSL encrypted payments. Apna paisa 100% safe hai hamare platform pe!',
                color: 'from-green-600 to-green-400',
                img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80'
              },
              {
                icon: Sparkles,
                title: 'Voice AI Assistant',
                desc: 'Bol ke property dhundho! Urdu ya English — hamare AI voice agent se baat karein — 24/7 available!',
                color: 'from-purple-600 to-purple-400',
                img: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&q=80'
              },
              {
                icon: Building2,
                title: '3 Role Dashboard',
                desc: 'Admin, Owner, Tenant — teeno ke liye alag dashboards. Sab kuch ek jagah manage karein!',
                color: 'from-orange-600 to-orange-400',
                img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&q=80'
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="feat-card group relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
                  </div>
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80"
            alt="CTA Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80" />
        </div>

        <div className="cta-content relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Find Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Perfect Home?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10">Thousands of properties — AI powered search — secure payments. Sab kuch ek jagah!</p>
          <Button
            onClick={() => router.push('/signup')}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-12 py-6 text-lg font-black rounded-2xl shadow-2xl hover:-translate-y-1 transition-all"
          >
            Get Started Free 🚀
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-black">PropertyHub</span>
        </div>
        <p className="text-gray-600 text-sm">© 2026 PropertyHub — AI Powered Property Rental Platform</p>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </footer>

    </div>
  )
}