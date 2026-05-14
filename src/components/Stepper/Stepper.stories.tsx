import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
    title: 'Components/Stepper',
    component: Stepper,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const defaultSteps = [
    { label: 'Theater Details' },
    { label: 'Screen Configuration' },
    { label: 'Review & Submit' },
];

export const FirstStep: Story = {
    args: {
        steps: defaultSteps,
        activeStep: 0,
    },
};

export const MiddleStep: Story = {
    args: {
        steps: defaultSteps,
        activeStep: 1,
    },
};

export const LastStep: Story = {
    args: {
        steps: defaultSteps,
        activeStep: 2,
    },
};

export const ManySteps: Story = {
    args: {
        steps: [
            { label: 'Step 1' },
            { label: 'Step 2' },
            { label: 'Step 3' },
            { label: 'Step 4' },
            { label: 'Step 5' },
            { label: 'Step 6' },
            { label: 'Step 7' },
            { label: 'Step 8' },
        ],
        activeStep: 3,
        compactLabels: true,
    },
};

export const NonCompactLabels: Story = {
    args: {
        steps: [
            { label: 'Step 1' },
            { label: 'Step 2' },
            { label: 'Step 3' },
            { label: 'Step 4' },
            { label: 'Step 5' },
        ],
        activeStep: 2,
        compactLabels: false,
    },
};
