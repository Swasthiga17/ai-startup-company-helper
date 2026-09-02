import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#FFF0F6] via-[#FCE7F3] to-[#FBCFE8] text-slate-800 font-sans">
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1 ml-[260px] min-h-screen">
          <TopBar title={title} />
          <main className="p-4 sm:p-5 md:p-6 min-h-[calc(100vh-4rem)]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-[1400px] mx-auto w-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}