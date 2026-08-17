/**
 * ============================================================
 * OWNER / SITE CONFIGURATION — Single Source of Truth
 * ============================================================
 * Update this file when any owner or site detail changes.
 * Never hard-code these values anywhere else in the frontend.
 * ============================================================
 */

export const OWNER = {
  /** Full legal / display name */
  name: 'Hazrat Ullah',

  /** GitHub username (used for profile URL) */
  github: 'Hazrat-Ullah-star',

  /** Portfolio website */
  portfolio: 'https://portfolio-eta-lac-hwnim1scpy.vercel.app',

  /** Primary contact email */
  email: 'hazratullah.tk@gmail.com',

  /** Roles / titles shown in UI and meta tags */
  roles: [
    'Full Stack Software Engineer',
    'Ethical Hacking Enthusiast',
    'Computer Science Graduate',
  ],

  /** Short one-line bio for meta descriptions */
  bio: 'Full Stack Software Engineer & Ethical Hacking Enthusiast',
} as const

export const SITE = {
  /** Human-readable site name */
  name: 'Gym Performance Center',

  /** Short name for PWA manifest */
  shortName: 'GymPC',

  /** Canonical root URL (update to production domain when deployed) */
  url: 'https://gym-performance-center.vercel.app',

  /** Default meta description */
  description:
    "Pakistan's premier fitness destination in Islamabad. Transform your body, elevate your mind, and achieve your fitness goals with world-class facilities and expert trainers.",

  /** Default Open Graph / Twitter card image (relative to public/) */
  ogImage: '/img/og-image.jpg',

  /** Contact phone numbers */
  phones: ['+923452046221', '+923069267984'],

  /** Physical address */
  address: 'Hostel City, Street 1, G-11/3, Islamabad, Pakistan',

  /** Primary contact email */
  email: 'hazratullah.tk@gmail.com',

  /** Social media links — set to real URLs or leave blank to hide */
  social: {
    facebook:  'https://www.facebook.com/profile.php?id=100084617071521',
    twitter:   'https://x.com/Hazrat_Ullah_92',
    instagram: 'https://www.instagram.com/hazrat_ullah29400/',
    youtube:   'https://youtube.com',
    linkedin:  'https://www.linkedin.com/in/hazrat-ullah/',
    whatsapp:  'https://wa.me/923069267984',
    github:    `https://github.com/Hazrat-Ullah-star`,
  },

  /** PWA theme colour */
  themeColor: '#f36100',
} as const
