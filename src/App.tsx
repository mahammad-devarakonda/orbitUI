import { useState } from 'react';
import { cn } from './utils/cn';
import { Calendar } from './components/calendar/Calendar';
import { SeatLayout } from './components/SeatLayout';
import { CoverflowCarousel } from './components/CoverflowCarousel/CoverflowCarousel';
import { OtpInput } from './components/OtpInput/OtpInput';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Checkbox } from './components/Checkbox/Checkbox';
import { DocumentManagementShowcase } from './components/DocumentManagement/Showcase';
import { DashboardGrid, type DashboardWidget } from './components/DashboardGrid/DashboardGrid';
import { OrbitAreaChart } from './components/charts/AreaChart/OrbitAreaChart';
import { OrbitBarChart } from './components/charts/BarChart/OrbitBarChart';
import { 
  Plus, RotateCcw, Info, ExternalLink, ChevronRight
} from 'lucide-react';


export type FilterValue = string | string[] | { start: string; end: string } | boolean;


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

// Mock database for Search & Filters Showcase
const mockCatalogItems = [
  { id: 1, name: 'Air Zoom Running Shoes', category: 'apparel', inStock: true, rating: 4.8, dateAdded: '2026-05-10', price: 120 },
  { id: 2, name: 'Noise-Cancelling Headphones', category: 'electronics', inStock: true, rating: 4.6, dateAdded: '2026-04-15', price: 299 },
  { id: 3, name: 'React Development Ebook', category: 'books', inStock: true, rating: 4.9, dateAdded: '2026-06-01', price: 39 },
  { id: 4, name: 'Ergonomic Office Chair', category: 'home', inStock: false, rating: 4.4, dateAdded: '2026-03-20', price: 349 },
  { id: 5, name: 'Mechanical Gaming Keyboard', category: 'electronics', inStock: true, rating: 4.7, dateAdded: '2026-05-25', price: 149 },
  { id: 6, name: 'Water-Resistant Windbreaker', category: 'apparel', inStock: true, rating: 4.2, dateAdded: '2026-02-12', price: 85 },
  { id: 7, name: 'Gourmet Coffee Blender', category: 'home', inStock: true, rating: 4.5, dateAdded: '2026-05-01', price: 199 },
  { id: 8, name: 'Sci-Fi Hardcover Novel', category: 'books', inStock: true, rating: 4.3, dateAdded: '2026-01-30', price: 24 },
  { id: 9, name: 'Smart Fitness Band', category: 'electronics', inStock: false, rating: 4.1, dateAdded: '2026-06-05', price: 79 },
  { id: 10, name: 'Cotton Yoga Mat', category: 'apparel', inStock: true, rating: 4.6, dateAdded: '2026-04-29', price: 45 },
];

const catalogFilters = [
  {
    id: 'search',
    label: 'Product Name Search',
    type: 'search' as const,
    placeholder: 'Search products by name...',
    gridSpan: 'lg:col-span-1',
  },
  {
    id: 'categories',
    label: 'Categories',
    type: 'multi-select' as const,
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Apparel', value: 'apparel' },
      { label: 'Books', value: 'books' },
      { label: 'Home & Living', value: 'home' },
    ],
    gridSpan: 'lg:col-span-2',
  },
  {
    id: 'dateRange',
    label: 'Date Added Range',
    type: 'date-range' as const,
    gridSpan: 'lg:col-span-1',
  },
  {
    id: 'inStock',
    label: 'Show Only In Stock Items',
    type: 'boolean' as const,
    gridSpan: 'lg:col-span-1',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<'showcase' | 'seats' | 'calendar' | 'otp' | 'filters' | 'documents' | 'console'>('console');

  // Console Home Dashboard States
  const [widgetsLayout, setWidgetsLayout] = useState<{
    id: string;
    colSpan: 1 | 2 | 3 | 4 | 'full';
    rowSpan: 1 | 2 | 3;
    visible: boolean;
  }[]>([
    { id: 'aws-applications', colSpan: 2, rowSpan: 1, visible: true },
    { id: 'aws-recently-visited', colSpan: 1, rowSpan: 1, visible: true },
    { id: 'aws-welcome', colSpan: 1, rowSpan: 1, visible: true },
    { id: 'aws-health', colSpan: 1, rowSpan: 1, visible: true },
    { id: 'aws-cost-usage', colSpan: 1, rowSpan: 1, visible: true },
    { id: 'aws-traffic-chart', colSpan: 2, rowSpan: 1, visible: true },
  ]);
  const [consoleRegion, setConsoleRegion] = useState('us-west-2');
  const [consoleAppSearch, setConsoleAppSearch] = useState('');
  const [isAddWidgetsOpen, setIsAddWidgetsOpen] = useState(false);


  // Filter Showcase State
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>({
    search: '',
    categories: ['electronics', 'apparel'],
    dateRange: { start: '', end: '' },
    inStock: false,
  });

  const [filterVariant, setFilterVariant] = useState<'default' | 'glass' | 'dark'>('default');
  const [filterLayout, setFilterLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [customSearchIcon, setCustomSearchIcon] = useState(false);
  const [customClearIcon, setCustomClearIcon] = useState(false);
  const [customFieldOverride, setCustomFieldOverride] = useState(false);

  // Temporary reference to prevent unused variable compile errors (TS6133)
  if (typeof window !== 'undefined' && (false as boolean)) {
    console.log(catalogFilters, filterVariant, filterLayout, customSearchIcon, customClearIcon, customFieldOverride);
  }


  // Standalone Sandboxes
  const [sandboxSearch, setSandboxSearch] = useState('');
  const [sandboxCheck, setSandboxCheck] = useState(false);

  // OTP Showcase State
  const [otpConfig, setOtpConfig] = useState({
    length: 6,
    size: 'md' as 'sm' | 'md' | 'lg',
    rounded: 'lg' as 'none' | 'sm' | 'md' | 'lg' | 'full',
    type: 'number' as 'number' | 'text' | 'password',
    variant: 'default' as 'default' | 'glass' | 'dark',
    gap: 'md' as 'sm' | 'md' | 'lg' | 'xl',
    disabled: false,
    error: false,
    success: false,
  });
  const [otpValue, setOtpValue] = useState('');
  const [events, setEvents] = useState<{ text: string; time: string }[]>([]);

  const logEvent = (text: string) => {
    const time = new Date().toLocaleTimeString();
    setEvents(prev => [{ text, time }, ...prev].slice(0, 25));
  };

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
    ),
    (
      <div key="otp-slide" className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-purple-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Customizable OTP Reader</h3>
            <p className="text-purple-100/80 mt-2 text-sm leading-relaxed">
              Highly customizable One-Time Password component. Control digit count, size, border styling (including glassmorphism), type restrictions, auto-focus, paste actions, and error shake/success animations.
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('otp')}
            className="px-5 py-2.5 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition duration-200 cursor-pointer shadow-md"
          >
            Open OTP Reader Demo
          </button>
        </div>
      </div>
    ),
    (
      <div key="filters-slide" className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-teal-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Search & Filter Engine</h3>
            <p className="text-teal-100/80 mt-2 text-sm leading-relaxed">
              Schema-driven dashboard filter panels, debounced search bars, custom checkmark animations, and dynamic date-range queries. Built with rich light/dark themes and developer customizer hooks.
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('filters')}
            className="px-5 py-2.5 bg-white text-teal-600 rounded-xl font-bold text-sm hover:bg-teal-50 transition duration-200 cursor-pointer shadow-md"
          >
            Launch Search & Filters
          </button>
        </div>
      </div>
    ),
    (
      <div key="documents-slide" className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 text-white p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-indigo-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Document System Builder</h3>
            <p className="text-indigo-150/80 mt-2 text-sm leading-relaxed">
              Design dynamic templates, compile variable data bindings, and view generated reports inside an Adobe-style high-fidelity PDF canvas complete with full-screen, zoom, print, and PDF downloads.
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('documents')}
            className="px-5 py-2.5 bg-white text-indigo-650 rounded-xl font-bold text-sm hover:bg-indigo-50 transition duration-200 cursor-pointer shadow-md"
          >
            Open Document Workspace
          </button>
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
            onClick={() => setActiveTab('console')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'console' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Console Home 📊
          </button>
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
          <button
            onClick={() => setActiveTab('otp')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'otp' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            OTP Reader
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'filters' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Search & Filters
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === 'documents' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Documents
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

        {activeTab === 'otp' && (
          <div className="h-full w-full p-6 flex flex-col">
            <div className="mb-4 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Customizable OTP Input Showcase</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters dynamically and test keyboard/paste events.</p>
              </div>
              <button 
                onClick={() => setActiveTab('showcase')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-850 rounded-lg transition cursor-pointer"
              >
                Back to Showcase
              </button>
            </div>
            
            <div className="flex-grow min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
              {/* Controls Column */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-start">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-150 dark:border-slate-850 pb-2">Configuration Options</h4>
                
                {/* Digits slider/input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>Digits (Length)</span>
                    <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{otpConfig.length}</span>
                  </label>
                  <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    value={otpConfig.length}
                    onChange={(e) => setOtpConfig(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Sizing selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sm', 'md', 'lg'] as const).map(sz => (
                      <button
                        key={sz}
                        onClick={() => setOtpConfig(prev => ({ ...prev, size: sz }))}
                        className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition ${
                          otpConfig.size === sz
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rounded corners */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rounded Corners</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['none', 'sm', 'md', 'lg', 'full'] as const).map(rnd => (
                      <button
                        key={rnd}
                        onClick={() => setOtpConfig(prev => ({ ...prev, rounded: rnd }))}
                        className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition ${
                          otpConfig.rounded === rnd
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {rnd.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Input Character Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['number', 'text', 'password'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setOtpConfig(prev => ({ ...prev, type: t }))}
                        className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition ${
                          otpConfig.type === t
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styling Theme Variants */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Design Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['default', 'glass', 'dark'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setOtpConfig(prev => ({ ...prev, variant: v }))}
                        className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition ${
                          otpConfig.variant === v
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gaps Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Gap Spacing</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['sm', 'md', 'lg', 'xl'] as const).map(gp => (
                      <button
                        key={gp}
                        onClick={() => setOtpConfig(prev => ({ ...prev, gap: gp }))}
                        className={`py-1.5 px-1 text-xs font-bold rounded-lg border transition ${
                          otpConfig.gap === gp
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {gp.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boolean State Switches */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">States & Overrides</label>
                  
                  <label className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={otpConfig.disabled}
                      onChange={(e) => setOtpConfig(prev => ({ ...prev, disabled: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Disabled state</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={otpConfig.error}
                      onChange={(e) => setOtpConfig(prev => {
                        const newErr = e.target.checked;
                        return { ...prev, error: newErr, success: newErr ? false : prev.success };
                      })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Error state (red/shake)</span>
                  </label>

                  <label className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={otpConfig.success}
                      onChange={(e) => setOtpConfig(prev => {
                        const newSucc = e.target.checked;
                        return { ...prev, success: newSucc, error: newSucc ? false : prev.error };
                      })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Success state (green border)</span>
                  </label>
                </div>
              </div>

              {/* Playground Column */}
              <div className="lg:col-span-2 space-y-6 flex flex-col min-h-0">
                {/* Visual Preview Box */}
                <div className={`flex-grow flex flex-col items-center justify-center border rounded-2xl p-8 shadow-sm transition ${
                  otpConfig.variant === 'glass'
                    ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-900/40 text-white'
                    : otpConfig.variant === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white'
                }`}>
                  <span className="text-xs font-semibold tracking-widest uppercase mb-6 text-slate-400 dark:text-slate-500">Live Interactive Input</span>
                  
                  {/* The actual OTP Input Component */}
                  <OtpInput 
                    key={`${otpConfig.length}-${otpConfig.variant}-${otpConfig.size}-${otpConfig.rounded}-${otpConfig.type}-${otpConfig.gap}`}
                    length={otpConfig.length}
                    type={otpConfig.type}
                    variant={otpConfig.variant}
                    size={otpConfig.size}
                    rounded={otpConfig.rounded}
                    gap={otpConfig.gap}
                    disabled={otpConfig.disabled}
                    error={otpConfig.error}
                    success={otpConfig.success}
                    autoFocus
                    placeholder="•"
                    onChange={(val) => {
                      setOtpValue(val);
                      logEvent(`onChange: "${val}"`);
                    }}
                    onComplete={(val) => {
                      logEvent(`onComplete: "${val}" 🎉`);
                      // Trigger success animation dynamically
                      setOtpConfig(prev => ({ ...prev, success: true }));
                      setTimeout(() => {
                        setOtpConfig(prev => ({ ...prev, success: false }));
                      }, 2000);
                    }}
                  />

                  {/* Actions & Utilities */}
                  <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => {
                        const randomCode = Array.from({ length: otpConfig.length }, () => Math.floor(Math.random() * 10)).join('');
                        navigator.clipboard.writeText(randomCode);
                        logEvent(`Copied mock code "${randomCode}" to clipboard! Now paste it (Ctrl+V) into the boxes.`);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition duration-150 shadow-md cursor-pointer"
                    >
                      Copy Random Code to Clipboard
                    </button>
                    <button
                      onClick={() => {
                        // Reset
                        setOtpConfig(prev => ({ ...prev, error: false, success: false }));
                        setOtpValue('');
                        logEvent('Reset input and status flags.');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition duration-150 cursor-pointer"
                    >
                      Clear / Reset
                    </button>
                    <button
                      onClick={() => {
                        setOtpConfig(prev => ({ ...prev, error: true }));
                        logEvent('Triggered shake/error state.');
                        setTimeout(() => {
                          setOtpConfig(prev => ({ ...prev, error: false }));
                        }, 1000);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition duration-150 shadow-md cursor-pointer"
                    >
                      Trigger Error Shake
                    </button>
                  </div>

                  <div className="mt-6 text-sm">
                    <span className="font-semibold text-slate-400">Current Output string: </span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-indigo-600 dark:text-indigo-400 font-extrabold">{otpValue || '(empty)'}</span>
                  </div>
                </div>

                {/* Event Logs panel */}
                <div className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-2xl p-4 h-40 flex flex-col justify-between shadow-inner shrink-0">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Callback Logs</span>
                    <button 
                      onClick={() => setEvents([])} 
                      className="text-[10px] text-slate-500 hover:text-slate-300 transition"
                    >
                      Clear Logs
                    </button>
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                    {events.length === 0 ? (
                      <span className="text-slate-600 italic">No events logged yet. Type in the boxes above...</span>
                    ) : (
                      events.map((ev, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{ev.text}</span>
                          <span className="text-slate-600 font-sans text-[10px]">{ev.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (() => {
          const filteredCatalog = mockCatalogItems.filter(item => {
            // 1. Search Query
            const searchVal = filterValues.search;
            if (typeof searchVal === 'string' && searchVal) {
              const query = searchVal.toLowerCase();
              if (!item.name.toLowerCase().includes(query)) {
                return false;
              }
            }

            // 2. Categories (Multi-select)
            const categoriesVal = filterValues.categories;
            if (Array.isArray(categoriesVal) && categoriesVal.length > 0) {
              if (!categoriesVal.includes(item.category)) {
                return false;
              }
            }

            // 3. Date Range
            const dateRangeVal = filterValues.dateRange;
            if (dateRangeVal && typeof dateRangeVal === 'object' && 'start' in dateRangeVal && 'end' in dateRangeVal) {
              const { start, end } = dateRangeVal as { start: string; end: string };
              if (start && item.dateAdded < start) {
                return false;
              }
              if (end && item.dateAdded > end) {
                return false;
              }
            }

            // 4. In Stock Boolean
            const inStockVal = filterValues.inStock;
            if (typeof inStockVal === 'boolean' && inStockVal && !item.inStock) {
              return false;
            }

            return true;
          });

          return (
            <div className="h-full w-full p-6 flex flex-col gap-6 overflow-y-auto">
              {/* Header info */}
              <div className="shrink-0 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Dynamic Search & Filter Showcase</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters dynamically and check live filter results.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('showcase')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-850 rounded-lg transition cursor-pointer"
                >
                  Back to Showcase
                </button>
              </div>

              {/* Split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* Filter Controls Sidebar */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-150 dark:border-slate-850 pb-2">Showcase Controls</h4>
                  
                  {/* Variant choice */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['default', 'glass', 'dark'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => setFilterVariant(v)}
                          className={cn(
                            'py-1.5 px-2 text-xs font-bold rounded-lg border transition cursor-pointer',
                            filterVariant === v
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          )}
                        >
                          {v.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout choice */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Panel Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['horizontal', 'vertical'] as const).map(l => (
                        <button
                          key={l}
                          onClick={() => setFilterLayout(l)}
                          className={cn(
                            'py-1.5 px-2 text-xs font-bold rounded-lg border transition cursor-pointer',
                            filterLayout === l
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          )}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customized elements */}
                  <div className="space-y-3 pt-2 border-t border-slate-150 dark:border-slate-850">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SearchBar Customization</label>
                    
                    <label className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customSearchIcon}
                        onChange={(e) => setCustomSearchIcon(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>Custom search icon (Purple SVG)</span>
                    </label>

                    <label className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customClearIcon}
                        onChange={(e) => setCustomClearIcon(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>Custom clear badge ("Clear")</span>
                    </label>
                  </div>

                  {/* FilterSystem renderer override */}
                  <div className="space-y-3 pt-2 border-t border-slate-150 dark:border-slate-850">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter Override Hook</label>
                    
                    <label className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customFieldOverride}
                        onChange={(e) => setCustomFieldOverride(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>Use renderField badges for Categories</span>
                    </label>
                  </div>
                </div>

                {/* Filter System & Catalog List */}
                <div className="lg:col-span-3 space-y-6 flex flex-col min-h-0">
                  {/* Dynamically Styled Filter System Panel */}
                  {/* Dynamically Styled Filter System Panel (Disabled) */}
                  <div className="p-6 bg-slate-900/50 border border-dashed border-slate-800 text-slate-450 rounded-2xl text-center text-xs">
                    FilterSystem component is disabled.
                  </div>

                  {/* Filter Output Table / Card List */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <h5 className="font-bold text-sm text-slate-850 dark:text-slate-100">Filtered Catalog Results</h5>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-2.5 py-1 rounded-full">
                        {filteredCatalog.length} Items Found
                      </span>
                    </div>

                    <div className="overflow-x-auto min-h-60">
                      {filteredCatalog.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                          <span className="text-3xl">🔍</span>
                          <h6 className="font-bold text-slate-800 dark:text-slate-150 mt-2">No items match filters</h6>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Try relaxing your search terms or selecting more categories to view items.</p>
                          <button
                            onClick={() => setFilterValues({ search: '', categories: [], dateRange: { start: '', end: '' }, inStock: false })}
                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-150 dark:border-slate-850 text-slate-400 font-bold uppercase bg-slate-50/20 dark:bg-slate-900/20">
                              <th className="p-4">Product ID</th>
                              <th className="p-4">Name</th>
                              <th className="p-4">Category</th>
                              <th className="p-4">Price</th>
                              <th className="p-4">Stock Status</th>
                              <th className="p-4">Date Added</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCatalog.map(item => (
                              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 transition">
                                <td className="p-4 font-mono font-bold text-slate-400">#00{item.id}</td>
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-150">{item.name}</td>
                                <td className="p-4">
                                  <span className={cn(
                                    'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                                    item.category === 'electronics' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
                                    item.category === 'apparel' && 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300',
                                    item.category === 'books' && 'bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-300',
                                    item.category === 'home' && 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300'
                                  )}>
                                    {item.category}
                                  </span>
                                </td>
                                <td className="p-4 font-bold">${item.price}</td>
                                <td className="p-4">
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <span className={cn('h-2.5 w-2.5 rounded-full', item.inStock ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-red-400')} />
                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </td>
                                <td className="p-4 font-mono text-slate-500">{item.dateAdded}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Standalone Sandbox Customizers */}
                  <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl p-6 shadow-md space-y-6">
                    <h5 className="font-extrabold text-sm border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span>Component Sandbox (Direct Custom Testing)</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-500/30">Sandbox</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Standalone Search Bar Sandbox */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">1. Standalone Debounced SearchBar</span>
                        <SearchBar
                          value={sandboxSearch}
                          onChange={(val) => setSandboxSearch(val)}
                          placeholder="Type here to test 800ms debounce..."
                          debounceMs={800}
                          variant="dark"
                          showSearchButton
                          searchIcon={
                            <span className="text-xs pr-1">🔍</span>
                          }
                          clearIcon={
                            <span className="text-xs text-red-500 hover:text-red-400 font-extrabold">X</span>
                          }
                        />
                        <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-500">Debounced Output:</span>
                          <span className="text-purple-400 font-extrabold">"{sandboxSearch}"</span>
                        </div>
                      </div>

                      {/* Standalone Checkbox Sandbox */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">2. Custom Animated Checkbox Sandbox</span>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          <Checkbox
                            label="Indigo Medium (Default)"
                            checked={sandboxCheck}
                            onChange={(checked) => setSandboxCheck(checked)}
                            variant="dark"
                            colorTheme="indigo"
                          />
                          <Checkbox
                            label="Blue Small"
                            checked={sandboxCheck}
                            onChange={(checked) => setSandboxCheck(checked)}
                            variant="dark"
                            colorTheme="blue"
                            size="sm"
                          />
                          <Checkbox
                            label="Green Large"
                            checked={sandboxCheck}
                            onChange={(checked) => setSandboxCheck(checked)}
                            variant="dark"
                            colorTheme="green"
                            size="lg"
                          />
                          <Checkbox
                            label="Rose Indeterminate"
                            checked={false}
                            indeterminate={!sandboxCheck}
                            variant="dark"
                            colorTheme="rose"
                          />
                        </div>
                        <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-500">Toggled Status:</span>
                          <span className="text-purple-400 font-extrabold">{sandboxCheck ? 'CHECKED (true)' : 'UNCHECKED (false)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'console' && (() => {
          const handleRemoveWidget = (id: string) => {
            setWidgetsLayout((prev) => prev.map((item) => item.id === id ? { ...item, visible: false } : item));
          };

          const handleAddWidget = (id: string) => {
            setWidgetsLayout((prev) => prev.map((item) => item.id === id ? { ...item, visible: true } : item));
            setIsAddWidgetsOpen(false);
          };

          const handleResetLayout = () => {
            setWidgetsLayout([
              { id: 'aws-applications', colSpan: 2, rowSpan: 1, visible: true },
              { id: 'aws-recently-visited', colSpan: 1, rowSpan: 1, visible: true },
              { id: 'aws-welcome', colSpan: 1, rowSpan: 1, visible: true },
              { id: 'aws-health', colSpan: 1, rowSpan: 1, visible: true },
              { id: 'aws-cost-usage', colSpan: 1, rowSpan: 1, visible: true },
              { id: 'aws-traffic-chart', colSpan: 2, rowSpan: 1, visible: true },
            ]);
            setConsoleRegion('us-west-2');
            setConsoleAppSearch('');
          };

          const getWidgetSpan = (id: string) => {
            const match = widgetsLayout.find((w) => w.id === id);
            return {
              colSpan: (match?.colSpan || 1) as any,
              rowSpan: (match?.rowSpan || 1) as any,
            };
          };

          const allWidgets: DashboardWidget[] = [
            {
              id: 'aws-applications',
              title: 'Applications (0)',
              subtitle: `Region: ${
                consoleRegion === 'us-west-2'
                  ? 'US West (Oregon)'
                  : consoleRegion === 'us-east-1'
                  ? 'US East (N. Virginia)'
                  : 'Europe (Ireland)'
              }`,
              colSpan: getWidgetSpan('aws-applications').colSpan,
              rowSpan: getWidgetSpan('aws-applications').rowSpan,
              onRemove: () => handleRemoveWidget('aws-applications'),
              headerActions: (
                <button 
                  onClick={() => alert('Launching Create Application Flow...')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-750 transition cursor-pointer"
                >
                  Create application
                </button>
              ),
              content: (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Select Region</span>
                      <select
                        value={consoleRegion}
                        onChange={(e) => setConsoleRegion(e.target.value)}
                        className="mt-1 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-900/60 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-250 focus:outline-none cursor-pointer"
                      >
                        <option value="us-west-2">us-west-2 (Current Region)</option>
                        <option value="us-east-1">us-east-1 (N. Virginia)</option>
                        <option value="eu-west-1">eu-west-1 (Ireland)</option>
                      </select>
                    </div>
                    <div className="flex-grow">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Find applications</span>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          placeholder="Search applications..."
                          value={consoleAppSearch}
                          onChange={(e) => setConsoleAppSearch(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-100 dark:border-slate-900/60 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="absolute right-2.5 top-2.5 text-slate-400 text-[10px]">🔍</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-dashed border-slate-100 dark:border-slate-900/60 rounded-xl p-8 text-center bg-slate-50/20 dark:bg-slate-900/10">
                    <div className="text-3xl text-slate-300 dark:text-slate-700 mb-2">📁</div>
                    <p className="font-bold text-slate-600 dark:text-slate-400">
                      {consoleAppSearch ? 'No matching applications' : 'No applications'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {consoleAppSearch ? 'Try clearing your search filters.' : 'Get started by creating an application.'}
                    </p>
                    {!consoleAppSearch && (
                      <button 
                        onClick={() => alert('Launching Create Application Flow...')}
                        className="mt-4 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-sm"
                      >
                        Create application
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-900/60 pt-3 text-[11px]">
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Go to myApplications &rarr;
                    </a>
                    <span className="text-slate-400">&lt; Page 1 of 1 &gt;</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'aws-recently-visited',
              title: 'Recently visited',
              colSpan: getWidgetSpan('aws-recently-visited').colSpan,
              rowSpan: getWidgetSpan('aws-recently-visited').rowSpan,
              onRemove: () => handleRemoveWidget('aws-recently-visited'),
              content: (
                <div className="space-y-3 font-sans text-xs flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    {[
                      { name: 'Amazon Lex', desc: 'Conversational AI Chatbots', color: 'bg-indigo-650', char: 'AL' },
                      { name: 'Amazon Connect Customer', desc: 'Cloud Contact Center', color: 'bg-emerald-600', char: 'AC' },
                      { name: 'IAM', desc: 'Identity & Access Control', color: 'bg-rose-500', char: 'IM' },
                      { name: 'EC2', desc: 'Virtual Compute Servers', color: 'bg-amber-500', char: 'EC' },
                    ].map((srv) => (
                      <a
                        key={srv.name}
                        href="#"
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:border-slate-200 dark:hover:border-slate-800 transition group/item"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-lg ${srv.color} text-white flex items-center justify-center font-bold text-[11px] shadow-sm`}>
                            {srv.char}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 dark:text-slate-200">{srv.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{srv.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-650 group-hover/item:translate-x-0.5 transition" />
                      </a>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-900/60 pt-3">
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      View all services &rarr;
                    </a>
                  </div>
                </div>
              ),
            },
            {
              id: 'aws-welcome',
              title: 'Welcome to AWS',
              colSpan: getWidgetSpan('aws-welcome').colSpan,
              rowSpan: getWidgetSpan('aws-welcome').rowSpan,
              onRemove: () => handleRemoveWidget('aws-welcome'),
              content: (
                <div className="space-y-4 font-sans text-xs flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <a href="#" className="font-extrabold text-sm text-indigo-650 dark:text-indigo-450 flex items-center hover:underline">
                      <span>Getting started with AWS</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Learn cloud fundamentals, configure secure access keys, launch micro-instances, and monitor real-time billing quotas.
                    </p>
                  </div>

                  <div className="flex justify-center py-2 relative group select-none">
                    <svg className="w-24 h-24 text-indigo-600 animate-pulse duration-[3000ms]" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <linearGradient id="rocketGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#4338ca" />
                        </linearGradient>
                        <linearGradient id="fireGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="40" className="fill-slate-50 dark:fill-slate-850/50" />
                      <path d="M50 20 C60 35 60 55 58 65 L42 65 C40 55 40 35 50 20 Z" fill="url(#rocketGrad2)" />
                      <path d="M50 65 C54 74 52 82 50 86 C48 82 46 74 50 65 Z" fill="url(#fireGrad2)" className="animate-bounce" />
                      <circle cx="50" cy="38" r="3" fill="#ffffff" />
                      <circle cx="50" cy="48" r="3" fill="#ffffff" />
                    </svg>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-900/60 pt-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Account: 1294-8849-2041</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'aws-health',
              title: 'AWS Health',
              colSpan: getWidgetSpan('aws-health').colSpan,
              rowSpan: getWidgetSpan('aws-health').rowSpan,
              onRemove: () => handleRemoveWidget('aws-health'),
              content: (
                <div className="space-y-4 font-sans text-xs flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-450 text-[11px]">All systems active and stable</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="block text-lg font-extrabold text-slate-850 dark:text-slate-100">0</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Open issues</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="block text-lg font-extrabold text-slate-850 dark:text-slate-100">0</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Scheduled</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="block text-lg font-extrabold text-slate-850 dark:text-slate-100">0</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Alerts</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-900/60 pt-3">
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Open AWS Health Dashboard &rarr;
                    </a>
                  </div>
                </div>
              ),
            },
            {
              id: 'aws-cost-usage',
              title: 'Cost and usage',
              colSpan: getWidgetSpan('aws-cost-usage').colSpan,
              rowSpan: getWidgetSpan('aws-cost-usage').rowSpan,
              onRemove: () => handleRemoveWidget('aws-cost-usage'),
              content: (
                <div className="space-y-4 font-sans text-xs flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Month Cost</span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">$53.78</span>
                      <span className="text-slate-400 text-xs">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Forecasted month end: <span className="font-semibold text-slate-600 dark:text-slate-350">$64.50</span>
                    </p>
                  </div>

                  <div className="h-[95px] -mx-4">
                    <OrbitBarChart
                      data={[
                        { service: 'EC2', cost: 24.2 },
                        { service: 'RDS', cost: 12.8 },
                        { service: 'S3', cost: 8.5 },
                        { service: 'Lambda', cost: 4.1 },
                        { service: 'Lex', cost: 4.18 },
                      ]}
                      index="service"
                      categories={['cost']}
                      showXAxis={true}
                      showYAxis={false}
                      showLegend={false}
                      height={95}
                      barRadius={4}
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-900/60 pt-2 flex justify-between items-center text-[10px]">
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-xs">
                      View Cost Explorer &rarr;
                    </a>
                    <span className="text-slate-400">Last updated: 1 hr ago</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'aws-traffic-chart',
              title: 'Core Traffic Analytics',
              subtitle: 'Real-time client request volume & bandwidth allocation',
              colSpan: getWidgetSpan('aws-traffic-chart').colSpan,
              rowSpan: getWidgetSpan('aws-traffic-chart').rowSpan,
              onRemove: () => handleRemoveWidget('aws-traffic-chart'),
              content: (
                <div className="space-y-4 font-sans text-xs flex flex-col justify-between h-full">
                  <div className="h-[210px] -mx-2">
                    <OrbitAreaChart
                      data={[
                        { date: '06-05', desktop: 1200, mobile: 600 },
                        { date: '06-06', desktop: 1450, mobile: 720 },
                        { date: '06-07', desktop: 1100, mobile: 840 },
                        { date: '06-08', desktop: 1680, mobile: 930 },
                        { date: '06-09', desktop: 1890, mobile: 1120 },
                        { date: '06-10', desktop: 2150, mobile: 1380 },
                      ]}
                      index="date"
                      categories={['desktop', 'mobile']}
                      height={210}
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-900/60 pt-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>Cluster active servers</span>
                    </div>
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      View CloudWatch Metrics &rarr;
                    </a>
                  </div>
                </div>
              ),
            },
          ];

          const activeWidgetIds = widgetsLayout.filter((w) => w.visible).map((w) => w.id);

          // Filter widgets that are active
          const visibleWidgets = allWidgets.filter((w) => activeWidgetIds.includes(w.id));
          // Sort them by the order in widgetsLayout
          const sortedVisibleWidgets = [...visibleWidgets].sort((a, b) => {
            return widgetsLayout.findIndex((w) => w.id === a.id) - widgetsLayout.findIndex((w) => w.id === b.id);
          });

          // Widgets that can be added
          const addableWidgets = allWidgets.filter((w) => !activeWidgetIds.includes(w.id));

          const handleLayoutChange = (newWidgets: DashboardWidget[]) => {
            setWidgetsLayout((prev) => {
              const orderMap = newWidgets.map((w) => w.id);
              const updated = prev.map((item) => {
                const match = newWidgets.find((w) => w.id === item.id);
                if (match) {
                  return {
                    ...item,
                    colSpan: match.colSpan || item.colSpan,
                    rowSpan: match.rowSpan || item.rowSpan,
                  };
                }
                return item;
              });
              return [...updated].sort(
                (a, b) => orderMap.indexOf(a.id) - orderMap.indexOf(b.id)
              );
            });
          };

          return (
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 font-sans">
              {/* Dashboard Action Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900/60 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-50 flex items-center space-x-2 tracking-tight">
                    <span>Console Home</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-805 text-slate-500 dark:text-slate-400 hover:text-indigo-600 cursor-pointer flex items-center">
                      Info <Info className="w-3 h-3 ml-1" />
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Drag card headers to customize your dashboard layout. Custom ordering is animated instantly.
                  </p>
                </div>

                <div className="flex items-center space-x-3 relative">
                  {/* Reset button */}
                  <button
                    onClick={handleResetLayout}
                    className="flex items-center space-x-1.5 px-4 py-2 border border-slate-100 dark:border-slate-900/60 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to default layout</span>
                  </button>

                  {/* Add widgets dropdown controller */}
                  <div className="relative">
                    <button
                      onClick={() => setIsAddWidgetsOpen(!isAddWidgetsOpen)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-sm shadow-indigo-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add widgets</span>
                    </button>

                    {isAddWidgetsOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 dark:border-slate-900/60 bg-white dark:bg-slate-900 shadow-lg z-50 overflow-hidden font-sans">
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-900/60 bg-slate-50 dark:bg-slate-900/50">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Available Widgets</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1">
                          {addableWidgets.length === 0 ? (
                            <div className="px-4 py-3 text-center text-xs text-slate-400 italic">
                              All widgets active!
                            </div>
                          ) : (
                            addableWidgets.map((widget) => (
                              <button
                                key={widget.id}
                                onClick={() => handleAddWidget(widget.id)}
                                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition font-medium cursor-pointer"
                              >
                                {widget.title}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Draggable Reorderable Grid */}
              {sortedVisibleWidgets.length === 0 ? (
                <div className="border-2 border-dashed border-slate-100 dark:border-slate-900/60 rounded-3xl p-16 text-center bg-white dark:bg-slate-900 max-w-lg mx-auto shadow-sm">
                  <div className="text-4xl mb-4">📭</div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">All widgets are hidden</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                    You have closed all dashboard widgets. Click "+ Add widgets" in the top right to restore them or reset the layout.
                  </p>
                  <button
                    onClick={handleResetLayout}
                    className="mt-6 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    Reset Layout
                  </button>
                </div>
              ) : (
                <DashboardGrid
                  items={sortedVisibleWidgets}
                  onLayoutChange={handleLayoutChange}
                  cols={3}
                />
              )}
            </div>
          );
        })()}

        {activeTab === 'documents' && (
          <div className="h-full w-full p-6 flex flex-col">
            <div className="mb-4 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Document Template & Viewer Management</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage templates, dynamically bind mock data schemas, and view compiled high-fidelity files.</p>
              </div>
              <button 
                onClick={() => setActiveTab('showcase')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-850 rounded-lg transition cursor-pointer"
              >
                Back to Showcase
              </button>
            </div>
            <div className="flex-grow min-h-0 relative">
              <DocumentManagementShowcase />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
