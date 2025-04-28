"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
const HeroSection = () => {
    const imageRef = useRef(null)
    useEffect(()=>{
        const imageElement = imageRef.current;
        const handleScroll = ()=>{
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            
            if(scrollPosition > scrollThreshold) {
                imageElement.classList.add('scrolled');
                } else {
                imageElement.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
        }

    },[])
  return (
    <section className='w-full pt-32 md:pt-44 lg:pt-52 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto '>
                <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title'>
                EduSync: AI-Powered 
                <br />
                Career Intelligence.
                </h1>
                <p className='mx-auto max-w-[600px]  md:text-xl  text-muted-foreground'>
                Navigate the evolving job market and prepare for your dream career with our AI-powered platform.
                <br />
                </p>
            </div>
            <div className='flex justify-center space-x-4'>
                <Link href="/dashboard">
                    <Button size="lg" className="px-8">Explore Features</Button>
                </Link>
            </div>
            <div className='hero-image-wrapper mt-5 md:mt-0 flex items-center justify-center' >
                <div ref={imageRef} className='hero-image'>
                    <Image 
                    src={"/Hero.png"}
                    alt="Dashboard Preview"
                    width={1080}
                    height={720}
                    className='rounded-lg shadow-2xl border mx-auto'
                    priority
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
