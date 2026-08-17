import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { HeroSection } from '../components/home/HeroSection';
import { StatsSection } from '../components/home/StatsSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { FeaturedClassesSection } from '../components/home/FeaturedClassesSection';
import { PricingSection } from '../components/home/PricingSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { CtaBannerSection } from '../components/home/CtaBannerSection';

const HomeTemplate: React.FC = () => {
  const [statsVisible, setStatsVisible] = useState(false);

  useScrollReveal();

  useEffect(() => {
    // Hide preloader
    const preloder = document.getElementById('preloder');
    if (preloder) {
      setTimeout(() => {
        preloder.style.display = 'none';
      }, 300);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const statsEl = document.getElementById('stats-section');
    if (statsEl) observer.observe(statsEl);

    return () => {
      if (statsEl) observer.unobserve(statsEl);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection statsVisible={statsVisible} />
      <WhyChooseUsSection />
      <FeaturedClassesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBannerSection />
    </>
  );
};

export default HomeTemplate;
