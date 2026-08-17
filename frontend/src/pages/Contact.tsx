import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '@/config/owner';
import { Button, Input, Textarea, Alert, Badge } from '../components/ui';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Header Banner */}
      <section className="position-relative py-5 d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '30vh' }}>
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> GET IN TOUCH
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>Contact Us</h1>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
        </div>
      </section>

      <section className="spad">
        <div className="container">
          <div className="row g-5">
            {/* Contact Info Panel */}
            <div className="col-lg-5">
              <div className="g-glass-card p-5 h-100">
                <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Reach Out</span>
                <h2 className="display-6 text-white fw-bold text-uppercase mt-2 mb-4" style={{ fontFamily: 'Oswald' }}>We'd Love To Hear From You</h2>
                <p className="text-secondary text-sm mb-5 leading-relaxed">
                  Have questions about memberships, private coaching, or group schedules? Visit our center in Islamabad or drop us a message anytime.
                </p>

                <div className="d-flex flex-column gap-4 mb-5">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100', width: '48px', height: '48px', flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-1">Our Location</h6>
                      <p className="text-secondary text-sm mb-0">{SITE.address}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100', width: '48px', height: '48px', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-1">Phone Numbers</h6>
                      <p className="text-secondary text-sm mb-0">{SITE.phones[0]}<br />{SITE.phones[1]}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100', width: '48px', height: '48px', flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-1">Direct Email</h6>
                      <p className="text-secondary text-sm mb-0">
                        <a href={`mailto:${SITE.email}`} className="text-secondary hover-orange text-decoration-none">{SITE.email}</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 className="text-white fw-bold mb-3">Connect On Social Media</h6>
                  <div className="d-flex gap-2">
                    <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-facebook"></i></a>
                    <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-twitter"></i></a>
                    <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-instagram"></i></a>
                    <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-youtube-play"></i></a>
                    <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-linkedin"></i></a>
                    <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa fa-github"></i></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <div className="col-lg-7">
              <div className="g-glass-card p-5 h-100">
                <h3 className="text-white fw-bold mb-4" style={{ fontSize: '24px' }}>Send Us A Message</h3>
                {submitted && (
                  <Alert variant="success" className="mb-4" onClose={() => setSubmitted(false)}>
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Input
                        label="Your Name *"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="Your Email *"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        label="Subject *"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Membership Inquiry"
                      />
                    </div>
                    <div className="col-12">
                      <Textarea
                        label="Your Message *"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <Button
                        type="submit"
                        loading={loading}
                        variant="primary"
                        fullWidth
                        rightIcon={<Send size={16} />}
                      >
                        {loading ? 'Sending Message...' : 'Send Message'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="mt-5 pt-3">
            <div className="g-glass-card p-3 overflow-hidden">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.542!2d73.0479!3d33.6844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bfc02b5!2sHostel%20City%20Islamabad!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
