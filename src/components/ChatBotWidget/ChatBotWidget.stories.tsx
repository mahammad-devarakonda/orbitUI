import type { Meta, StoryObj } from '@storybook/react';
import { ChatBotWidget } from './ChatBotWidget';

const meta: Meta<typeof ChatBotWidget> = {
  title: 'Components/ChatBotWidget',
  component: ChatBotWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
    },
    primaryColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color' },
    userMessageBg: { control: 'color' },
    userMessageTextColor: { control: 'color' },
    botMessageBg: { control: 'color' },
    botMessageTextColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof ChatBotWidget>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    botName: 'Orbit AI Support',
    status: 'online',
    statusText: 'Always here to help',
    greetingMessage: "Hi there! I'm Orbit AI. I can answer questions about our component library, layouts, or pricing. How can I help you today?",
    primaryColor: '#4f46e5',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    userMessageBg: '#4f46e5',
    userMessageTextColor: '#ffffff',
    botMessageBg: '#f3f4f6',
    botMessageTextColor: '#1f2937',
    width: 360,
    height: 500,
  },
};

export const CustomBrand: Story = {
  args: {
    defaultOpen: true,
    botName: 'Emerald Assistant',
    status: 'away',
    statusText: 'Be right back',
    greetingMessage: 'Welcome to the Emerald Lounge. What styling options would you like to discuss today?',
    primaryColor: '#059669', // emerald-600
    backgroundColor: '#f0fdf4', // emerald-50
    textColor: '#064e3b', // emerald-900
    userMessageBg: '#059669',
    userMessageTextColor: '#ffffff',
    botMessageBg: '#d1fae5', // emerald-100
    botMessageTextColor: '#064e3b',
    width: 380,
    height: 520,
    suggestions: [
      'Tell me about Emerald Theme',
      'How do I customize colors?',
      'Can I change the font?'
    ],
  },
};

export const DarkMode: Story = {
  args: {
    defaultOpen: true,
    botName: 'Cyber Bot 2077',
    status: 'busy',
    statusText: 'In a meeting',
    greetingMessage: 'System online. Diagnostics clear. State your query, human.',
    primaryColor: '#f43f5e', // rose-500
    backgroundColor: '#111827', // gray-900
    textColor: '#f9fafb', // gray-50
    userMessageBg: '#f43f5e',
    userMessageTextColor: '#ffffff',
    botMessageBg: '#1f2937', // gray-800
    botMessageTextColor: '#f3f4f6',
    width: 350,
    height: 480,
    suggestions: [
      'System diagnostics',
      'Override protocols',
      'Toggle dark mode'
    ],
  },
};
