import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const sampleItems = (
    <React.Fragment>
        <AccordionItem value="item-1">
            <AccordionTrigger>What is OrbitUI?</AccordionTrigger>
            <AccordionContent>
                OrbitUI is a high-fidelity, premium component kit built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion. It focuses on stunning micro-animations and state-of-the-art interactive layouts.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>Is it fully responsive?</AccordionTrigger>
            <AccordionContent>
                Yes, every component in OrbitUI is engineered from the ground up to support responsive layouts, mobile touch gestures, and desktop configurations seamlessly.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>How do I integrate Framer Motion?</AccordionTrigger>
            <AccordionContent>
                Framer Motion is configured natively in OrbitUI. Components automatically manage complex animation states like slide-overs, dynamic layout transitions, and fluid triggers without extra setup.
            </AccordionContent>
        </AccordionItem>
    </React.Fragment>
);

export const BorderedSingle: Story = {
    args: {
        type: 'single',
        variant: 'bordered',
        defaultValue: ['item-1'],
        children: sampleItems,
    },
};

export const BorderedMultiple: Story = {
    args: {
        type: 'multiple',
        variant: 'bordered',
        defaultValue: ['item-1', 'item-2'],
        children: sampleItems,
    },
};

export const GhostTheme: Story = {
    args: {
        type: 'single',
        variant: 'ghost',
        children: sampleItems,
    },
};

export const SeparatedTheme: Story = {
    args: {
        type: 'single',
        variant: 'separated',
        children: sampleItems,
    },
};

export const WithDisabledItem: Story = {
    render: () => (
        <Accordion type="single" variant="bordered">
            <AccordionItem value="item-1">
                <AccordionTrigger>Available Feature</AccordionTrigger>
                <AccordionContent>
                    This is an active accordion panel. You can toggle this open or closed at will.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" disabled>
                <AccordionTrigger>Disabled Premium Tool</AccordionTrigger>
                <AccordionContent>
                    This is a locked feature under your current subscription plan.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Another Available Feature</AccordionTrigger>
                <AccordionContent>
                    This accordion is accessible and ready to trigger.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
