// app/page.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Camera, Users, Award, MapPin, ChevronRight, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.6, -0.05, 0.01, 0.99]
    } 
  },
};

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    } 
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.7,
      ease: 'easeOut'
    } 
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.7,
      ease: 'easeOut'
    } 
  },
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Adventure Photography",
      subtitle: "PACIFIC NORTHWEST AND BEYOND",
      image: "/hero-bg.jpg"
    }
  ];

  // Auto-advance slides (if you add more)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-orange-900/30"></div>
        </motion.div>

        {/* Animated Particles/Dots */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.2
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-8"
          >
            {/* Small Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
                <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                <span className="text-white text-sm font-medium">Award-Winning Studio</span>
                <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                <span className="block text-white drop-shadow-2xl">
                  {heroSlides[currentSlide].title}
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full"
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-orange-300 font-medium tracking-wider uppercase"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your moments into timeless art with our professional photography and videography services. 
              Every shot tells your unique story.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
            >
              <Link href="/portfolio">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-2xl shadow-orange-500/50 px-8 py-6 text-lg font-semibold rounded-xl"
                  >
                    Explore Portfolio
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/booking">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-xl"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            >
              {[
                { value: '500+', label: 'Projects' },
                { value: '300+', label: 'Clients' },
                { value: '50+', label: 'Locations' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-white/70 text-sm uppercase tracking-wider">Scroll Down</span>
            <div                 className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp}>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
                What We Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
                Our Expertise
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our range of professional photography and videography services tailored to your vision.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden h-full">
                  <CardHeader>
                    <motion.div
                      className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-100 to-blue-100 rounded-2xl w-fit group-hover:from-orange-500 group-hover:to-blue-600 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="h-10 w-10 text-orange-600 group-hover:text-white transition-colors" />
                    </motion.div>
                    <CardTitle className="text-xl text-gray-900 text-center group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{service.description}</p>
                    <motion.div
                      className="mt-4 flex items-center justify-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      Learn More <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-24 bg-gradient-to-br from-blue-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp}>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
                Why Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
                Why Brain Works Studio
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We bring creativity, expertise, and passion to every project, ensuring exceptional results.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Award-Winning Excellence',
                description: 'Our work is recognized with industry awards and featured in top publications.',
              },
              {
                icon: Users,
                title: 'Skilled Professionals',
                description: 'Our team of creatives brings expertise and artistry to every project.',
              },
              {
                icon: MapPin,
                title: 'Versatile Locations',
                description: 'We capture your moments in studios, outdoors, or any location you choose.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={index === 1 ? fadeInUp : index === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <motion.div
                  className="mx-auto mb-6 p-6 bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl w-fit shadow-xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="relative py-24 overflow-hidden"
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600"></div>
        
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp}>
            <span className="text-orange-300 font-semibold text-sm uppercase tracking-wider">
              Get Started Today
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Let's Create Your Story
            </h2>
            <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mb-8"></div>
          </motion.div>
          
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed"
          >
            Connect with us to bring your vision to life with stunning photography and videography. 
            Your story deserves to be told beautifully.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/booking">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Book Your Session
                </Button>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Contact Us
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">5-Star Rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">300+ Happy Clients</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Award-Winning</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
}

const services = [
  {
    title: 'Event Photography',
    description: 'Capture the energy and emotion of your events, from corporate gatherings to celebrations.',
    icon: Camera,
  },
  {
    title: 'Portrait Sessions',
    description: 'Professional headshots and family portraits that highlight your unique personality.',
    icon: Users,
  },
  {
    title: 'Product Photography',
    description: 'High-quality images that showcase your products and elevate your brand.',
    icon: Award,
  },
  {
    title: 'Commercial Work',
    description: 'Professional photography and videography for marketing and advertising campaigns.',
    icon: MapPin,
  },
  {
    title: 'Wedding Photography',
    description: 'Preserve your special day with artistic and heartfelt imagery.',
    icon: Camera,
  },
  {
    title: 'Video Production',
    description: 'Create compelling video content for promotions, events, and storytelling.',
    icon: Users,
  },
];