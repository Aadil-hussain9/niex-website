import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useInView } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ShoppingCart, MapPin, Phone, Instagram, Facebook, MessageCircle, Heart, Award, Shield, Zap, Sparkles, Star, Leaf, Wind } from "lucide-react";
import { ImageWithFallback } from './components/figma/ImageWithFallback';

/* ─── Data ─────────────────────────────────────────────── */
const carouselSlides = [
  { src: "/imports/image_(9).png", alt: "NIEX Classic Pack", label: "Classic Premium Pack", badge: "Best Seller" },
  { src: "/imports/Another_1.jpg", alt: "NIEX Special Edition", label: "Special Edition Pack", badge: "New Arrival" },
];

const dryfruitsData = [
  { src: "/imports/image-11.png", name: "Almonds", color: "rgba(139,90,43,0.9)", accent: "#c87941", desc: "Rich in Vitamin E & healthy fats" },
  { src: "/imports/image-12.png", name: "Cashews", color: "rgba(210,180,140,0.9)", accent: "#e8c99a", desc: "High protein, iron & zinc" },
  { src: "/imports/image-13.png", name: "Pistachios", color: "rgba(107,142,35,0.9)", accent: "#a8c96a", desc: "Antioxidant powerhouse" },
  { src: "/imports/image-14.png", name: "Walnuts", color: "rgba(120,100,70,0.9)", accent: "#b8956f", desc: "Omega-3 for brain health" },
  { src: "/imports/image-15.png", name: "Raisins", color: "rgba(140,30,30,0.9)", accent: "#e05555", desc: "Natural energy & iron boost" },
];

const ORBIT_FRUITS = [
  { src: "/imports/image-11.png", angle: 0, size: "w-11 sm:w-16 md:w-18" },
  { src: "/imports/image-12.png", angle: 72, size: "w-10 sm:w-14 md:w-16" },
  { src: "/imports/image-13.png", angle: 144, size: "w-11 sm:w-16 md:w-18" },
  { src: "/imports/image-14.png", angle: 216, size: "w-12 sm:w-17 md:w-20" },
  { src: "/imports/image-15.png", angle: 288, size: "w-9  sm:w-13 md:w-15" },
];

const ORBIT_FRUITS_INNER = [
  { src: "/imports/image-15.png", angle: 36, size: "w-7 sm:w-10" },
  { src: "/imports/image-13.png", angle: 108, size: "w-7 sm:w-10" },
  { src: "/imports/image-11.png", angle: 180, size: "w-7 sm:w-10" },
  { src: "/imports/image-14.png", angle: 252, size: "w-7 sm:w-10" },
  { src: "/imports/image-12.png", angle: 324, size: "w-7 sm:w-10" },
];

/* ─── Helpers ───────────────────────────────────────────── */
function useSafeWindow() {
  const [w, setW] = useState(375);
  const [h, setH] = useState(700);
  useEffect(() => {
    setW(window.innerWidth);
    setH(window.innerHeight);
    const fn = () => { setW(window.innerWidth); setH(window.innerHeight); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { w, h };
}

/* ─── Sub-components ────────────────────────────────────── */

/** Neon holographic grid background */
function HoloGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500] via-[#120a02] to-black" />
      {/* Radial amber core */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(217,119,6,0.18),transparent_70%)]" />
      {/* Cyan holographic accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_20%,rgba(6,182,212,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_80%,rgba(6,182,212,0.06),transparent_60%)]" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(rgba(251,191,36,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(251,191,36,0.6) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Floating ambient particles */
function Particles() {
  const { w, h } = useSafeWindow();
  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: i % 5 === 0 ? "rgba(6,182,212,0.6)" : "rgba(251,191,36,0.4)",
            left: Math.random() * w,
            top: Math.random() * h,
          }}
          animate={{
            y: [0, -h * 0.7],
            opacity: [0, 0.9, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 10,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/** Scroll-driven floating dry fruits */
function ScrollFruits() {
  const { scrollY } = useScroll();
  const fruits = [
    { src: "/imports/image-11.png", x: "5%", side: -1, baseY: 200, size: "w-12 sm:w-16 md:w-20" },
    { src: "/imports/image-12.png", x: "88%", side: 1, baseY: 300, size: "w-10 sm:w-14 md:w-18" },
    { src: "/imports/image-13.png", x: "10%", side: 1, baseY: 600, size: "w-10 sm:w-14 md:w-16" },
    { src: "/imports/image-14.png", x: "85%", side: -1, baseY: 800, size: "w-12 sm:w-16 md:w-20" },
    { src: "/imports/image-15.png", x: "7%", side: -1, baseY: 1100, size: "w-8  sm:w-12 md:w-14" },
    { src: "/imports/image-11.png", x: "87%", side: 1, baseY: 1400, size: "w-11 sm:w-15 md:w-18" },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {fruits.map((f, i) => (
        <ScrollFruit key={i} fruit={f} scrollY={scrollY} />
      ))}
    </div>
  );
}

function ScrollFruit({ fruit, scrollY }: { fruit: any; scrollY: any }) {
  const yOffset = useTransform(scrollY, [0, 2000], [0, fruit.side * -350]);
  const rotate = useTransform(scrollY, [0, 2000], [0, fruit.side * 120]);
  const opacity = useTransform(scrollY, [0, 100, 1800, 2000], [0, 0.45, 0.45, 0]);
  return (
    <motion.div
      className={`absolute ${fruit.size}`}
      style={{ left: fruit.x, top: fruit.baseY, y: yOffset, rotate, opacity }}
    >
      <ImageWithFallback src={fruit.src} alt="" className="w-full h-auto drop-shadow-2xl" />
    </motion.div>
  );
}

/** Logo top-right */
function Logo() {
  return (
    <motion.div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
    >
      <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 to-cyan-500/30 blur-xl rounded-full animate-pulse" />
        <div className="relative bg-black/80 backdrop-blur-sm rounded-full p-1 border-2 border-amber-400/60 shadow-2xl"
          style={{ boxShadow: "0 0 20px rgba(217,119,6,0.4), 0 0 40px rgba(6,182,212,0.1)" }}>
          <ImageWithFallback
            src="/imports/10a76b3a-2015-426a-a9d4-96654e51fe23_(1).jpg"
            alt="NIEX Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Hero Carousel */
function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }, [activeSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveSlide(prev => (prev + 1) % carouselSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveSlide(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(nextSlide, 3800);
    return () => clearInterval(t);
  }, [isPaused, nextSlide]);

  return (
    <motion.div
      className="relative z-30 w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem]"
      initial={{ opacity: 0, scale: 0.6, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 1.4, type: "spring", stiffness: 90 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow rings */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/40 to-orange-600/40 blur-3xl scale-110 animate-pulse" />
      <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-amber-500/10 blur-2xl" />

      {/* Frame */}
      <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-md"
        style={{ border: "1.5px solid rgba(251,191,36,0.5)", boxShadow: "0 0 40px rgba(217,119,6,0.3), inset 0 0 40px rgba(0,0,0,0.3)" }}>

        {/* Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${activeSlide}`}
            className="absolute top-3 left-3 z-30 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", boxShadow: "0 0 12px rgba(245,158,11,0.7)" }}
            initial={{ opacity: 0, y: -12, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            ⬡ {carouselSlides[activeSlide].badge}
          </motion.div>
        </AnimatePresence>

        {/* Slides */}
        <div className="relative w-full aspect-square sm:aspect-[1/1.05]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSlide}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d * 100, opacity: 0, scale: 0.94, filter: "brightness(0.6)" }),
                center: { x: 0, opacity: 1, scale: 1, filter: "brightness(1)" },
                exit: (d: number) => ({ x: d * -100, opacity: 0, scale: 0.94, filter: "brightness(0.6)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={carouselSlides[activeSlide].src}
                alt={carouselSlides[activeSlide].alt}
                className="w-full h-full object-cover"
              />
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-amber-500/5" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption + dots */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cap-${activeSlide}`}
            className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <p className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-lg">
              {carouselSlides[activeSlide].label}
            </p>
            <div className="flex items-center gap-1.5">
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === activeSlide
                    ? "w-5 h-2 bg-amber-400"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
                  style={i === activeSlide ? { boxShadow: "0 0 8px rgba(251,191,36,1)" } : {}}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {[{ fn: prevSlide, label: "Prev", icon: "M15 19l-7-7 7-7", side: "left-2" },
        { fn: nextSlide, label: "Next", icon: "M9 5l7 7-7 7", side: "right-2" }].map(btn => (
          <button
            key={btn.label}
            onClick={btn.fn}
            aria-label={btn.label}
            className={`absolute ${btn.side} top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm`}
            style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(251,191,36,0.35)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
            </svg>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-2 h-[3px] rounded-full bg-white/10 overflow-hidden mx-1">
        <motion.div
          key={`prog-${activeSlide}-${isPaused}`}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #f59e0b, #06b6d4)" }}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "0%" : "100%" }}
          transition={{ duration: isPaused ? 0 : 3.8, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/** Orbiting fruits ring — background layer behind carousel */
function OrbitRingBg({ angle, innerAngle }: { angle: number; innerAngle: number }) {
  const { w } = useSafeWindow();
  const isMobile = w < 640;
  const outerR = isMobile ? 148 : 210;
  const innerR = isMobile ? 100 : 145;
  const size = isMobile ? 280 : 420;

  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
    >
      {/* ── Ambient glow core ── */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, rgba(217,119,6,0.18) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)" }} />

      {/* ── HUD ring 1 (outer, slow CW) ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: isMobile ? 6 : 10, border: "1.5px solid rgba(251,191,36,0.18)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {/* Tick marks on outer ring */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute"
            style={{
              width: 2, height: isMobile ? 6 : 9,
              background: i % 3 === 0 ? "rgba(251,191,36,0.7)" : "rgba(251,191,36,0.25)",
              left: "50%", top: 0,
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              transformOrigin: `1px ${isMobile ? 131 : 195}px`,
            }}
          />
        ))}
      </motion.div>

      {/* ── HUD ring 2 (inner, faster CCW) ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: isMobile ? 36 : 52, border: "1px dashed rgba(6,182,212,0.22)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {/* Arc highlight */}
        <div className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, rgba(6,182,212,0.3) 0deg, transparent 90deg, transparent 360deg)" }} />
      </motion.div>

      {/* ── HUD ring 3 (innermost, ultra-slow CW) ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: isMobile ? 60 : 88, border: "1px solid rgba(251,191,36,0.1)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 180deg, rgba(251,191,36,0.2) 0deg, transparent 60deg, transparent 360deg)" }} />
      </motion.div>

      {/* ── Outer orbiting fruits ── */}
      {ORBIT_FRUITS.map((f, i) => {
        const rad = ((f.angle + angle) * Math.PI) / 180;
        const x = Math.cos(rad) * outerR;
        const y = Math.sin(rad) * outerR;
        return (
          <div key={`outer-${i}`}
            className={`absolute ${f.size}`}
            style={{
              left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              filter: "drop-shadow(0 0 10px rgba(217,119,6,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
            }}
          >
            <ImageWithFallback src={f.src} alt="" className="w-full h-auto" />
          </div>
        );
      })}

      {/* ── Inner counter-rotating fruits ── */}
      {ORBIT_FRUITS_INNER.map((f, i) => {
        const rad = ((f.angle - innerAngle) * Math.PI) / 180;
        const x = Math.cos(rad) * innerR;
        const y = Math.sin(rad) * innerR;
        return (
          <div key={`inner-${i}`}
            className={`absolute ${f.size}`}
            style={{
              left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              filter: "drop-shadow(0 0 8px rgba(6,182,212,0.5)) drop-shadow(0 2px 4px rgba(0,0,0,0.7))",
              opacity: 0.7,
            }}
          >
            <ImageWithFallback src={f.src} alt="" className="w-full h-auto" />
          </div>
        );
      })}

      {/* ── Floating data chips (HUD readouts) ── */}
      {[
        { label: "100% Pure", angle: 30, r: isMobile ? 138 : 197 },
        { label: "Kashmir", angle: 150, r: isMobile ? 138 : 197 },
        { label: "No Additive", angle: 270, r: isMobile ? 138 : 197 },
      ].map((chip, i) => {
        const rad = (chip.angle * Math.PI) / 180;
        const x = Math.cos(rad) * chip.r;
        const y = Math.sin(rad) * chip.r;
        return (
          <motion.div
            key={`chip-${i}`}
            className="absolute text-[7px] sm:text-[9px] font-black tracking-widest uppercase text-cyan-300 px-1.5 py-0.5 rounded"
            style={{
              left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.25)",
              backdropFilter: "blur(4px)",
              whiteSpace: "nowrap",
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, delay: i * 0.8 }}
          >
            {chip.label}
          </motion.div>
        );
      })}
    </div>
  );
}

/** Section: Ingredients showcase */
function IngredientsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cyan-400 text-xs sm:text-sm font-black tracking-[0.4em] uppercase block mb-3">
            ◆ What's Inside ◆
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #fef3c7, #f59e0b, #ea580c)" }}>
            Nature's Finest Selection
          </h2>
          <p className="text-amber-200/60 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Each nut handpicked from the valleys of Kashmir — pure, raw, unadulterated.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {dryfruitsData.map((fruit, i) => (
            <motion.div
              key={fruit.name}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(18,10,2,0.9), rgba(30,15,5,0.8))",
                border: `1px solid ${fruit.accent}33`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${fruit.color.replace("0.9", "0.15")}, transparent 70%)` }}
              />
              {/* Image */}
              <div className="relative h-40 sm:h-48 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: `radial-gradient(ellipse at center, ${fruit.color.replace("0.9", "0.4")}, transparent 70%)` }}
                />
                <motion.div
                  className="relative w-28 sm:w-32 h-28 sm:h-32"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ImageWithFallback src={fruit.src} alt={fruit.name} className="w-full h-full object-contain drop-shadow-2xl" />
                </motion.div>
              </div>
              {/* Text */}
              <div className="relative z-10 px-5 py-4 border-t" style={{ borderColor: `${fruit.accent}22` }}>
                <h3 className="font-black text-lg sm:text-xl tracking-wide" style={{ color: fruit.accent }}>
                  {fruit.name}
                </h3>
                <p className="text-amber-100/60 text-xs sm:text-sm mt-1">{fruit.desc}</p>
                <div className="flex items-center gap-1 mt-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-amber-400/60 text-xs ml-1">Premium Grade</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Last card — "& More" */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: dryfruitsData.length * 0.12 }}
            className="relative rounded-2xl overflow-hidden sm:col-span-2 lg:col-span-1 flex items-center justify-center p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(217,119,6,0.15), rgba(6,182,212,0.08))",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            <div>
              <div className="text-5xl mb-4">🫙</div>
              <h3 className="text-amber-300 font-black text-xl mb-2">Mixed Blend</h3>
              <p className="text-amber-100/50 text-sm">All five combined in perfect proportion — the complete NIEX experience.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Section: Why NIEX */
function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const benefits = [
    { icon: Award, title: "100% Authentic", desc: "Directly sourced from Kashmir farms", color: "#f59e0b" },
    { icon: Shield, title: "Zero Adulteration", desc: "No preservatives, no artificial colour", color: "#06b6d4" },
    { icon: Zap, title: "Energy Boosting", desc: "Nature's own power-packed nutrition", color: "#a3e635" },
    { icon: Leaf, title: "Farm Fresh", desc: "Seasonal harvest, sealed for freshness", color: "#10b981" },
    { icon: Heart, title: "Pure Love", desc: "Made with care for your well-being", color: "#f43f5e" },
    { icon: Wind, title: "Eco Packaged", desc: "Eco-conscious packaging, zero waste", color: "#8b5cf6" },
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(217,119,6,0.06),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-amber-400 text-xs sm:text-sm font-black tracking-[0.4em] uppercase block mb-3">◆ Why Choose Us ◆</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #fef3c7, #06b6d4, #f59e0b)" }}>
            The NIEX Promise
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -5 }}
              className="relative group p-5 sm:p-6 rounded-2xl text-center overflow-hidden cursor-default"
              style={{
                background: "rgba(15,8,2,0.8)",
                border: `1px solid ${b.color}33`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 120%, ${b.color}18, transparent 60%)` }}
              />
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                style={{ background: `${b.color}18`, border: `1px solid ${b.color}33`, boxShadow: `0 0 20px ${b.color}22` }}
              >
                <b.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: b.color }} />
              </div>
              <h3 className="font-black text-sm sm:text-base text-white mb-1">{b.title}</h3>
              <p className="text-amber-100/50 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Section: Contact */
function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-cyan-400 text-xs sm:text-sm font-black tracking-[0.4em] uppercase block mb-3">◆ Reach Us ◆</span>
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #fef3c7, #f59e0b)" }}>
            Get Your Pack Today
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Packaged & Marketed by — full-width banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="md:col-span-2 relative rounded-2xl px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.07), rgba(217,119,6,0.1))",
              border: "1px solid rgba(251,191,36,0.25)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.28)", boxShadow: "0 0 16px rgba(251,191,36,0.2)" }}>
              <span className="text-lg">📦</span>
            </div>
            {/* Text */}
            <div className="relative z-10">
              <p className="text-amber-400/60 text-[10px] font-black tracking-[0.3em] uppercase mb-0.5">
                Packaged &amp; Marketed by
              </p>
              <p
                className="font-black text-2xl sm:text-3xl leading-tight"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  background: "linear-gradient(135deg, #fde68a, #f59e0b, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(251,191,36,0.5))",
                  letterSpacing: "0.08em",
                }}
              >
                NIEX
              </p>
              <p className="text-amber-100/70 text-sm mt-0.5">
                J&amp;K, Kulgam, Kashmir, India – 192231
              </p>
            </div>
          </motion.div>

          {/* Address card */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-2xl p-5 sm:p-7 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(20,10,2,0.9), rgba(30,18,6,0.8))",
              border: "1px solid rgba(251,191,36,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="absolute top-2 right-2 w-14 opacity-10">
              <ImageWithFallback src="/imports/image-11.png" alt="" className="w-full h-auto" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center"
                style={{ boxShadow: "0 0 16px rgba(245,158,11,0.3)" }}>
                <MapPin className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-amber-200 font-black text-base sm:text-lg">Visit Our Store</h3>
            </div>
            <p className="text-amber-100/70 text-sm leading-relaxed mb-5">
              178/92, Haider Mirza Rd, Golaganj<br />
              Kaiser Bagh, Lucknow – 226018<br />
              <span className="text-amber-400/60 text-xs">(Near Rocket Dyer, Char-bati Churaha)</span>
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Phone className="w-4 h-4 text-amber-400" />
              </div>
              <a href="tel:7006994026" className="text-white font-black text-lg hover:text-amber-300 transition-colors"
                style={{ textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>
                7006994026
              </a>
            </div>
          </motion.div>

          {/* Social card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-2xl p-5 sm:p-7 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(20,10,2,0.9), rgba(30,18,6,0.8))",
              border: "1px solid rgba(6,182,212,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="absolute top-2 right-2 w-14 opacity-10">
              <ImageWithFallback src="/imports/image-12.png" alt="" className="w-full h-auto" />
            </div>
            <h3 className="text-cyan-300 font-black text-base sm:text-lg mb-5">Connect With Us</h3>
            <div className="flex flex-col gap-3">
              {[
                { href: "https://wa.me/7006994026", icon: MessageCircle, label: "WhatsApp", bg: "from-green-600 to-emerald-600", glow: "rgba(34,197,94,0.4)" },
                { href: "https://instagram.com/niex_dryfruits", icon: Instagram, label: "Instagram", bg: "from-pink-600 to-purple-600", glow: "rgba(219,39,119,0.4)" },
                { href: "https://www.facebook.com/share/17SmAkq58L/", icon: Facebook, label: "Facebook", bg: "from-blue-600 to-indigo-600", glow: "rgba(37,99,235,0.4)" },
              ].map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 bg-gradient-to-r ${s.bg} px-4 py-3 rounded-xl font-bold text-white text-sm`}
                  style={{ boxShadow: `0 4px 20px ${s.glow}` }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <s.icon className="w-5 h-5" />
                  {s.label}
                  <span className="ml-auto text-white/60 text-xs">→</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Buy Now Modal */
const PRICE_PER_PACK = 399;
const WHATSAPP_NUMBER = "917006994026"; // country code + number

function BuyModal({ quantity, setQuantity, onClose }: { quantity: number; setQuantity: any; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const isFormValid = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  const handleConfirm = () => {
    if (!isFormValid) return;
    const total = PRICE_PER_PACK * quantity;
    const msg = [
      `🌟 *New Order — NIEX Dry Fruits* 🌟`,
      ``,
      `👤 *Name:* ${name.trim()}`,
      `📞 *Phone:* ${phone.trim()}`,
      `📦 *Quantity:* ${quantity} pack(s) × 500g`,
      `💰 *Price per pack:* ₹${PRICE_PER_PACK}`,
      `🧾 *Total:* ₹${total}`,
      ``,
      `📍 *Delivery Address:*`,
      `${address.trim()}`,
      ``,
      `Please confirm my order. Thank you! 🙏`,
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  };

  /* ── Geolocation ── */
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [locApprox, setLocApprox] = useState(false); // true = IP-based (approximate)

  /** Tier 2: IP-based location — no permission needed, works everywhere */
  const detectByIP = async () => {
    setLocApprox(false);
    try {
      const res = await fetch("https://ipapi.co/json/");
      const d = await res.json();
      if (d.error) throw new Error(d.reason);
      const parts = [
        d.city,
        d.region,
        d.country_name,
        d.postal,
      ].filter(Boolean);
      setAddress(parts.join(", "));
      setLocApprox(true); // flag that it's approximate
      setLocError("");
    } catch {
      setLocError("Could not detect location. Please fill manually.");
    } finally {
      setLocLoading(false);
    }
  };

  /** Tier 1: precise GPS → reverse geocode. Falls back to IP on any failure. */
  const detectLocation = () => {
    setLocLoading(true);
    setLocError("");
    setLocApprox(false);

    // If browser geolocation is unavailable, go straight to IP fallback
    if (!navigator.geolocation || !window.isSecureContext) {
      detectByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const a = data.address || {};
          const parts = [
            a.road || a.pedestrian || a.suburb,
            a.neighbourhood || a.quarter,
            a.city || a.town || a.village || a.county,
            a.state,
            a.postcode,
          ].filter(Boolean);
          setAddress(parts.join(", "));
          setLocLoading(false);
        } catch {
          // GPS succeeded but reverse geocode failed → try IP
          detectByIP();
        }
      },
      () => {
        // Permission denied or unavailable → silently fall back to IP
        detectByIP();
      },
      { timeout: 6000, maximumAge: 60000 }
    );
  };

  const inp: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(251,191,36,0.22)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    width: "100%",
    padding: "8px 12px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    color: "rgba(251,191,36,0.55)",
    fontSize: "9px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1c0a00, #0d0500)",
          border: "1.5px solid rgba(251,191,36,0.35)",
          boxShadow: "0 0 50px rgba(217,119,6,0.35)",
          maxHeight: "96vh",
          display: "flex",
          flexDirection: "column",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-14 opacity-10 pointer-events-none">
          <ImageWithFallback src="/imports/image-11.png" alt="" className="w-full h-auto" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_50%_0%,rgba(217,119,6,0.1),transparent_60%)] pointer-events-none" />

        {/* ── Scrollable body ── */}
        <div className="relative z-10 overflow-y-auto flex-1 p-4 sm:p-5 space-y-3">

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-black text-white" style={{ textShadow: "0 0 16px rgba(251,191,36,0.5)" }}>
              ⬡ Order Now
            </h3>
            <button onClick={onClose} className="text-amber-200/40 hover:text-amber-200/80 transition-colors text-lg leading-none">✕</button>
          </div>

          {/* Price + Quantity + Total — single compact row */}
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div className="flex-1">
              <p className="text-amber-300/60 text-[10px] mb-0.5">Per 500g Pack</p>
              <p className="text-3xl font-black text-white leading-none">₹{PRICE_PER_PACK}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl font-black text-lg text-white flex items-center justify-center"
                style={{ background: "rgba(217,119,6,0.25)", border: "1px solid rgba(217,119,6,0.4)" }}
              >−</button>
              <span className="w-6 text-center text-xl font-black text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q: number) => q + 1)}
                className="w-9 h-9 rounded-xl font-black text-lg text-white flex items-center justify-center"
                style={{ background: "rgba(217,119,6,0.25)", border: "1px solid rgba(217,119,6,0.4)" }}
              >+</button>
            </div>
            <div className="text-right min-w-[60px]">
              <p className="text-amber-300/50 text-[9px]">Total</p>
              <p className="text-lg font-black text-amber-300">₹{PRICE_PER_PACK * quantity}</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(251,191,36,0.1)" }} />

          {/* Name */}
          <div>
            <label style={lbl}>Full Name <span style={{ color: "#f87171" }}>*</span></label>
            <input id="order-name" type="text" placeholder="Enter your name"
              value={name} onChange={e => setName(e.target.value)} style={inp} />
          </div>

          {/* Phone */}
          <div>
            <label style={lbl}>WhatsApp / Phone <span style={{ color: "#f87171" }}>*</span></label>
            <input id="order-phone" type="tel" placeholder="e.g. 9876543210"
              value={phone} onChange={e => setPhone(e.target.value)} style={inp} />
          </div>

          {/* Address with auto-detect */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label style={{ ...lbl, marginBottom: 0 }}>
                Delivery Address <span style={{ color: "#f87171" }}>*</span>
              </label>
              <button
                onClick={detectLocation}
                disabled={locLoading}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                style={{
                  background: locLoading ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.35)",
                  color: locLoading ? "rgba(6,182,212,0.5)" : "#22d3ee",
                  cursor: locLoading ? "not-allowed" : "pointer",
                }}
              >
                {locLoading
                  ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span>
                  : "📍"
                }
                {" "}{locLoading ? "Detecting…" : "Auto-detect"}
              </button>
            </div>
            {locError && <p className="text-red-400/80 text-[10px] mb-1">{locError}</p>}
            <textarea
              id="order-address"
              placeholder="House no., street, city, pincode…"
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={2}
              style={{ ...inp, resize: "none" }}
            />
          </div>

          {/* Helper */}
          {!isFormValid && (
            <p className="text-amber-400/50 text-[10px] text-center">Fill all fields to enable the WhatsApp button</p>
          )}

          {/* CTA */}
          <motion.button
            id="confirm-whatsapp-btn"
            disabled={!isFormValid}
            className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300"
            style={isFormValid ? {
              background: "linear-gradient(135deg, #16a34a, #059669)",
              boxShadow: "0 4px 24px rgba(22,163,74,0.55), 0 0 0 1px rgba(34,197,94,0.35)",
              color: "#fff", cursor: "pointer",
            } : {
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.2)",
              cursor: "not-allowed",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.97 } : {}}
            onClick={handleConfirm}
          >
            <MessageCircle className="w-4 h-4" />
            {isFormValid ? "Send Order on WhatsApp" : "Complete the form to order"}
          </motion.button>


          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-amber-200/50 text-sm hover:text-amber-200/80 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main App ──────────────────────────────────────────── */
export default function App() {
  const [quantity, setQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [innerAngle, setInnerAngle] = useState(0);
  const { scrollY } = useScroll();

  /* Orbit animation loop */
  useEffect(() => {
    let raf: number;
    let a = 0;
    let b = 0;
    const tick = () => {
      a += 0.14;   // outer CW
      b += 0.09;   // inner CCW
      setOrbitAngle(a);
      setInnerAngle(b);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Scroll-reactive header shrink */
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.88]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);


  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      {/* ── Fixed Layers ── */}
      <HoloGrid />
      <Particles />
      <ScrollFruits />
      <Logo />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-start px-4 pt-6 sm:pt-8 pb-10 z-20">

        {/* Header text */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          style={{ scale: headerScale, opacity: headerOpacity }}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Eyebrow */}
          <motion.span
            className="inline-block text-cyan-400 text-xs sm:text-sm font-black tracking-[0.5em] uppercase mb-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            ◆ Kashmiri Premium ◆
          </motion.span>

          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.2, type: "spring" }}
            style={{
              background: "linear-gradient(135deg, #fffbeb 0%, #fbbf24 40%, #ea580c 70%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 40px rgba(251,191,36,0.4))",
            }}
          >
            NIEX
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl md:text-2xl text-amber-100/80 italic mt-3 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            "Nourish Naturally, Live Better"
          </motion.p>
          <motion.p
            className="text-amber-400/70 text-xs sm:text-sm tracking-widest uppercase mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Premium Kashmiri Mix Dry Fruit
          </motion.p>
        </motion.div>

        {/* ═══ Orbit + Carousel stacked composition ═══
             OrbitRingBg (z-0) is BEHIND the carousel (z-10)   */}
        <div className="relative z-30 flex items-center justify-center">
          {/* --- background: orbit ring --- */}
          <OrbitRingBg angle={orbitAngle} innerAngle={innerAngle} />

          {/* --- foreground: product carousel --- */}
          <div className="relative z-10">
            <HeroCarousel />
          </div>
        </div>

        {/* "Made with Love" banner */}
        <motion.div
          className="relative z-30 mt-10 sm:mt-14 w-full max-w-lg mx-auto px-4"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 3.2, duration: 1, type: "spring" }}
        >
          <div className="relative rounded-2xl px-5 sm:px-8 py-4 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(120,53,15,0.6), rgba(154,52,18,0.5))",
              border: "1.5px solid rgba(251,191,36,0.4)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(217,119,6,0.3)",
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-lg sm:text-2xl font-black text-amber-100 flex items-center justify-center gap-3 flex-wrap relative z-10"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 fill-red-400 animate-pulse" />
              Made with Love for You
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 fill-red-400 animate-pulse" />
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          <span className="text-amber-400/40 text-[10px] tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-amber-400/30 flex items-start justify-center pt-1.5"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-amber-400"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ingredients ── */}
      <IngredientsSection />

      {/* ── Why NIEX ── */}
      <WhySection />

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <footer className="relative z-20 py-10 text-center border-t" style={{ borderColor: "rgba(251,191,36,0.1)" }}>
        {/* Decorative fruit row */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-6 opacity-20">
          {["image-11.png", "image-12.png", "image-15.png", "image-13.png", "image-14.png"].map((img, i) => (
            <motion.div
              key={i}
              className="w-8 sm:w-12"
              animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            >
              <ImageWithFallback src={`/imports/${img}`} alt="" className="w-full h-auto" />
            </motion.div>
          ))}
        </div>
        <p className="text-amber-300/40 text-xs sm:text-sm tracking-wide">© 2026 NIEX Dry Fruits  •  Premium Quality  •  Natural Goodness</p>
        <p className="text-amber-400/25 text-xs mt-1 tracking-widest">FOOD & BEVERAGES  •  LUCKNOW  •  INDIA</p>
      </footer>

      {/* ── Sticky Buy Button ── */}
      <motion.div
        className="fixed bottom-5 sm:bottom-7 right-5 sm:right-7 z-50"
        initial={{ opacity: 0, scale: 0, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 220 }}
      >
        <motion.button
          onClick={() => setShowBuyModal(true)}
          className="group relative flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 rounded-full font-black text-white text-sm sm:text-base overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #ea580c, #f59e0b)",
            backgroundSize: "200% 100%",
            boxShadow: "0 8px 32px rgba(217,119,6,0.6), 0 0 0 1px rgba(251,191,36,0.3)",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 3, repeat: Infinity }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          <span className="relative z-10">BUY NOW</span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:animate-spin" />
        </motion.button>
      </motion.div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showBuyModal && (
          <BuyModal
            quantity={quantity}
            setQuantity={setQuantity}
            onClose={() => setShowBuyModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
