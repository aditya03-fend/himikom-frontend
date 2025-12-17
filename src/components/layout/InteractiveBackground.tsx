// src/components/InteractiveBackground.tsx
"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- KONFIGURASI ---
    const config = {
      particleColor: "rgba(255, 255, 255, 0.15)", // Warna titik (putih transparan)
      lineColor: "rgba(255, 255, 255, 0.03)", // Warna garis penghubung (sangat tipis)
      particleSize: 1.5, // Ukuran titik
      radius: 100, // Radius efek mouse
      floatSpeed: 0.5, // Kecepatan gerak vertikal (scroll)
      spacing: 60, // Jarak antar titik grid
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    // Mouse Position (disimpan dalam object agar bisa di-tween oleh GSAP)
    const mouse = { x: -1000, y: -1000 };
    const scroll = { y: 0 };

    // --- CLASS PARTICLE ---
    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = config.particleSize;
      }

      update() {
        // 1. Efek Mouse (Repulsion/Magnet)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = config.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * 5; // Kekuatan tolak X
        const directionY = forceDirectionY * force * 5; // Kekuatan tolak Y

        if (distance < config.radius) {
          // Jika mouse dekat, titik menjauh (efek air)
          this.vx -= directionX;
          this.vy -= directionY;
          this.size = config.particleSize * 2; // Membesar sedikit
        } else {
          // Jika mouse jauh, kembali ke posisi asal
          if (this.x !== this.originX) {
            const dxMove = this.x - this.originX;
            this.vx -= dxMove * 0.03; // Spring effect (membal)
          }
          if (this.y !== this.originY) {
            const dyMove = this.y - this.originY;
            this.vy -= dyMove * 0.03;
          }
          this.size = config.particleSize;
        }

        // 2. Efek Gesekan (Friction) agar gerakan halus
        this.vx *= 0.9;
        this.vy *= 0.9;

        // 3. Update Posisi
        this.x += this.vx;
        this.y += this.vy;

        // 4. Efek Scroll (Parallax Sederhana)
        // Kita geser originY berdasarkan scroll agar grid ikut bergerak pelan
        const parallaxY = scroll.y * 0.2; // Kecepatan parallax
        // Reset posisi jika lewat layar (Infinite Scroll illusion)
        const relativeY = (this.originY - parallaxY) % height;
        this.y +=
          (relativeY < 0 ? relativeY + height : relativeY) - this.originY;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
      }
    }

    // --- INISIALISASI ---
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];

      // Buat Grid Titik
      for (let y = 0; y < height; y += config.spacing) {
        for (let x = 0; x < width; x += config.spacing) {
          particles.push(new Particle(x, y));
        }
      }
    };

    // --- ANIMASI LOOP ---
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Update Scroll Value dari Window
      scroll.y = window.scrollY;

      // Loop update tiap partikel
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Gambar garis penghubung (Opsional: Hapus blok ini jika ingin titik saja)
      // connectParticles();

      requestAnimationFrame(animate);
    };

    // --- EVENT LISTENERS ---
    const handleResize = () => init();

    const handleMouseMove = (e: MouseEvent) => {
      // Gunakan GSAP untuk memperhalus koordinat mouse (Lerp)
      gsap.to(mouse, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sticky top-0 left-0 h-screen w-full -z-10 pointer-events-none bg-black"
    />
  );
}
