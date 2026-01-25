import React from 'react'
import { Calendar, ArrowRight, Clock, Users, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { HeroHeader } from './header'
import Link from 'next/link'

export const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.6,
      },
    },
  },
} as const;


export default function HeroSection() {
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-blue-600)]">
                <section className="relative">
                    {/* Decorative SVG Background Elements */}
                    <svg className="absolute left-0 top-20 h-96 w-96 opacity-5 dark:opacity-[0.02]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#3B82F6" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.3,76.1C26.8,83.2,11.1,84.8,-4.8,92.8C-20.7,100.8,-41.4,115.2,-57.5,111.1C-73.6,107,-85.1,84.4,-90.8,63.1C-96.5,41.8,-96.4,20.9,-94.2,1.4C-92,-18.1,-87.7,-36.2,-78.8,-50.9C-69.9,-65.6,-56.4,-76.9,-41.6,-83.7C-26.8,-90.5,-13.4,-92.8,0.5,-93.6C14.4,-94.4,28.8,-93.7,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                    
                    <svg className="absolute right-0 top-40 h-80 w-80 opacity-5 dark:opacity-[0.02]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#10B981" d="M47.3,-82.4C59.9,-73.1,67.7,-56.3,73.8,-39.9C79.9,-23.5,84.3,-7.5,83.1,8.1C81.9,23.7,75.1,38.9,65.3,51.5C55.5,64.1,42.7,74.1,28.3,78.8C13.9,83.5,-2.1,82.9,-17.8,78.7C-33.5,74.5,-48.9,66.7,-61.7,55.1C-74.5,43.5,-84.7,28.1,-88.3,11.3C-91.9,-5.5,-88.9,-23.7,-80.6,-38.5C-72.3,-53.3,-58.7,-64.7,-43.8,-73.3C-28.9,-81.9,-12.6,-87.7,3.5,-93.5C19.6,-99.3,34.7,-91.7,47.3,-82.4Z" transform="translate(100 100)" />
                    </svg>


                    <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-balance text-5xl font-medium md:text-6xl">
                                Healthcare Made Simple
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto mt-6 max-w-2xl text-pretty text-lg">
                                Schedule appointments, manage patient records, and access barangay health services all in one place. Your community's health is our priority.
                            </TextEffect>

                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="mt-12">
                                <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                                    <Link href={'/auth/login'}>
                                        <Button
                                            size="lg"
                                            className="rounded-lg bg-blue-600 hover:bg-blue-700">
                                            <Calendar className="mr-2 size-5" />
                                            Book Appointment
                                        </Button>
                                    </Link>
                                    <a href={'/#features'}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="rounded-lg border-2">
                                            Learn More
                                            <ArrowRight className="ml-2 size-5" />
                                        </Button>
                                    </a>
                                </div>

                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left">
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                                        <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                            <AppComponent />

                                            <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const AppComponent = () => {
    return (
        <div className="relative space-y-4 rounded-[1rem] bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950/40 dark:to-indigo-950/40 overflow-hidden">
            {/* Decorative SVG Background */}
            <svg className="absolute -right-8 -top-8 size-32 opacity-10 dark:opacity-5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#3B82F6" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.3,76.1C26.8,83.2,11.1,84.8,-4.8,92.8C-20.7,100.8,-41.4,115.2,-57.5,111.1C-73.6,107,-85.1,84.4,-90.8,63.1C-96.5,41.8,-96.4,20.9,-94.2,1.4C-92,-18.1,-87.7,-36.2,-78.8,-50.9C-69.9,-65.6,-56.4,-76.9,-41.6,-83.7C-26.8,-90.5,-13.4,-92.8,0.5,-93.6C14.4,-94.4,28.8,-93.7,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
            
            <svg className="absolute -bottom-6 -left-6 size-24 opacity-10 dark:opacity-5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#10B981" d="M47.3,-82.4C59.9,-73.1,67.7,-56.3,73.8,-39.9C79.9,-23.5,84.3,-7.5,83.1,8.1C81.9,23.7,75.1,38.9,65.3,51.5C55.5,64.1,42.7,74.1,28.3,78.8C13.9,83.5,-2.1,82.9,-17.8,78.7C-33.5,74.5,-48.9,66.7,-61.7,55.1C-74.5,43.5,-84.7,28.1,-88.3,11.3C-91.9,-5.5,-88.9,-23.7,-80.6,-38.5C-72.3,-53.3,-58.7,-64.7,-43.8,-73.3C-28.9,-81.9,-12.6,-87.7,3.5,-93.5C19.6,-99.3,34.7,-91.7,47.3,-82.4Z" transform="translate(100 100)" />
            </svg>

            {/* Header */}
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Calendar className="size-4" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">Today</div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-300">{new Date().toDateString()}</div>
                    </div>
                </div>
                <div className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    12 Appointments
                </div>
            </div>

            {/* Appointment Cards */}
            <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900/50">
                    <div className="flex flex-col items-center rounded-md bg-blue-100 px-2 py-1 dark:bg-blue-900/50">
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-100">09:00</div>
                        <div className="text-[9px] text-blue-600 dark:text-blue-300">AM</div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Maria Santos</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                            <Stethoscope className="size-3" />
                            <span>General Checkup</span>
                        </div>
                    </div>
                    <div className="size-2 rounded-full bg-emerald-500"></div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900/50">
                    <div className="flex flex-col items-center rounded-md bg-amber-100 px-2 py-1 dark:bg-amber-900/50">
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-100">10:30</div>
                        <div className="text-[9px] text-amber-600 dark:text-amber-300">AM</div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Juan Reyes</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                            <Stethoscope className="size-3" />
                            <span>Immunization</span>
                        </div>
                    </div>
                    <div className="size-2 rounded-full bg-amber-500"></div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-white/50 p-2 dark:bg-slate-900/30">
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">8</div>
                    <div className="text-[9px] text-slate-600 dark:text-slate-400">Pending</div>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">4</div>
                    <div className="text-[9px] text-slate-600 dark:text-slate-400">Done</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-slate-400">0</div>
                    <div className="text-[9px] text-slate-600 dark:text-slate-400">Cancelled</div>
                </div>
            </div>
        </div>
    )
}