import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { FileText } from 'lucide-react';

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

const Terms: React.FC = () => {
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
            <FileText size={14} /> LEGAL
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-secondary text-sm mb-3">
            Last updated: {LAST_UPDATED}
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Terms &amp; Conditions</span>
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
                    These Terms &amp; Conditions govern your use of the Gym Performance Center website, mobile application, and all related services (collectively, the "Platform"). By accessing or using our Platform, you agree to be legally bound by these terms. If you do not agree, please discontinue use immediately.
                  </p>
                </div>

                <Section title="1. Acceptance of Terms">
                  <p>
                    By creating an account, booking a class, or using any feature of the Gym Performance Center Platform, you confirm that you are at least 16 years of age, have read and understood these Terms &amp; Conditions, and agree to be bound by them. If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
                  </p>
                </Section>

                <Section title="2. Membership & Account">
                  <p className="mb-3">
                    Your membership grants you access to the Platform and our physical facility according to the membership tier purchased. You are responsible for maintaining the confidentiality of your account credentials. You agree to:
                  </p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2">Provide accurate and complete registration information</li>
                    <li className="mb-2">Notify us immediately of any unauthorized use of your account</li>
                    <li className="mb-2">Not share your membership access with others</li>
                    <li className="mb-2">Not transfer your membership without written consent from management</li>
                  </ul>
                </Section>

                <Section title="3. Payments & Refunds">
                  <p className="mb-3">
                    All membership fees are billed in advance on a monthly or annual basis. Class bookings and personal training sessions are non-refundable unless cancelled at least 24 hours before the scheduled time. We reserve the right to change pricing with 30 days notice. Chargebacks without valid dispute resolution may result in account suspension.
                  </p>
                </Section>

                <Section title="4. Class Booking & Cancellation">
                  <p>
                    Members may book classes through the Platform subject to availability. To avoid a no-show fee, cancellations must be made at least 2 hours before the class start time. Repeated no-shows may result in temporary booking restrictions. Gym Performance Center reserves the right to cancel or reschedule classes due to low enrollment or unforeseen circumstances.
                  </p>
                </Section>

                <Section title="5. Health & Safety Waiver">
                  <p className="mb-3">
                    By using our facilities and services, you acknowledge that physical exercise carries inherent risks. You confirm that you are physically capable of participating in fitness activities and that you have consulted or will consult a medical professional if you have any pre-existing health conditions. Gym Performance Center, its staff, and affiliates are not liable for any injury, illness, or health event arising from your participation in fitness activities.
                  </p>
                </Section>

                <Section title="6. Acceptable Use">
                  <p className="mb-3">You agree not to use the Platform or physical premises to:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li className="mb-2">Harass, threaten, or intimidate other members or staff</li>
                    <li className="mb-2">Engage in any fraudulent activity or misrepresentation</li>
                    <li className="mb-2">Upload harmful, illegal, or offensive content to the community portal</li>
                    <li className="mb-2">Attempt to reverse-engineer, scrape, or copy any part of the Platform</li>
                    <li className="mb-2">Violate any applicable law or regulation</li>
                  </ul>
                </Section>

                <Section title="7. Intellectual Property">
                  <p>
                    All content on the Platform — including text, images, logos, graphics, workout programs, and software — is owned by Gym Performance Center or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
                  </p>
                </Section>

                <Section title="8. Termination">
                  <p>
                    We reserve the right to suspend or permanently terminate your account at our discretion if you violate these Terms, engage in disruptive behavior, or if your membership is cancelled. Upon termination, your right to access the Platform ceases immediately. We are not obligated to provide a refund upon termination resulting from a breach of these Terms.
                  </p>
                </Section>

                <Section title="9. Limitation of Liability">
                  <p>
                    To the maximum extent permitted by law, Gym Performance Center shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or physical facilities. Our total liability for any claim shall not exceed the amount you paid in the 30 days preceding the incident.
                  </p>
                </Section>

                <Section title="10. Changes to These Terms">
                  <p>
                    We may revise these Terms at any time. We will notify active members via email or in-platform notification. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.
                  </p>
                </Section>

                <div className="pt-4 border-top border-secondary border-opacity-10">
                  <p className="text-secondary text-sm mb-1">
                    For questions about these Terms, contact us at:
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

export default Terms;
