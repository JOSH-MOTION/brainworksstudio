'use client';

import { motion, Variants, Easing } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Camera, Users, Award, MapPin } from 'lucide-react';
import Image from 'next/image';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: 'easeOut' as const // Explicitly type as Easing
    } 
  },
};

// Animation variants for hero image
const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 1, 
      ease: 'easeOut' as const 
    } 
  },
};

// Animation variants for cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      delay: i * 0.1, 
      ease: 'easeOut' as const 
    },
  }),
};

// Animation variants for buttons
const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export default function Home() {
  return (
    <Layout>
      {/* Hero Section with Animated Image */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[80vh] flex items-center justify-center text-white"
      >
        <motion.div
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Crafting Your Visual Legacy
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transform your moments into timeless art with our professional photography and videography services.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-violet-600 transition-colors"
                >
                  Explore Portfolio
                </Button>
              </motion.div>
            </Link>
            <Link href="/booking">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Book Now
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Services Section (Updated to Two Cards) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Our Expertise
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Discover our professional photography and videography services tailored to your vision.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Photography',
                description: 'Timeless images capturing your moments with precision and creativity.',
                image: '/images/photography-card.jpg',
                link: '/photography',
                icon: Camera,
              },
              {
                title: 'Videography',
                description: 'Cinematic storytelling through expertly crafted videos.',
                image: '/images/videography-card.jpg',
                link: '/videography',
                icon: Users,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Link href={service.link}>
                  <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                    <CardHeader className="p-0">
                      <Image
                        src={service.image}
                        alt={`${service.title} preview`}
                        width={600}
                        height={400}
                        className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full w-fit group-hover:bg-violet-100 transition-colors">
                          <service.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl text-gray-900 ml-4">{service.title}</CardTitle>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button className="bg-blue-600 text-white hover:bg-violet-600">
                          Explore {service.title}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Why Brain Works Studio
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              We bring creativity, expertise, and passion to every project, ensuring exceptional results.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Award-Winning Excellence',
                description:
                  'Our work is recognized with postry awards and featured in top publications.',
              },
              {
                icon: Users,
                title: 'Skilled Professionals',
                description:
                  'Our team of creatives brings expertise and artistry to every project.',
              },
              {
                icon: MapPin,
                title: 'Versatile Locations',
                description:
                  'We capture your moments in studios, outdoors, or any location you choose.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-600 rounded-full w-fit group-hover:bg-violet-600 transition-colors">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Let’s Create Your Story
          </motion.h2>
          <motion.p
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Connect with us to bring your vision to life with stunning photography and videography.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-violet-600 hover:text-white transition-colors"
                >
                  Book Your Session
                </Button>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-violet-600 hover:text-white transition-colors"
                >
                  Contact Us
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}