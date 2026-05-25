import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Navigation/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showControls: { control: 'boolean' },
    showDots: { control: 'boolean' },
    snapToPage: { control: 'boolean' },
    gap: { control: { type: 'range', min: 8, max: 40, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ─── LiveEventCard ────────────────────────────────────────────────────────────

interface LiveEventCardProps {
  title: string;
  countText: string;
  image: string;
  gradientFrom: string;
  gradientTo: string;
}

const LiveEventCard: React.FC<LiveEventCardProps> = ({
  title,
  countText,
  image,
  gradientFrom,
  gradientTo,
}) => (
  <div className="relative w-52 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] group">
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div
      className={`absolute inset-0 opacity-45 mix-blend-multiply bg-gradient-to-tr ${gradientFrom} ${gradientTo}`}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
    <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
      <div className="flex flex-col gap-1 select-none">
        <span className="text-xl md:text-2xl font-black font-sans uppercase tracking-tight leading-tight max-w-[85%] break-words drop-shadow-sm">
          {title}
        </span>
        <span className="text-xs md:text-sm font-semibold tracking-wide text-white/90 drop-shadow-sm">
          {countText}
        </span>
      </div>
    </div>
  </div>
);

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: { label: string; color: 'green' | 'red' | 'amber' };
}

const badgeClasses: Record<NonNullable<ProductCardProps['badge']>['color'], string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  red: 'bg-rose-50 text-rose-700 border-rose-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  badge,
}) => (
  <div className="w-48 rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
    <div className="relative h-44 bg-gray-50 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {badge && (
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses[badge.color]}`}
        >
          {badge.label}
        </span>
      )}
    </div>
    <div className="p-3">
      <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">{name}</p>
      <div className="flex items-center gap-1 mt-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-[11px] text-gray-400 ml-0.5">({reviews})</span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-sm font-bold text-gray-900">{price}</span>
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
        )}
      </div>
    </div>
  </div>
);

// ─── AvatarCard ───────────────────────────────────────────────────────────────

interface AvatarCardProps {
  name: string;
  role: string;
  avatar: string;
  isLive?: boolean;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ name, role, avatar, isLive }) => (
  <div className="flex flex-col items-center gap-2 w-24 cursor-pointer group">
    <div className="relative">
      <div
        className={`w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 transition-all duration-200 group-hover:ring-4 ${isLive ? 'ring-rose-500' : 'ring-gray-200 group-hover:ring-indigo-400'
          }`}
      >
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      {isLive && (
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-px rounded-full tracking-wide">
          LIVE
        </span>
      )}
    </div>
    <div className="text-center">
      <p className="text-[12px] font-semibold text-gray-800 leading-tight">{name}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{role}</p>
    </div>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const liveEventsData = [
  {
    title: 'Amusement Park',
    countText: '15+ Events',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-600',
  },
  {
    title: 'Theatre Shows',
    countText: '9 Events',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-sky-600',
    gradientTo: 'to-indigo-900',
  },
  {
    title: 'Kids',
    countText: '10+ Events',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
  },
  {
    title: 'Adventure & Fun',
    countText: '7 Events',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-emerald-700',
  },
  {
    title: 'Music Shows',
    countText: '45+ Events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-fuchsia-500',
    gradientTo: 'to-violet-700',
  },
  {
    title: 'Comedy Shows',
    countText: '12 Events',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-rose-700',
  },
  {
    title: 'Food & Drinks',
    countText: '20+ Events',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-amber-700',
  },
];

const productsData: ProductCardProps[] = [
  {
    name: 'Noise-Cancelling Headphones Pro',
    price: '₹2,999',
    originalPrice: '₹5,499',
    rating: 4.5,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
    badge: { label: '45% off', color: 'red' },
  },
  {
    name: 'Minimal Leather Watch',
    price: '₹4,499',
    originalPrice: '₹6,000',
    rating: 4,
    reviews: 380,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    badge: { label: 'Bestseller', color: 'amber' },
  },
  {
    name: 'Wireless Mechanical Keyboard',
    price: '₹3,199',
    rating: 5,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400&auto=format&fit=crop',
    badge: { label: 'New', color: 'green' },
  },
  {
    name: 'Portable SSD 1TB',
    price: '₹5,799',
    originalPrice: '₹7,200',
    rating: 4.5,
    reviews: 670,
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Smart Water Bottle',
    price: '₹999',
    originalPrice: '₹1,499',
    rating: 4,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop',
    badge: { label: '33% off', color: 'red' },
  },
  {
    name: 'Ergonomic Desk Lamp',
    price: '₹1,499',
    rating: 4,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop',
  },
];

const creatorsData: AvatarCardProps[] = [
  { name: 'Priya S.', role: 'Design', avatar: 'https://i.pravatar.cc/150?img=47', isLive: true },
  { name: 'Arjun M.', role: 'Dev', avatar: 'https://i.pravatar.cc/150?img=12', isLive: false },
  { name: 'Leela K.', role: 'Music', avatar: 'https://i.pravatar.cc/150?img=56', isLive: true },
  { name: 'Ravi T.', role: 'Comedy', avatar: 'https://i.pravatar.cc/150?img=33', isLive: false },
  { name: 'Sara N.', role: 'Fitness', avatar: 'https://i.pravatar.cc/150?img=44', isLive: false },
  { name: 'Dev P.', role: 'Gaming', avatar: 'https://i.pravatar.cc/150?img=15', isLive: true },
  { name: 'Meena R.', role: 'Cooking', avatar: 'https://i.pravatar.cc/150?img=62', isLive: false },
  { name: 'Kiran B.', role: 'Travel', avatar: 'https://i.pravatar.cc/150?img=8', isLive: false },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const LiveEvents: Story = {
  render: (args) => (
    <div className="w-full max-w-6xl px-8 py-10 bg-gray-50 rounded-3xl shadow-inner">
      <Slider {...args}>
        {liveEventsData.map((event, idx) => (
          <LiveEventCard key={idx} {...event} />
        ))}
      </Slider>
    </div>
  ),
  args: {
    title: 'The Best Of Live Events',
    subtitle: 'Explore the most exciting events happening near you',
    seeAll: { label: 'See all events', onClick: () => alert('See all clicked') },
    showDots: true,
    snapToPage: true,
    gap: 16,
  },
};

export const ProductShelf: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl px-6 py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <Slider {...args}>
        {productsData.map((product, idx) => (
          <ProductCard key={idx} {...product} />
        ))}
      </Slider>
    </div>
  ),
  args: {
    title: 'Deals of the day',
    subtitle: 'Ends in 06:42:18',
    seeAll: { label: 'View all deals', onClick: () => alert('See all clicked') },
    showDots: true,
    snapToPage: true,
    gap: 14,
  },
};

export const CreatorRow: Story = {
  render: (args) => (
    <div className="w-full max-w-2xl px-6 py-6 bg-white rounded-2xl border border-gray-100">
      <Slider {...args}>
        {creatorsData.map((creator, idx) => (
          <AvatarCard key={idx} {...creator} />
        ))}
      </Slider>
    </div>
  ),
  args: {
    title: 'Live now',
    subtitle: '3 creators streaming',
    showDots: false,
    snapToPage: true,
    gap: 12,
  },
};

export const SimpleTextCards: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl p-6 bg-white rounded-2xl border border-gray-100">
      <Slider {...args}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <div
            key={num}
            className="w-40 h-24 bg-gradient-to-tr from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100/60 rounded-xl flex flex-col justify-center items-center font-semibold text-indigo-700 cursor-pointer shadow-sm hover:shadow transition-all duration-200"
          >
            <span className="text-2xl font-black">0{num}</span>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-500 mt-1">
              Item Card
            </span>
          </div>
        ))}
      </Slider>
    </div>
  ),
  args: {
    title: 'Custom navigation slider',
    showControls: true,
    showDots: true,
    snapToPage: true,
    gap: 16,
  },
};

export const NoControls: Story = {
  render: (args) => (
    <div className="w-full max-w-2xl px-4 py-6 bg-gray-50 rounded-2xl">
      <Slider {...args}>
        {liveEventsData.slice(0, 5).map((event, idx) => (
          <LiveEventCard key={idx} {...event} />
        ))}
      </Slider>
    </div>
  ),
  args: {
    title: 'Touch / trackpad only',
    subtitle: 'No arrow buttons — swipe or drag',
    showControls: false,
    showDots: true,
    snapToPage: false,
    gap: 16,
  },
};