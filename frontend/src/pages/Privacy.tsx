import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { ShieldCheck } from 'lucide-react';

const LAST_UPDATED = 'August 1, 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-white fw-bold mb-3" style={{ fontSize: '20px', borderLeft: '3px solid #f36100', paddingLeft: '14px' }}>
      {title}
    </h3>
    <div className="text-secondary" style={{ fontSize: '15px', lineHeight: '1.8' }}>
      {children}
    </div>
  </div>
);

const Privacy: React.FC = () => {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="position-relative py-5 d-flex align-items-center"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.10) 0%, rgba(8,12,16,1) 80%)',
          minHeight: '28vh',
        }}
      >
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <ShieldCheck size={14} /> PRIVACY
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm mb-3">
            Last updated: {LAST_UPDATED}
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Privacy Policy</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="g-glass-card p-4 p-md-5">

                <div className="mb-5 pb-4 border-bottom border-secondary border-opacity-10">
                  <p className="text-secondary" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                    At Gym Performance Center, your privacy is a fundamental priority. This Privacy Policy explains how we collect, use, store, and protect your personal information when you access our website, mobile application, or use our physical facilities. By using our Platform, you consent to the practices described below.
                  </p>
                </div>

                <Section title="1. Information We Collect">
                  <p className="mb-3">We collect the following types of information:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2"><strong className="text-white">Account Information:</strong> Your name, email address, phone number, and password when you register.</li>
                    <li className="mb-2"><strong className="text-white">Profile & Health Data:</strong> Optional data such as fitness goals, body metrics (height, weight, BMI), and workout history you voluntarily provide.</li>
                    <li className="mb-2"><strong className="text-white">Payment Information:</strong> Billing details processed securely through our payment processor. We do not store full card numbers.</li>
                    <li className="mb-2"><strong className="text-white">Usage Data:</strong> Pages visited, class bookings, session durations, and feature interactions within the Platform.</li>
                    <li className="mb-2"><strong className="text-white">Device & Technical Data:</strong> IP address, browser type, operating system, and cookies.</li>
                  </ul>
                </Section>

                <Section title="2. How We Use Your Information">
                  <p className="mb-3">We use your information to:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2">Create and manage your member account</li>
                    <li className="mb-2">Process payments, bookings, and membership renewals</li>
                    <li className="mb-2">Personalize your fitness experience and trainer recommendations</li>
                    <li className="mb-2">Send important updates, booking confirmations, and promotional offers (with your consent)</li>
                    <li className="mb-2">Improve and secure our Platform and services</li>
                    <li className="mb-2">Comply with legal obligations</li>
                  </ul>
                </Section>

                <Section title="3. Cookies & Tracking Technologies">
                  <p>
                    We use cookies and similar tracking technologies to maintain your session, remember preferences, and analyze Platform usage. You can control cookie settings through your browser settings. Disabling essential cookies may affect core Platform functionality. We do not sell your cookies or browsing data to third-party advertisers.
                  </p>
                </Section>

                <Section title="4. Sharing of Information">
                  <p className="mb-3">
                    We do not sell, rent, or trade your personal information to third parties. We may share data with:
                  </p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2"><strong className="text-white">Service Providers:</strong> Trusted third parties who assist us in operating the Platform (e.g., payment processors, email services, cloud hosting).</li>
                    <li className="mb-2"><strong className="text-white">Trainers:</strong> Your fitness preferences and session data may be shared with assigned trainers to enhance coaching quality.</li>
                    <li className="mb-2"><strong className="text-white">Legal Authorities:</strong> When required to comply with applicable law, court orders, or to protect our rights.</li>
                  </ul>
                </Section>

                <Section title="5. Data Security">
                  <p>
                    We implement industry-standard security measures including TLS encryption for data transmission, hashed password storage, and access controls. While we take every reasonable precaution, no digital system is 100% secure. In the event of a data breach that affects your rights, we will notify you as required by law.
                  </p>
                </Section>

                <Section title="6. Data Retention">
                  <p>
                    We retain your personal data for as long as your account is active or as required to fulfill the purposes described in this Policy. Workout logs, booking history, and account data may be retained for up to 3 years after account closure for legal and audit purposes. You can request deletion earlier (see Section 8).
                  </p>
                </Section>

                <Section title="7. Children's Privacy">
                  <p>
                    Our Platform is not intended for children under the age of 16. We do not knowingly collect personal information from minors. If you believe a child has submitted data through our Platform, please contact us immediately and we will remove it.
                  </p>
                </Section>

                <Section title="8. Your Rights">
                  <p className="mb-3">You have the right to:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2">Access and receive a copy of your personal data</li>
                    <li className="mb-2">Correct inaccurate or outdated information</li>
                    <li className="mb-2">Request deletion of your account and associated data</li>
                    <li className="mb-2">Opt out of marketing communications at any time</li>
                    <li className="mb-2">Withdraw consent where processing is based on consent</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, contact us through our <Link to="/contact" className="text-warning text-decoration-none">Contact Page</Link>.
                  </p>
                </Section>

                <Section title="9. Third-Party Links">
                  <p>
                    Our Platform may contain links to external websites (e.g., social media, partner services). We are not responsible for the privacy practices of those third-party sites. We encourage you to review their respective privacy policies before sharing your data.
                  </p>
                </Section>

                <Section title="10. Changes to This Policy">
                  <p>
                    We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page and notify active members via email. Continued use of the Platform after any changes constitutes acceptance of the revised policy.
                  </p>
                </Section>

                <div className="pt-4 border-top border-secondary border-opacity-10">
                  <p className="text-secondary text-sm mb-1">
                    For privacy-related inquiries or data requests, please contact us at:
                  </p>
                  <Link to="/contact" className="text-warning text-decoration-none fw-semibold text-sm">
                    → Visit our Contact Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
