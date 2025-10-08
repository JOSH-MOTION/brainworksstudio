'use client';

import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Award, Users, Heart, MapPin, InstagramIcon, Twitter, Linkedin, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 } },
};

const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 130, damping: 20 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15, rotateX: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.05,
    y: -5,
    transition: { duration: 0.3, type: 'spring', stiffness: 150 },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: index * 0.05, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.1,
    transition: { duration: 0.2, type: 'spring', stiffness: 300 },
  },
};

const teamContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.1, ease: 'easeOut' },
  }),
};

const socialIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, delay: index * 0.05, type: 'spring', stiffness: 200, damping: 10 },
  }),
  hover: { scale: 1.3, rotate: 8, transition: { duration: 0.2, type: 'spring', stiffness: 300 } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 200 } },
};

const statVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.08, type: 'spring', stiffness: 110 },
  }),
};

interface TeamMember {
  name: string;
  position: string;
  years: string;
  description: string;
  profileImageUrl: string;
  socials: { platform: 'Instagram' | 'Twitter' | 'LinkedIn'; url: string; icon: LucideIcon }[];
}

interface Client {
  name: string;
  logo: string;
  category: string;
}

const iconMap: Record<'Instagram' | 'Twitter' | 'LinkedIn', LucideIcon> = {
  Instagram: InstagramIcon,
  Twitter,
  LinkedIn: Linkedin,
};

const teamMembers: TeamMember[] = [
  {
    name: 'Joshua Doe',
    position: 'CEO - Photographer',
    years: '4+',
    description: 'With over 4 years of experience, Joshua Doe is a visionary leader dedicated to driving creative excellence and innovation. As the CEO of Brain Works Studio, he leads with passion, turning ideas into impactful visual stories that inspire and connect audiences.',
    profileImageUrl: '/me.jpg',
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com/johndoe', icon: InstagramIcon },
      { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: Twitter },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: Linkedin },
    ],
  },
  {
    name: 'Michael Otoo Bekoe',
    position: 'Director - Cinematographer',
    years: '5+',
    description: "With a deep passion for storytelling, I capture life's most meaningful moments through cinematic visuals that inspire emotion and connection. Every project is an opportunity to create timeless memories that speak beyond words.",
    profileImageUrl: '/mic.jpg',
    socials: [
      { platform: 'Instagram', url: 'https://www.instagram.com/bekoe.films?igsh=MWVlZzdmOHJ5enR3OA%3D%3D&utm_source=qr', icon: InstagramIcon },
      { platform: 'Twitter', url: 'https://twitter.com/janesmith', icon: Twitter },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/janesmith', icon: Linkedin },
    ],
  },
  {
    name: 'Emmanuel Atta',
    position: 'Public Relation',
    years: '3+',
    description: 'With over 3 years of experience, Emmanuel Atta brings strong teamwork, discipline, and strategic thinking to every role. As a midfielder with a background in client relations, he combines focus and communication to deliver both on and off the field.',
    profileImageUrl: '/cor.jpg',
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com/alexbrown', icon: InstagramIcon },
      { platform: 'Twitter', url: 'https://twitter.com/alexbrown', icon: Twitter },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/emmanuel-atta-435705286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: Linkedin },
    ],
  },
  {
    name: 'JOHNSON COURAGE YAO',
    position: 'Photographer',
    years: '5+',
    description: 'Experienced in the art of photography for over 5 years, this professional specializes in creating captivating visuals that inspire and connect. Their unique approach combines technical skill with a creative vision, producing images that truly stand out.',
    profileImageUrl: '/jon.jpg',
    socials: [
      { platform: 'Instagram', url: 'https://www.instagram.com/mania.studios1?igsh=azc3cW93MmN1dWRy&utm_source=qr', icon: InstagramIcon },
      { platform: 'Twitter', url: 'https://twitter.com/emilywhite', icon: Twitter },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/courage-johnson-359922364?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', icon: Linkedin },
    ],
  },
  {
    name: ' Albert Makafui Kakabiku',
    position: 'Graphic Designer',
    years: '6+',
    description: 'A passionate graphic designer blending creativity and technology to craft impactful visual designs for brands and businesses.',
    profileImageUrl: '/alb.jpg',
    socials: [
      { platform: 'Instagram', url: 'https://www.instagram.com/mcalbertgraphix', icon: InstagramIcon },
      { platform: 'Twitter', url: 'https://x.com/mcalbertgraphix', icon: Twitter },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/mcalbert', icon: Linkedin },
    ],
  },
];

// Add your actual client logos here
const clients: Client[] = [
  { name: 'Company A', logo: '/clients/client-1.png', category: 'Corporate' },
  { name: 'Codetrain Africa', logo: '/code.png', category: 'Fashion' },
  { name: 'Company C', logo: '/clients/client-3.png', category: 'Events' },
  { name: 'Company D', logo: '/clients/client-4.png', category: 'Product' },
  { name: 'Company E', logo: '/clients/client-5.png', category: 'Corporate' },
  { name: 'Company F', logo: '/clients/client-6.png', category: 'Events' },
  { name: 'Company G', logo: '/clients/client-7.png', category: 'Fashion' },
  { name: 'Company H', logo: '/clients/client-8.png', category: 'Product' },
];

export default function AboutPage() {
  const headingText = 'Our Creative Journey'.split(' ');

  const values = [
    { icon: Camera, title: 'Creativity', description: 'We bring your vision to life with innovative photography.' },
    { icon: Heart, title: 'Passion', description: 'Every project is infused with our love for storytelling.' },
    { icon: Award, title: 'Excellence', description: 'We strive for perfection in every shot.' },
    { icon: Users, title: 'Collaboration', description: 'We work closely with you to achieve your goals.' },
  ];

  const stats = [
    { icon: Camera, value: '10K+', label: 'Photos Captured' },
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Award, value: '50+', label: 'Awards Won' },
    { icon: MapPin, value: '15+', label: 'Locations Served' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-teal-100 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={heroContentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-teal-900">
              {headingText.map((word, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={wordVariants}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the story behind our passion for photography and the team that brings your moments to life.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href="/contact">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg text-lg">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Our Story</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Founded in 2010, Brain Works Studio began as a small team of passionate photographers dedicated to capturing life's most meaningful moments. Over the years, we've grown into a full-service studio, blending creativity with technical expertise to deliver stunning visuals for clients worldwide.
            </p>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={cardVariants}>
              <Card className="bg-teal-50 border border-teal-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-teal-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    To create timeless memories through exceptional photography, tailored to each client's unique vision.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className="bg-teal-50 border border-teal-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-teal-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the leading photography studio known for innovation, quality, and heartfelt storytelling.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every shot we take and every client we serve.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-sm border border-teal-200 hover:bg-teal-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-10 w-10 mx-auto text-teal-600 mb-4" />
                    <h3 className="text-lg font-semibold text-teal-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Our dedicated creatives bring years of expertise to every project.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-white rounded-2xl shadow-lg border border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="w-28 h-28 mx-auto mb-4 relative rounded-full overflow-hidden border-4 border-teal-200"
                      whileHover={{ scale: 1.1, rotate: 4 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                      <Image
                        src={member.profileImageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                        onError={(e) => {
                          console.error(`Failed to load image for ${member.name}`);
                          e.currentTarget.src = '/placeholder-team.jpg';
                        }}
                      />
                    </motion.div>
                    <motion.h3
                      custom={0}
                      variants={teamContentVariants}
                      className="text-xl font-bold text-teal-900 mb-1"
                    >
                      {member.name}
                    </motion.h3>
                    <motion.p
                      custom={1}
                      variants={teamContentVariants}
                      className="text-teal-600 text-sm font-semibold mb-2"
                    >
                      {member.position}
                    </motion.p>
                    <motion.div
                      custom={2}
                      variants={badgeVariants}
                      className="inline-block bg-teal-100 text-teal-900 text-xs font-medium px-3 py-1 rounded-full mb-3"
                    >
                      {member.years} Years of Experience
                    </motion.div>
                    <motion.p
                      custom={3}
                      variants={teamContentVariants}
                      className="text-gray-600 text-sm mb-4"
                    >
                      {member.description}
                    </motion.p>
                    <motion.div
                      custom={4}
                      variants={teamContentVariants}
                      className="flex justify-center gap-4"
                    >
                      {member.socials.map((social, socialIndex) => (
                        <motion.a
                          key={socialIndex}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          custom={socialIndex}
                          variants={socialIconVariants}
                          whileHover="hover"
                          initial="hidden"
                          animate="visible"
                        >
                          <social.icon className="h-6 w-6 text-teal-600 hover:text-teal-800 transition-colors" />
                        </motion.a>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients & Partners Section */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Trusted By</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud to have worked with amazing brands and businesses across various industries.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                custom={index}
                variants={logoVariants}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-teal-200 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center justify-center h-32">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        onError={(e) => {
                          // Fallback to text if image fails
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<p class="text-teal-900 font-semibold text-center">${client.name}</p>`;
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              And many more amazing clients...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Numbers that showcase our dedication to excellence.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-sm border border-teal-200 text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-10 w-10 mx-auto text-teal-600 mb-4" />
                    <p className="text-2xl font-bold text-teal-900">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-teal-900 mb-4">Where We Create</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We serve clients across multiple locations, bringing our expertise to you.
            </p>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {['Ghana, Accra', 'Los Angeles, CA', 'Chicago, IL'].map((location, index) => (
              <motion.div
                key={location}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-teal-200 shadow-sm text-center">
                  <CardContent className="p-6">
                    <MapPin className="h-8 w-8 mx-auto text-teal-600 mb-4" />
                    <p className="text-lg font-semibold text-teal-900">{location}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Capture Your Moments?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Let's create something extraordinary together. Book your session today!
            </p>
            <Link href="/booking">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg">
                Book Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}