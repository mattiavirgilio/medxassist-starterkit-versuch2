import { ArrowRight, Github } from 'lucide-react';
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className='flex flex-col items-center justify-center leading-6 mt-[0.0001rem]' aria-label="Nextjs Starter Kit Hero">
            <div className="relative flex justify-center items-center max-w-[1120px] mt-4">
                {/* Light Mode Logo */}
                <Image
                    src="https://i.imgur.com/elHZAvt.png" // Schwarzes Logo für Light Mode
                    alt="MedXAssist Logo Light Mode"
                    width={500}
                    height={300}
                    priority={true}
                    className="object-contain dark:hidden" // Verstecke das Bild im Dark Mode
                />
                {/* Dark Mode Logo */}
                <Image
                    src="https://i.imgur.com/LKf6PsN.png" // Weißes Logo für Dark Mode
                    alt="MedXAssist Logo Dark Mode"
                    width={500}
                    height={300}
                    priority={true}
                    className="object-contain hidden dark:block" // Zeige das Bild nur im Dark Mode
                />
            </div>
            <p className="mx-auto max-w-[700px] text-gray-500 text-center mt-2 dark:text-gray-400">
                KI-Assistenzsysteme für Ihre Praxis 
            </p>
            <div className="flex justify-center items-center gap-3">
                <Link href="/dashboard" className="mt-5">
                    <Button className="animate-buttonheartbeat rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white">
                        Jetzt Starten
                    </Button>
                </Link>

                <Link
                    href="https://discord.gg/HUcHdrrDgY"
                    target='_blank'
                    className="mt-5"
                    aria-label="Join Discord (opens in a new tab)"
                >
                    <Button variant="outline" className="flex gap-1">
                        Chatbot Testen
                        <ArrowRight className='w-4 h-4' aria-hidden="true" />
                    </Button>
                </Link>
                <Link
                    href="https://github.com/michaelshimeles/nextjs14-starter-template"
                    target='_blank'
                    className='animate-buttonheartbeat border p-2 rounded-full mt-5 hover:dark:bg-black hover:cursor-pointer'
                    aria-label="View NextJS 14 Starter Template on GitHub"
                >
                    <Github className='w-5 h-5' aria-hidden="true" />
                </Link>
            </div>
            <div>
                <div className="relative flex max-w-6xl justify-center overflow-hidden mt-7">
                    <div className="relative rounded-xl">
                        <video
                            src="https://your-video-link.com/video.mp4"
                            width={1000}
                            height={450}
                            controls
                            autoPlay
                            loop
                            muted
                            className="block rounded-[inherit] border object-contain shadow-lg"
                        />
                        <BorderBeam size={250} duration={12} delay={9} />
                    </div>
                </div>
            </div>
        </section>
    )
}
