// 'use client';

// import { ReactNode, FormEvent } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Shield, User, LogOut, Menu, Calendar, Users, MessageSquare, Settings, Send } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';

// // Animation variants
// const headerVariants = {
//   hidden: { opacity: 0, y: -50 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
// };

// const sidebarVariants = {
//   hidden: { x: '-100%' },
//   visible: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//   exit: { x: '-100%', transition: { duration: 0.2 } },
// };

// const navLinkVariants = {
//   hover: { scale: 1.05, color: '#F97316', transition: { duration: 0.2 } }, // orange-500
//   tap: { scale: 0.95 },
// };

// const footerSectionVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
//   }),
// };

// const iconVariants = {
//   hover: { scale: 1.2, color: '#F97316', transition: { duration: 0.2 } },
//   tap: { scale: 0.9 },
// };

// export default function AdminLayout({ children }: { children: ReactNode }) {
//   const { user, userProfile, signOut, isAdmin, loading } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState('');
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (!loading && (!user || !isAdmin)) {
//       router.push('/auth/login');
//     }
//   }, [user, isAdmin, loading, router]);

//   const handleFeedbackSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: feedbackMessage }),
//       });
//       if (response.ok) {
//         alert('Feedback submitted!');
//         setFeedbackMessage('');
//       } else {
//         alert('Failed to submit feedback.');
//       }
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('An error occurred.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//           className="rounded-full h-32 w-32 border-t-2 border-orange-600 mx-auto"
//         />
//         <p className="mt-4 text-blue-900">Loading admin panel...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   const navItems = [
//     { href: '/admin', label: 'Dashboard', icon: Settings },
//     { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
//     { href: '/admin/users', label: 'Users', icon: Users },
//     { href: '/admin/portfolio', label: 'Portfolio', icon: Shield },
//     { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <motion.header
//         initial="hidden"
//         animate="visible"
//         variants={headerVariants}
//         className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <Link href="/admin" className="flex items-center space-x-2">
//               <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                 <Shield className="h-8 w-8 text-orange-600" />
//               </motion.div>
//               <div>
//                 <span className="text-xl font-bold text-blue-900">Brain Works Studio</span>
//                 <div className="text-xs text-blue-800">Admin Panel</div>
//               </div>
//             </Link>
//             <div className="hidden md:flex items-center space-x-3">
//               {userProfile?.profileImageUrl ? (
//                 <motion.img
//                   src={userProfile.profileImageUrl}
//                   alt="Admin Profile"
//                   className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 />
//               ) : (
//                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1 bg-orange-100 rounded-full">
//                   <User className="h-6 w-6 text-orange-600" />
//                 </motion.div>
//               )}
//               <div className="text-sm">
//                 <div className="font-medium text-blue-900">{userProfile?.displayName || 'Admin'}</div>
//                 <div className="text-blue-800">Studio Team</div>
//               </div>
//               <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="border-orange-600 text-orange-600 hover:bg-orange-500 hover:text-white"
//                   onClick={signOut}
//                 >
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Logout
//                 </Button>
//               </motion.div>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="md:hidden p-2"
//             >
//               <Menu className="h-6 w-6 text-orange-600" />
//             </motion.button>
//           </div>
//         </div>
//       </motion.header>

//       {/* Sidebar */}
//       <div className="flex">
//         <AnimatePresence>
//           {(sidebarOpen || window.innerWidth >= 768) && (
//             <motion.aside
//               variants={sidebarVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40 md:static md:flex md:flex-col md:w-64"
//             >
//               <div className="flex flex-col h-full p-4">
//                 <div className="md:hidden flex items-center space-x-2 mb-4 p-2 border-b border-orange-200">
//                   {userProfile?.profileImageUrl ? (
//                     <motion.img
//                       src={userProfile.profileImageUrl}
//                       alt="Admin Profile"
//                       className="w-6 h-6 rounded-full object-cover"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     />
//                   ) : (
//                     <User className="h-6 w-6 text-orange-600" />
//                   )}
//                   <span className="text-sm font-medium text-blue-900">{userProfile?.displayName || 'Admin'}</span>
//                 </div>
//                 <nav className="flex-1 space-y-2">
//                   {navItems.map((item) => (
//                     <motion.div key={item.href} variants={navLinkVariants} whileHover="hover" whileTap="tap">
//                       <Link
//                         href={item.href}
//                         className={`flex items-center space-x-2 px-4 py-2 rounded-md text-blue-900 hover:bg-orange-50 hover:text-orange-500 ${
//                           pathname === item.href ? 'bg-orange-100 text-orange-600 font-semibold' : ''
//                         }`}
//                         onClick={() => setSidebarOpen(false)}
//                       >
//                         <item.icon className="h-5 w-5" />
//                         <span>{item.label}</span>
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </nav>
//                 <motion.div
//                   variants={navLinkVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   className="md:hidden mt-auto"
//                 >
//                   <button
//                     onClick={() => {
//                       signOut();
//                       setSidebarOpen(false);
//                     }}
//                     className="flex items-center space-x-2 px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500 w-full"
//                   >
//                     <LogOut className="h-5 w-5" />
//                     <span>Logout</span>
//                   </button>
//                 </motion.div>
//               </div>
//             </motion.aside>
//           )}
//         </AnimatePresence>

//         {/* Main Content */}
//         <main className="flex-1 pt-16 md:pl-64 min-h-screen bg-gray-50">{children}</main>
//       </div>

//       {/* Footer */}
//       <motion.footer
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={footerSectionVariants}
//         className="bg-white text-blue-900 border-t border-orange-200"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <motion.div custom={0} variants={footerSectionVariants}>
//               <div className="flex items-center space-x-2 mb-4">
//                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                   <Shield className="h-6 w-6 text-orange-600" />
//                 </motion.div>
//                 <span className="text-lg font-bold text-blue-900">Brain Works Studio</span>
//               </div>
//               <p className="text-blue-800">Manage your studio with precision and creativity.</p>
//             </motion.div>
//             <motion.div custom={1} variants={footerSectionVariants}>
//               <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Tools</h3>
//               <ul className="space-y-2 text-blue-800">
//                 {[
//                   { href: '/admin/settings', label: 'Settings' },
//                   { href: '/admin/help', label: 'Help & Support' },
//                   { href: '/admin/reports', label: 'Reports' },
//                   { href: '/', label: 'View Public Site' },
//                 ].map((link, index) => (
//                   <motion.li
//                     key={index}
//                     whileHover={{ x: 5, color: '#F97316' }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Link href={link.href} className="hover:text-orange-500">
//                       {link.label}
//                     </Link>
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//             <motion.div custom={2} variants={footerSectionVariants}>
//               <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact Support</h3>
//               <div className="space-y-2 text-blue-800">
//                 <p>
//                   Email:{' '}
//                   <a href="mailto:support@brainworksstudio.com" className="hover:text-orange-500">
//                     support@brainworksstudio.com
//                   </a>
//                 </p>
//                 <p>
//                   Phone:{' '}
//                   <a href="tel:+5559876543" className="hover:text-orange-500">
//                     (555) 987-6543
//                   </a>
//                 </p>
//               </div>
//             </motion.div>
//             <motion.div custom={3} variants={footerSectionVariants}>
//               <h3 className="text-lg font-semibold text-blue-900 mb-4">Feedback</h3>
//               <form onSubmit={handleFeedbackSubmit} className="space-y-2">
//                 <Input
//                   type="text"
//                   placeholder="Your feedback"
//                   value={feedbackMessage}
//                   onChange={(e) => setFeedbackMessage(e.target.value)}
//                   className="bg-gray-50 text-blue-900 border-orange-300 focus:ring-orange-500"
//                   required
//                 />
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-500">
//                     <Send className="h-4 w-4 mr-2" />
//                     Submit
//                   </Button>
//                 </motion.div>
//               </form>
//             </motion.div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="border-t border-orange-200 mt-8 pt-8 text-center text-blue-800 text-sm"
//           >
//             <p>&copy; 2025 Brain Works Studio Admin. All rights reserved.</p>
//           </motion.div>
//         </div>
//       </motion.footer>
//     </div>
//   );
// }