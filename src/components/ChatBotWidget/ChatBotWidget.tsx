import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ChatBotWidgetProps {
  /** Initial width of the chat window (default: 360) */
  width?: number;
  /** Initial height of the chat window (default: 500) */
  height?: number;
  /** Callback triggered when widget is resized */
  onResize?: (width: number, height: number) => void;
  /** Position of the floating widget */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Bot display name */
  botName?: string;
  /** Bot status: online, offline, away */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Custom status text */
  statusText?: string;
  /** Bot avatar image URL or initials */
  botAvatar?: string;
  /** Initial greeting message from the bot */
  greetingMessage?: string;
  /** Suggestion chips for quick replies */
  suggestions?: string[];
  /** Primary theme color (hex code or tailwind class) */
  primaryColor?: string;
  /** Background color of the chat window */
  backgroundColor?: string;
  /** Text color of the chat window */
  textColor?: string;
  /** User message bubble background color */
  userMessageBg?: string;
  /** User message bubble text color */
  userMessageTextColor?: string;
  /** Bot message bubble background color */
  botMessageBg?: string;
  /** Bot message bubble text color */
  botMessageTextColor?: string;
  /** Custom CSS class name for the widget */
  className?: string;
  /** Whether the widget should start open */
  defaultOpen?: boolean;
}

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  time: string;
}

const isColorDark = (color: string) => {
  if (!color || !color.startsWith('#')) return false;
  const hex = color.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return false;

  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  // HSP color model equation for perceived brightness
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  return hsp < 140; // returns true if dark
};

export const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({
  width = 360,
  height = 500,
  onResize,
  position = 'bottom-right',
  botName = 'Orbit AI',
  status = 'online',
  statusText = 'Online',
  botAvatar,
  greetingMessage = "Hi! I'm Orbit AI. How can I help you build amazing interfaces today?",
  suggestions = [
    'What is Orbit UI?',
    'Is it free to use?',
    'How do I resize this widget?',
    'Show me component list'
  ],
  primaryColor = '#4f46e5', // indigo-600
  backgroundColor = '#ffffff',
  textColor = '#1f2937', // gray-800
  userMessageBg = '#4f46e5',
  userMessageTextColor = '#ffffff',
  botMessageBg = '#f3f4f6', // gray-100
  botMessageTextColor = '#1f2937',
  className = '',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [localWidth, setLocalWidth] = useState(width);
  const [localHeight, setLocalHeight] = useState(height);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const isDark = isColorDark(backgroundColor);

  // Sync width/height props if they change externally
  useEffect(() => {
    setLocalWidth(width);
  }, [width]);

  useEffect(() => {
    setLocalHeight(height);
  }, [height]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0 && greetingMessage) {
      setMessages([
        {
          id: 'greeting',
          text: greetingMessage,
          isOwn: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [greetingMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Resize handler logic
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: localWidth,
      h: localHeight,
    };
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    let newWidth = startPosRef.current.w;
    let newHeight = startPosRef.current.h;

    // Adjust width/height calculation based on position of the widget
    if (position.includes('right')) {
      newWidth = startPosRef.current.w - deltaX; // Dragging left increases width
    } else {
      newWidth = startPosRef.current.w + deltaX; // Dragging right increases width
    }

    if (position.includes('bottom')) {
      newHeight = startPosRef.current.h - deltaY; // Dragging up increases height
    } else {
      newHeight = startPosRef.current.h + deltaY; // Dragging down increases height
    }

    // Constraints
    const clampedWidth = Math.max(280, Math.min(800, newWidth));
    const clampedHeight = Math.max(350, Math.min(800, newHeight));

    setLocalWidth(clampedWidth);
    setLocalHeight(clampedHeight);

    if (onResize) {
      onResize(clampedWidth, clampedHeight);
    }
  };

  const handleResizeEnd = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Chat Bot response generation
  const handleBotResponse = (userText: string) => {
    setIsTyping(true);

    // Simulate thinking/typing delay
    setTimeout(() => {
      let reply = "I'm not sure how to answer that, but I'm learning! Ask me about Orbit UI, customization, or pricing.";
      const text = userText.toLowerCase();

      if (text.includes('orbit ui')) {
        reply = "Orbit UI is a premium, state-of-the-art React component library designed with modern aesthetics, rich gradients, and glassmorphism. It includes calendars, charts, coverflow carousels, seat designers, and now this awesome chatbot widget!";
      } else if (text.includes('free') || text.includes('price') || text.includes('cost')) {
        reply = "Yes! Orbit UI is 100% free and open-source for both personal and commercial projects. Go ahead and build something amazing!";
      } else if (text.includes('resize') || text.includes('width') || text.includes('height')) {
        reply = "You can resize this widget dynamically! Just hover over the resize handle (the diagonal icon or the top/left borders when it is open) and drag to your desired size. You can also customize it from the control panel.";
      } else if (text.includes('component')) {
        reply = "Orbit UI features over 40+ premium components including Accordion, Calendar, CoverflowCarousel, SeatLayout, OtpInput, DashboardGrid, DocumentManagement, and more!";
      } else if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
        reply = `Hello! How can I assist you today? I can tell you all about Orbit UI's capabilities.`;
      } else if (text.includes('clear') || text.includes('reset')) {
        setMessages([
          {
            id: 'greeting',
            text: greetingMessage,
            isOwn: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
        setIsTyping(false);
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          text: reply,
          isOwn: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      text: text,
      isOwn: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Trigger bot reply
    handleBotResponse(text);
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Determine border and handle position based on widget position
  // e.g. if bottom-right, resize handle should be top-left
  const resizeHandleClasses = cn(
    'absolute w-5 h-5 cursor-nwse-resize z-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors',
    position === 'bottom-right' && 'top-0 left-0 rounded-tl-xl border-t border-l border-transparent hover:border-gray-355',
    position === 'bottom-left' && 'top-0 right-0 rounded-tr-xl border-t border-r border-transparent hover:border-gray-355 rotate-90',
    position === 'top-right' && 'bottom-0 left-0 rounded-bl-xl border-b border-l border-transparent hover:border-gray-355 -rotate-90',
    position === 'top-left' && 'bottom-0 right-0 rounded-br-xl border-b border-r border-transparent hover:border-gray-355 rotate-180'
  );

  return (
    <div className={cn('fixed z-50 font-sans', positionClasses[position], className)}>
      <AnimatePresence>
        {!isOpen ? (
          // Launcher Button
          <motion.button
            key="launcher"
            layoutId="chatbot-container"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-opacity-30"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 10px 25px -5px ${primaryColor}80`
            }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        ) : (
          // Chat Window
          <motion.div
            key="chatwindow"
            layoutId="chatbot-container"
            ref={widgetRef}
            className="flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800 backdrop-blur-sm"
            style={{
              width: localWidth,
              height: localHeight,
              backgroundColor: backgroundColor,
              color: textColor,
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)'
            }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Resize Handle */}
            <div
              className={resizeHandleClasses}
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            >
              <Scale className="w-3.5 h-3.5 transform rotate-45" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 text-white select-none shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center space-x-3 pl-4"> {/* Left padding to avoid resize handle */}
                {botAvatar ? (
                  <img src={botAvatar} alt={botName} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/10">
                    {botName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                    {botName}
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full inline-block",
                      status === 'online' && "bg-green-400",
                      status === 'offline' && "bg-gray-400",
                      status === 'busy' && "bg-red-400",
                      status === 'away' && "bg-amber-400"
                    )} />
                    <span className="text-[10.5px] text-white/80 font-medium">{statusText}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleBotResponse('clear')}
                  className="p-1.5 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.isOwn ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap break-words",
                      msg.isOwn ? "rounded-tr-none" : "rounded-tl-none"
                    )}
                    style={msg.isOwn ? {
                      backgroundColor: userMessageBg,
                      color: userMessageTextColor
                    } : {
                      backgroundColor: botMessageBg,
                      color: botMessageTextColor
                    }}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9.5px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <div
                    className="p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-sm"
                    style={{ backgroundColor: botMessageBg, color: botMessageTextColor }}
                  >
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !isTyping && suggestions.length > 0 && (
              <div
                className="px-4 py-2.5 flex flex-wrap gap-2 shrink-0 border-t"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
                }}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border shadow-sm hover:shadow transition-all duration-200 cursor-pointer select-none text-left"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                      color: textColor
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div
              className="p-3 border-t flex items-center space-x-2 shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-40 text-sm transition-all"
                style={{
                  '--tw-ring-color': primaryColor,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  color: textColor
                } as React.CSSProperties}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: inputValue.trim() ? `0 4px 10px -2px ${primaryColor}60` : 'none'
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
