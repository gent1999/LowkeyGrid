import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen text-gray-900" style={{
      backgroundColor: '#f5f5f5',
      backgroundImage: `
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        linear-gradient(135deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
        linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.08) 100%)
      `,
      backgroundSize: '100% 100%, 100% 100%, 20px 20px, 100% 100%'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border-2 border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-orange-600">Privacy Policy</h1>

          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you subscribe to our newsletter, submit music, or contact us. This may include your name, email address, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Send you newsletters and updates about underground hip hop news</li>
                <li>Respond to your inquiries and requests</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">3. Cookies and Tracking</h2>
              <p>
                We may use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">4. Third-Party Services</h2>
              <p>
                We may use third-party services such as analytics providers and advertising partners. These third parties may have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">5. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us using the information provided in our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">7. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-black">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
