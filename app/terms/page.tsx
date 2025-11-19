'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWeavStore } from '@/store/useWeavStore'

export default function TermsPage() {
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
            Terms of Service
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
                Agreement to Terms
              </h2>
              <p className="text-body leading-relaxed">
                By accessing or using Weav, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are 
                prohibited from using or accessing this platform.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Use License</h2>
              <p className="text-body leading-relaxed mb-3">
                Permission is granted to temporarily access and use Weav for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title, and 
                under this license you may not:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on Weav</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
                <li>• Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>User Accounts</h2>
              <p className="text-body leading-relaxed mb-3">
                To access certain features of Weav, you may be required to create an account. You agree to:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• Provide accurate, current, and complete information</li>
                <li>• Maintain and update your account information</li>
                <li>• Maintain the security of your password and account</li>
                <li>• Accept responsibility for all activities under your account</li>
                <li>• Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>User Content</h2>
              <p className="text-body leading-relaxed mb-3">
                You retain ownership of any content you post on Weav. By posting content, you grant us 
                a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute 
                your content for the purpose of operating and promoting Weav. You represent and warrant that:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• You own or have the right to post the content</li>
                <li>• Your content does not violate any third-party rights</li>
                <li>• Your content is not illegal, harmful, or offensive</li>
                <li>• Your content does not contain malware or malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Prohibited Conduct</h2>
              <p className="text-body leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="space-y-2 text-body ml-4">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe upon the rights of others</li>
                <li>• Post false, misleading, or deceptive content</li>
                <li>• Harass, abuse, or harm other users</li>
                <li>• Spam or send unsolicited communications</li>
                <li>• Interfere with or disrupt the platform&apos;s operation</li>
                <li>• Attempt to gain unauthorized access to any part of the platform</li>
                <li>• Use automated systems to access the platform without permission</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Intellectual Property</h2>
              <p className="text-body leading-relaxed">
                The Weav platform, including its design, features, and functionality, is owned by Weav 
                and is protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws. You may not use our trademarks, logos, or other proprietary 
                information without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Termination</h2>
              <p className="text-body leading-relaxed">
                We reserve the right to suspend or terminate your account and access to Weav at any time, 
                with or without cause or notice, for any reason including, but not limited to, breach of 
                these Terms. Upon termination, your right to use the platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Disclaimer</h2>
              <p className="text-body leading-relaxed">
                The materials on Weav are provided on an &quot;as is&quot; basis. Weav makes no warranties, expressed 
                or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or 
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Limitation of Liability</h2>
              <p className="text-body leading-relaxed">
                In no event shall Weav or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or 
                inability to use Weav, even if Weav or a Weav authorized representative has been notified orally 
                or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Governing Law</h2>
              <p className="text-body leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws, without 
                regard to its conflict of law provisions. Any disputes arising from these Terms or your use 
                of Weav shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Changes to Terms</h2>
              <p className="text-body leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material 
                changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. 
                Your continued use of Weav after such changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Contact Information</h2>
              <p className="text-body leading-relaxed">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-body leading-relaxed mt-2">
                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Email:</strong> legal@weav.app
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

