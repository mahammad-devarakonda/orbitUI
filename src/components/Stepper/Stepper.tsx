import React from 'react';
import { Check } from 'lucide-react';
import { Typography } from '../Typography/Typography';

export interface Step {
    label: string;
    icon?: React.ReactNode;
}

export interface StepperProps {
    steps: Step[];
    activeStep: number;
    className?: string;
    /** Whether to show labels only for active, first and last steps when there are many steps */
    compactLabels?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
    steps,
    activeStep,
    className = '',
    compactLabels = true,
}) => {
    const totalSteps = steps.length;

    return (
        <div className={`w-full overflow-x-auto py-12 px-8 ${className} scrollbar-hide`}>
            <div className="flex items-start justify-between min-w-max md:min-w-0">
                {steps.map((step, i) => {
                    const isCompleted = i < activeStep;
                    const isActive = i === activeStep;

                    return (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center group relative shrink-0" style={{ width: totalSteps > 5 ? 'auto' : '120px' }}>
                                {/* Circle Container */}
                                <div 
                                    className={`
                                        relative z-10
                                        w-12 h-12 
                                        rounded-full
                                        flex items-center justify-center 
                                        border-2 
                                        transition-all duration-500 ease-out
                                        ${isActive 
                                            ? 'border-indigo-600 bg-white text-indigo-600 shadow-[0_0_25px_-5px_rgba(79,70,229,0.4)] scale-110' 
                                            : isCompleted
                                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]'
                                                : 'border-slate-200 bg-slate-50 text-slate-400'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check size={24} strokeWidth={3} className="animate-in zoom-in duration-300" />
                                    ) : (
                                        <div className={`transition-all duration-300 ${isActive ? 'scale-110 font-bold' : 'scale-100 font-medium'}`}>
                                            {step.icon || <span>{i + 1}</span>}
                                        </div>
                                    )}

                                    {/* Active Pulse Effect */}
                                    {isActive && (
                                        <span className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20"></span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className={`
                                    absolute -bottom-10 
                                    flex flex-col items-center
                                    transition-all duration-300
                                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-80'}
                                `}>
                                    {(!compactLabels || totalSteps <= 6 || isActive || i === 0 || i === totalSteps - 1) && (
                                        <Typography
                                            variant="caption"
                                            weight={isActive ? "bold" : "medium"}
                                            color={isActive ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-slate-500"}
                                            className="whitespace-nowrap text-center px-4"
                                        >
                                            {step.label}
                                        </Typography>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {i < totalSteps - 1 && (
                                <div className="flex-1 self-center h-12 flex items-center px-2 min-w-10">
                                    <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`
                                                absolute inset-0 bg-linear-to-r from-emerald-400 to-indigo-500
                                                transition-all duration-700 ease-in-out
                                            `}
                                            style={{ 
                                                width: isCompleted ? '100%' : '0%',
                                                opacity: isCompleted ? 1 : 0
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
