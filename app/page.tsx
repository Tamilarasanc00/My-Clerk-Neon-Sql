import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const LandingPage = () => {
  return (
    <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to my Task
            </h1>
          </div>
          <div className="space-x-4 pt-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Explore more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage