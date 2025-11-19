'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWeavStore } from '@/store/useWeavStore'

export default function AboutPage() {
  const { theme } = useWeavStore()
  
  return (
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : ''
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 28,
          }}
        >
          <Link
            href="/"
            className={`inline-flex items-center transition-colors mb-8 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Weav
          </Link>

          <h1 className={`text-4xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            About Weav
          </h1>

          <div className={`space-y-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                What is Weav?
              </h2>
              <p className="text-body leading-relaxed">
                Weav is a revolutionary 3D conversation platform that transforms how we explore and connect ideas. 
                Instead of traditional linear feeds, Weav presents conversations as an immersive sphere where each 
                thread is a node in a beautiful, interactive 3D space. This spatial approach helps us understand 
                relationships between ideas, discover new connections, and engage with content in a more intuitive way.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Our Vision
              </h2>
              <p className="text-body leading-relaxed">
                We believe that ideas are not isolated—they form a rich, interconnected web of knowledge. 
                Weav makes these connections visible and explorable. By representing conversations spatially, 
                we enable users to navigate the &quot;mind garden&quot; of collective thought, discovering patterns, 
                relationships, and insights that might otherwise remain hidden.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Key Features
              </h2>
              <ul className="space-y-3 text-body">
                <li className="flex items-start">
                  <span className="text-primary-mid mr-3">•</span>
                  <span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Immersive 3D Sphere:</strong> Explore conversations in a beautiful, interactive 3D environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-mid mr-3">•</span>
                  <span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Real-time Collaboration:</strong> Join live chat rooms and engage with communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-mid mr-3">•</span>
                  <span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Spatial Navigation:</strong> Zoom, rotate, and dive into conversations naturally</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-mid mr-3">•</span>
                  <span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Thread Weaving:</strong> Create and connect threads to build knowledge networks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-mid mr-3">•</span>
                  <span><strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Beautiful Design:</strong> A carefully crafted interface that prioritizes clarity and aesthetics</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                The Technology
              </h2>
              <p className="text-body leading-relaxed">
                Weav is built with cutting-edge web technologies including React Three Fiber for 3D rendering, 
                Next.js for performance, and modern design principles that ensure a smooth, accessible experience 
                across all devices. We&apos;re committed to open standards, privacy, and creating tools that empower 
                users to think and communicate more effectively.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Join Us
              </h2>
              <p className="text-body leading-relaxed">
                Weav is more than a platform—it&apos;s a community of thinkers, creators, and explorers. 
                Whether you&apos;re sharing ideas, discovering new perspectives, or building connections, 
                you&apos;re part of a growing network of minds weaving together the future of conversation.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

