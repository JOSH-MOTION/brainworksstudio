'use client';

import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Award, Users, Heart, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Brain Works Studio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are passionate storytellers who believe every moment has a unique story worth capturing. 
            With years of experience and a commitment to excellence, we transform your special moments 
            into timeless memories.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
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
          </div>
          
          <div className="relative">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                  <Camera className="h-24 w-24 text-amber-700 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from initial consultation to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-amber-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
                    <value.icon className="h-8 w-8 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our talented team of photographers, videographers, and creative professionals 
              bring diverse skills and perspectives to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-amber-700 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-amber-700 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-2xl p-12 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">
              Numbers that reflect our commitment to excellence and client satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We proudly serve clients throughout the region and are available for destination projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-amber-700 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Local Service Area</h3>
                <p className="text-gray-600 text-sm">Within 50 miles - No travel fee</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-amber-700 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Regional Coverage</h3>
                <p className="text-gray-600 text-sm">Within 200 miles - Minimal travel fee</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-amber-700 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Destination Projects</h3>
                <p className="text-gray-600 text-sm">Nationwide and international - Custom quote</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work Together?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Let's discuss your vision and create something beautiful together. 
                We'd love to hear about your project and how we can help bring it to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
                    Book a Session
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
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