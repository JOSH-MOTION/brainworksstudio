'use client';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Camera, Users, Award, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Capture Your Perfect Moments
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Professional photography and videography services that bring your vision to life. 
              From intimate portraits to grand events, we tell your story beautifully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button size="lg" variant="secondary" className="bg-white text-amber-800 hover:bg-gray-100">
                  View Our Work
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800">
                  Book a Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in creating stunning visual content across various photography and videography disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-amber-200">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
                    <service.icon className="h-8 w-8 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Brain Works Studio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              With years of experience and a passion for storytelling, we deliver exceptional results every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-amber-700 rounded-full w-fit">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Award-Winning Quality</h3>
              <p className="text-gray-600">
                Our work has been recognized with multiple industry awards and featured in prestigious publications.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-amber-700 rounded-full w-fit">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Our team of professional photographers and videographers bring creativity and technical expertise to every project.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-amber-700 rounded-full w-fit">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Locations</h3>
              <p className="text-gray-600">
                We travel to your desired location, whether it's a studio session, outdoor shoot, or special venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-700 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Capture Your Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your vision and create something beautiful together. Get in touch today to book your session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="bg-white text-amber-800 hover:bg-gray-100">
                Book Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const services = [
  {
    title: 'Event Photography',
    description: 'Capturing the energy and emotion of your special events, from corporate gatherings to celebrations.',
    icon: Camera,
  },
  {
    title: 'Portrait Sessions',
    description: 'Professional headshots, family portraits, and personal branding photography that showcases your best.',
    icon: Users,
  },
  {
    title: 'Product Photography',
    description: 'High-quality product images that highlight your brand and drive sales across all platforms.',
    icon: Award,
  },
  {
    title: 'Commercial Work',
    description: 'Professional commercial photography and videography for businesses, marketing, and advertising.',
    icon: MapPin,
  },
  {
    title: 'Wedding Photography',
    description: 'Documenting your most precious moments with artistic vision and attention to every detail.',
    icon: Camera,
  },
  {
    title: 'Video Production',
    description: 'Creative video content including promotional videos, documentaries, and event coverage.',
    icon: Users,
  },
];