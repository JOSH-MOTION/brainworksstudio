'use client';

import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Award, Users, Heart, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, type: 'spring', stiffness: 130, damping: 20 },
  },
};

// Animation variants for hero words
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
};

// Animation variants for cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.02,
    y: -3,
    transition: { duration: 0.3, type: 'spring', stiffness: 140 },
  },
};

// Animation variants for stats
const statVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.08, type: 'spring', stiffness: 110 },
  }),
};

export default function AboutPage() {
  // Split the heading text into words for animation
  const headingText = 'Our Creative Journey'.split(' ');

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[35vh] flex items-center justify-center bg-teal-50"
      >
        <motion.div
          variants={heroContentVariants}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">
            {headingText.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            custom={0}
            variants={wordVariants}
            className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-6"
          >
            Learn about our passion for crafting timeless visual stories.
          </motion.p>
          <motion.div custom={1} variants={wordVariants}>
            <Link href="#contact">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="lg"
                  className="bg-coral-500 text-white hover:bg-coral-600 font-semibold py-2 px-6 rounded-full"
                >
                  Connect With Us
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Main Content Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          {/* Our Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-center">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-teal-900 mb-3">Our Story</h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>
                  Since 2018, Brain Works Studio has grown from a small team of photographers into a full-service studio, driven by a love for authentic storytelling through photography and videography.
                </p>
                <p>
                  We specialize in everything from intimate portraits to large-scale commercial projects, always prioritizing your vision. Our work has earned accolades and been featured in leading publications.
                </p>
                <p>
                  Our mission is simple: create visuals that capture the essence of every moment, whether personal or professional.
                </p>
              </div>
            </motion.div>
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden shadow-sm rounded-xl border border-coral-100">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src="/Pic3.jpeg"
                      alt="Photography Studio"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={(e) => {
                        console.error('Failed to load about story image');
                        e.currentTarget.src = '/placeholder-story.jpg';
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <motion.div
              className="text-center mb-6"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-teal-900 mb-2">Our Values</h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Core principles that shape our creative process.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="text-center bg-teal-50 rounded-xl shadow-sm border border-coral-100 hover:bg-teal-100 transition-colors">
                    <CardContent className="p-4">
                      <div className="mx-auto mb-2 p-2 bg-coral-50 rounded-full w-fit">
                        <value.icon className="h-5 w-5 text-coral-500" />
                      </div>
                      <h3 className="text-sm font-semibold text-teal-900 mb-1">{value.title}</h3>
                      <p className="text-gray-600 text-xs">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <motion.div
              className="text-center mb-6"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-teal-900 mb-2">Meet Our Team</h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Passionate creatives dedicated to your vision.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="text-center bg-teal-50 rounded-xl shadow-sm border border-coral-100 hover:bg-teal-100 transition-colors">
                    <CardContent className="p-4">
                      <div className="w-20 h-20 mx-auto mb-2 relative rounded-full overflow-hidden">
                        <Image
                          src={`/images/team-${index + 1}.jpg`}
                          alt={member.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                          onError={(e) => {
                            console.error(`Failed to load team image for ${member.name}`);
                            e.currentTarget.src = '/placeholder-team.jpg';
                          }}
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-teal-900 mb-1">{member.name}</h3>
                      <p className="text-coral-500 text-xs font-medium mb-1">{member.role}</p>
                      <p className="text-gray-600 text-xs">{member.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <motion.div
            className="bg-teal-600 rounded-xl p-8 mb-12 border border-coral-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Our Impact</h2>
              <p className="text-sm text-teal-50">
                Milestones that reflect our dedication to excellence.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={statVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-teal-50">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Service Areas */}
          <div className="mb-12">
            <motion.div
              className="text-center mb-6"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-teal-900 mb-2">Service Areas</h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                From local to global, we're here for your projects.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Local Service Area',
                  description: 'Within 50 miles - No travel fee',
                },
                {
                  title: 'Regional Coverage',
                  description: 'Within 200 miles - Minimal travel fee',
                },
                {
                  title: 'Destination Projects',
                  description: 'Nationwide and international - Custom quote',
                },
              ].map((area, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="text-center bg-teal-50 rounded-xl shadow-sm border border-coral-100 hover:bg-teal-100 transition-colors">
                    <CardContent className="p-4">
                      <MapPin className="h-5 w-5 text-coral-500 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-teal-900 mb-1">{area.title}</h3>
                      <p className="text-gray-600 text-xs">{area.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="bg-teal-50 border-coral-100 shadow-sm rounded-xl p-6 text-center">
              <h2 className="text-xl font-bold text-teal-900 mb-2">Ready to Collaborate?</h2>
              <p className="text-sm text-gray-600 mb-4 max-w-lg mx-auto">
                Let's create something extraordinary together.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/booking">
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-full">
                      Book a Session
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-coral-500 text-coral-500 hover:bg-coral-50 rounded-full"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

const values = [
  {
    title: 'Authenticity',
    description: 'We capture genuine moments that reflect your unique story.',
    icon: Heart,
  },
  {
    title: 'Excellence',
    description: 'We pursue perfection in every frame with top-tier techniques.',
    icon: Star,
  },
  {
    title: 'Collaboration',
    description: 'We partner with you to bring your vision to life.',
    icon: Users,
  },
  {
    title: 'Innovation',
    description: 'We embrace new trends to keep our work fresh and creative.',
    icon: Award,
  },
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Lead Photographer & Founder',
    description: 'Sarah specializes in portrait and wedding photography, focusing on natural light and candid moments.',
  },
  {
    name: 'Michael Chen',
    role: 'Commercial Photographer',
    description: 'Michael excels in product and architectural photography with a keen eye for detail.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Videographer & Editor',
    description: 'Emma crafts compelling video stories from concept to final edit.',
  },
];

const stats = [
  { number: '500+', label: 'Happy Clients' },
  { number: '50+', label: 'Weddings Shot' },
  { number: '100+', label: 'Commercial Projects' },
  { number: '5', label: 'Years of Excellence' },
];