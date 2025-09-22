// components/Footer.tsx
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="h-6 w-6" />
              <span className="text-lg font-bold">Brain Works Studio</span>
            </div>
            <p className="text-amber-100">
              Professional photography and videography services for all your creative needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-amber-100">
              <li>Event Photography</li>
              <li>Portrait Sessions</li>
              <li>Product Photography</li>
              <li>Commercial Work</li>
              <li>Wedding Photography</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-amber-100">
              <p>Email: hello@brainworksstudio.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Location: Your City, State</p>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-100">
          <p>&copy; 2025 Brain Works Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}