import { useState } from 'react';
import { Calendar } from './components/calendar/Calendar';
import { SeatLayout } from './components/SeatLayout';
import { CoverflowCarousel } from './components/CoverflowCarousel/CoverflowCarousel';

const initialEvents = [
  {
    id: '1',
    title: 'Orbit UI Design Sprint',
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(new Date().setDate(new Date().getDate() - 1)),
    description: 'Sprint planning and design alignment for Orbit components.',
    color: '#6366f1',
    type: 'MEETING' as const
  },
  {
    id: '2',
    title: 'Showcase Dashboard Review',
    start: new Date(),
    end: new Date(),
    description: 'Walkthrough and feedback session for the new Showcase Dashboard.',
    color: '#10b981',
    type: 'MEETING' as const
  },
  {
    id: '3',
    title: 'Release Version 0.2.0',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: 'Official release of Seat Layout and Teams-like Calendar features.',
    color: '#f43f5e',
    type: 'MOVIE_RELEASE' as const
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'showcase' | 'seats' | 'calendar'>('showcase');

  const carouselItems = [
    (
      <div key="seats-slide" className="w-full h-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Interactive Seating Designer</h3>
            <p className="text-indigo-100/80 mt-2 text-sm leading-relaxed">
              Design complex stadium, cinema, and event seating charts. Supports custom ticket pricing categories, row/column dividers, cell tagging, and real-time layout exporting.
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('seats')}
            className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition duration-200 cursor-pointer shadow-md"
          >
            Launch Seating Designer
          </button>
        </div>
      </div>
    ),
    (
      <div key="calendar-slide" className="w-full h-full bg-gradient-to-br from-teal-500 via-emerald-600 to-emerald-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-teal-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Teams-Inspired Calendar</h3>
            <p className="text-teal-100/80 mt-2 text-sm leading-relaxed">
              Manage your team schedules with an interactive, keyboard-navigable calendar layout. Complete with Week & Month views, quick search filter, event CRUD details, and localized storage.
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('calendar')}
            className="px-5 py-2.5 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition duration-200 cursor-pointer shadow-md"
          >
            Open Schedule Calendar
          </button>
        </div>
      </div>
    ),
    (
      <div key="charts-slide" className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Sleek Charting & Analytics</h3>
            <p className="text-blue-100/80 mt-2 text-sm leading-relaxed">
              Beautiful visualizations using specialized area, line, bar, composed, pie, and donut charts. Crafted with smooth micro-animations and automated HSL colors.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest">
          Component Available in Library
        </div>
      </div>
    ),
    (
      <div key="layouts-slide" className="w-full h-full bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-rose-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Modern Shell Layouts</h3>
            <p className="text-rose-100/80 mt-2 text-sm leading-relaxed">
              Premade, highly responsive AppLayout, InboxLayout, and SocialLayout structures. Easily adaptable to build dashboard panels, chat tools, or custom workspace layouts.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-rose-200/60 uppercase tracking-widest">
          Component Available in Library
        </div>
      </div>
    )
  ];

  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Premium Header */}
      <div className="bg-indigo-900 text-white px-6 py-3 flex items-center justify-between border-b border-indigo-950 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <span className="font-bold text-sm tracking-wide">O</span>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-indigo-100">Orbit UI Toolkit</h1>
            <h2 className="text-[10px] font-bold text-slate-300">Component Showcase Dashboard</h2>
          </div>
        </div>

        {/* Dynamic Sliding Tabs */}
        <div className="flex items-center bg-indigo-950/50 p-1 rounded-xl border border-indigo-850">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'showcase' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'seats' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Seating Designer
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'calendar' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Event Calendar
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded text-indigo-200 border border-indigo-850">V0.2.0</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow min-h-0 overflow-y-auto">
        {activeTab === 'showcase' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Welcome to Orbit UI Showcase
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Explore a premium suite of highly interactive and beautifully designed React components tailored for modern workflows.
              </p>
            </div>

            {/* Coverflow Carousel Component */}
            <div className="relative">
              <CoverflowCarousel 
                items={carouselItems} 
                initialIndex={0}
                className="w-full" 
              />
            </div>
            
            {/* Component Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Features</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Highly Extensible</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tailored styling, clean hook abstractions, and standard TypeScript interfaces out-of-the-box.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Aesthetics</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Modern Layouts</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Carefully crafted HSL colors, beautiful gradients, and fluid micro-animations for premium user experiences.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Ecosystem</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Ready to Ship</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Fully integrated with Tailwind CSS, Framer Motion, Recharts, and Lucide React.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seats' && (
          <div className="h-full w-full p-6 flex flex-col">
            <div className="mb-4 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Arena Seating Layout Designer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Drag to select cells, set pricing zones, or toggle row/column dividers.</p>
              </div>
              <button 
                onClick={() => setActiveTab('showcase')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-850 rounded-lg transition cursor-pointer"
              >
                Back to Showcase
              </button>
            </div>
            <div className="flex-grow min-h-0 relative">
              <SeatLayout />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="h-full w-full p-6 flex flex-col">
            <div className="mb-4 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Workspace Event Calendar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Microsoft Teams-style events engine with custom scheduling options.</p>
              </div>
              <button 
                onClick={() => setActiveTab('showcase')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-850 rounded-lg transition cursor-pointer"
              >
                Back to Showcase
              </button>
            </div>
            <div className="flex-grow min-h-0 relative">
              <Calendar events={initialEvents} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
