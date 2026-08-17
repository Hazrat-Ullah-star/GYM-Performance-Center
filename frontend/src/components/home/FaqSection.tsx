import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is included in the membership?',
      a: 'All memberships include 24/7 access to state-of-the-art gym equipment, locker rooms, steam room, free WiFi, and an initial fitness assessment with a certified coach.',
    },
    {
      q: 'Do I need to book group classes in advance?',
      a: 'Yes, we recommend booking through your online member dashboard or mobile web app at least 2 hours before class to reserve your spot.',
    },
    {
      q: 'Can I pause or cancel my membership?',
      a: 'Absolutely. Monthly memberships can be cancelled at any time with 7 days notice. Annual plans can be frozen for up to 60 days per year.',
    },
    {
      q: 'Is personal training available?',
      a: 'Yes! We have certified specialist trainers available for 1-on-1 coaching in strength, HIIT, yoga, nutrition, and post-rehab conditioning.',
    },
    {
      q: 'What are the gym opening hours?',
      a: 'We are open Monday to Friday from 5:00 AM to 11:00 PM, and Saturday to Sunday from 6:00 AM to 10:00 PM.',
    },
  ];

  return (
    <section className="spad position-relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Got Questions?</span>
              <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>Frequently Asked Questions</h2>
            </div>

            <div className="d-flex flex-column gap-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="g-glass-card overflow-hidden">
                  <button
                    className="w-100 p-4 text-start bg-transparent border-0 d-flex justify-content-between align-items-center text-white fw-bold"
                    style={{ fontSize: '18px' }}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="text-warning" /> : <ChevronDown className="text-warning" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-secondary text-sm border-top border-secondary border-opacity-10 pt-3" style={{ lineHeight: '1.7' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
