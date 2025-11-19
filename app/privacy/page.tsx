'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWeavStore } from '@/store/useWeavStore'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className={`text-sm mb-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Last updated: January 2025
          </p>

          <div className={`space-y-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Introduction
              </h2>
              <p className="text-body leading-relaxed">
                At Weav, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform. Please read 
                this policy carefully to understand our practices regarding your personal data.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Information You Provide</h3>
                  <ul className="space-y-2 text-body ml-4">
                    <li>• Account information (username, email address, profile picture)</li>
                    <li>• Content you create (threads, comments, messages)</li>
                    <li>• Profile information and preferences</li>
                    <li>• Communications with us</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Automatically Collected Information</h3>
                  <ul className="space-y-2 text-body ml-4">
                    <li>• Usage data and interaction patterns</li>
                    <li>• Device information and browser type</li>
                    <li>• IP address and location data (general)</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>How We Use Your Information</h2>
              <p className="text-body leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• Provide, maintain, and improve our services</li>
                <li>• Enable you to create and share content</li>
                <li>• Facilitate communication and collaboration</li>
                <li>• Personalize your experience</li>
                <li>• Analyze usage patterns to improve our platform</li>
                <li>• Ensure platform security and prevent abuse</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Data Sharing and Disclosure</h2>
              <p className="text-body leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Public Content:</strong> Content you post publicly is visible to all users</li>
                <li>• <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
                <li>• <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li>• <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Data Security</h2>
              <p className="text-body leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Your Rights</h2>
              <p className="text-body leading-relaxed mb-3">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• Access and receive a copy of your personal data</li>
                <li>• Rectify inaccurate or incomplete information</li>
                <li>• Request deletion of your personal data</li>
                <li>• Object to or restrict processing of your data</li>
                <li>• Data portability</li>
                <li>• Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Cookies and Tracking</h2>
              <p className="text-body leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist 
                with security. You can control cookies through your browser settings, though this may affect 
                some functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Children&apos;s Privacy</h2>
              <p className="text-body leading-relaxed">
                Weav is not intended for users under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you believe we have collected information from a 
                child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Changes to This Policy</h2>
              <p className="text-body leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. 
                Your continued use of Weav after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Contact Us</h2>
              <p className="text-body leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-body leading-relaxed mt-2">
                <strong className="text-white">Email:</strong> privacy@weav.app
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

