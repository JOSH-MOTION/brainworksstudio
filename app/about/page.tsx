'use client';

import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Award, Users, Heart, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <Layout>
     {/* Hero Section */}
<motion.header
  className="bg-cover bg-center h-80 flex flex-col justify-end pb-8 relative"
  style={{
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('./hero-bg.jpg')`,
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
    <motion.p
      className="text-sm uppercase tracking-wider font-semibold text-amber-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Services &gt; Booking &gt; Billing
    </motion.p>
    <motion.h1
      className="text-4xl sm:text-5xl font-extrabold mt-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Billing details
    </motion.h1>
  </div>
</motion.header>


      {/* Main Content Section */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-320px)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Our Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2018, Brain Works Studio began as a small team of passionate photographers 
                  who believed that every image should tell a story. What started as a shared love for 
                  capturing authentic moments has grown into a full-service photography and videography studio.
                </p>
                <p>
                  We specialize in creating visual narratives that resonate with emotion and authenticity. 
                  From intimate portrait sessions to large-scale commercial productions, our approach remains 
                  the same: understand our clients' vision and exceed their expectations.
                </p>
                <p>
                  Today, we're proud to have captured thousands of precious moments for families, couples, 
                  businesses, and artists throughout the region. Our work has been featured in numerous 
                  publications and has earned recognition from industry peers.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden shadow-xl rounded-2xl border-none">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src="/images/about-story.jpg"
                      alt="Photography Studio"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do, from initial consultation to final delivery.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="text-center border-amber-200 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
                        <value.icon className="h-8 w-8 text-amber-700" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our talented team of photographers, videographers, and creative professionals 
                bring diverse skills and perspectives to every project.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden">
                        <Image
                          src={`/images/team-${index + 1}.jpg`}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-amber-700 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <motion.div
            className="bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-2xl p-12 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl opacity-90">
                Numbers that reflect our commitment to excellence and client satisfaction
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Service Areas */}
          <div className="mb-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Areas</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We proudly serve clients throughout the region and are available for destination projects.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <MapPin className="h-8 w-8 text-amber-700 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">{area.title}</h3>
                      <p className="text-gray-600 text-sm">{area.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-amber-50 border-amber-200 shadow-xl rounded-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work Together?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Let's discuss your vision and create something beautiful together. 
                  We'd love to hear about your project and how we can help bring it to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/booking">
                      <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
                        Book a Session
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="bg-amber-50 hover:bg-amber-100 text-amber-700">
                        Get in Touch
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
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
    description: 'We capture genuine moments and emotions, creating images that tell your true story.',
    icon: Heart,
  },
  {
    title: 'Excellence',
    description: 'We strive for perfection in every shot, using the latest techniques and equipment.',
    icon: Star,
  },
  {
    title: 'Collaboration',
    description: 'We work closely with our clients to understand their vision and exceed expectations.',
    icon: Users,
  },
  {
    title: 'Innovation',
    description: 'We stay current with industry trends and continuously evolve our creative approach.',
    icon: Award,
  },
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Lead Photographer & Founder',
    description: 'With over 8 years of experience, Sarah specializes in portrait and wedding photography with a focus on natural light and candid moments.',
  },
  {
    name: 'Michael Chen',
    role: 'Commercial Photographer',
    description: 'Michael brings technical precision to product and architectural photography, with expertise in lighting and post-production.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Videographer & Editor',
    description: 'Emma creates compelling video content from concept to final cut, specializing in storytelling through motion and sound.',
  },
];

const stats = [
  { number: '500+', label: 'Happy Clients' },
  { number: '50+', label: 'Weddings Shot' },
  { number: '100+', label: 'Commercial Projects' },
  { number: '5', label: 'Years of Excellence' },
];