import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InboxLayout } from './InboxLayout';

const meta: Meta<typeof InboxLayout> = {
    title: 'Layout/InboxLayout',
    component: InboxLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InboxLayout>;

const ListDemo = ({ onSelect }: { onSelect: () => void }) => (
    <div className="flex flex-col h-full">
        <header className="p-4 h-16 flex items-center border-b border-gray-100">
            <h2 className="text-xl font-bold">Messages</h2>
        </header>
        <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                    key={i}
                    onClick={onSelect}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-semibold truncate">User {i}</h4>
                            <span className="text-xs text-gray-500">12:30 PM</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">Hey, how is the project going?</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const HeaderDemo = () => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 shrink-0" />
        <div className="min-w-0">
            <h4 className="font-bold truncate">Project Chat</h4>
            <p className="text-xs text-green-500">Online</p>
        </div>
    </div>
);

const ThreadDemo = () => (
    <div className="p-6 space-y-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`
                        max-w-[70%] p-3 rounded-2xl text-sm
                        ${i % 2 === 0 ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}
                    `}
                >
                    {i % 2 === 0
                        ? "I'm working on the new layout components right now. Almost done!"
                        : "That's great! When can we review the Inbox layout?"}
                </div>
            </div>
        ))}
    </div>
);

const InputDemo = () => (
    <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
            Type a message...
        </div>
        <button className="text-indigo-600 font-bold px-2">Send</button>
    </div>
);

// --- Interactive Story Wrapper ---

const InteractiveInbox = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <InboxLayout
            isChatActive={isActive}
            onBack={() => setIsActive(false)}
            list={<ListDemo onSelect={() => setIsActive(true)} />}
            header={<HeaderDemo />}
            footer={<InputDemo />}
        >
            <ThreadDemo />
        </InboxLayout>
    );
};

export const Default: Story = {
    render: () => <InteractiveInbox />,
};
