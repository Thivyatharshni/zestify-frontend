import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, ChevronLeft, ChevronRight as ChevronRightIcon, ShoppingBag } from 'lucide-react';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Button Component with Dark Theme Support
export const Button = ({ className, variant = 'primary', size = 'md', dark = false, children, ...props }) => {
    const variants = dark ? {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600 shadow-lg shadow-slate-700/30',
        outline: 'border-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50',
        ghost: 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
    } : {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-md',
        outline: 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50',
        ghost: 'text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium',
        md: 'px-4 py-2 text-sm font-semibold',
        lg: 'px-6 py-3 text-base font-bold',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// Card Component with Dark Theme Support
export const Card = ({ className, dark = false, children }) => (
    <div className={cn(
        'rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow',
        dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100',
        className
    )}>
        {children}
    </div>
);

// StatCard Component
export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'orange' }) => {
    const colors = {
        orange: 'bg-orange-50 text-orange-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <Card className="flex items-center gap-4">
            <div className={cn('p-4 rounded-xl', colors[color])}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {trend && (
                    <p className={cn('text-xs mt-1 font-medium', trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </p>
                )}
            </div>
        </Card>
    );
};

// Badge Component with Dark Theme Support
export const Badge = ({ children, variant = 'neutral', className, dark = false }) => {
    const variants = dark ? {
        neutral: 'bg-slate-700 text-slate-300 border border-slate-600',
        success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
        primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    } : {
        neutral: 'bg-slate-100 text-slate-600',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        primary: 'bg-orange-100 text-orange-700',
    };

    return (
        <span className={cn('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', variants[variant], className)}>
            {children}
        </span>
    );
};

// Table Component with Dark Theme Support
export const Table = ({ headers, children, dark = false }) => (
    <div className={cn(
        'w-full overflow-x-auto rounded-3xl border',
        dark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'
    )}>
        <table className="w-full text-left border-collapse">
            <thead className={cn('border-b', dark ? 'bg-slate-700/50 border-slate-700' : 'bg-slate-50/50 border-slate-100')}>
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx} className={cn(
                            'px-6 py-5 text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap',
                            dark ? 'text-slate-300' : 'text-slate-400'
                        )}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={cn('divide-y', dark ? 'divide-slate-700' : 'divide-slate-50')}>
                {children}
            </tbody>
        </table>
    </div>
);

// Input Component with Dark Theme Support
export const Input = ({ label, error, className, dark = false, ...props }) => (
    <div className="w-full space-y-1.5">
        {label && <label className={cn('text-xs font-black uppercase tracking-widest ml-1', dark ? 'text-slate-400' : 'text-slate-500')}>{label}</label>}
        <input
            className={cn(
                'w-full px-5 py-3.5 rounded-2xl border outline-none transition-all text-sm font-semibold',
                dark
                    ? 'border-slate-600 bg-slate-700/50 focus:bg-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500 text-white'
                    : 'border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 placeholder:text-slate-300',
                error && 'border-red-500 focus:ring-red-500/5 focus:border-red-500',
                className
            )}
            {...props}
        />
        {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
);

// Textarea Component with Dark Theme Support
export const Textarea = ({ label, error, className, dark = false, ...props }) => (
    <div className="w-full space-y-1.5">
        {label && <label className={cn('text-xs font-black uppercase tracking-widest ml-1', dark ? 'text-slate-400' : 'text-slate-500')}>{label}</label>}
        <textarea
            className={cn(
                'w-full px-5 py-3.5 rounded-2xl border outline-none transition-all text-sm font-semibold min-h-[120px]',
                dark
                    ? 'border-slate-600 bg-slate-700/50 focus:bg-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500 text-white'
                    : 'border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 placeholder:text-slate-300',
                error && 'border-red-500 focus:ring-red-500/5 focus:border-red-500',
                className
            )}
            {...props}
        />
        {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
);

// Modal Component with Dark Theme Support
export const Modal = ({ isOpen, onClose, title, children, footer, dark = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className={cn(
                'relative rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col',
                dark ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white border border-white/20'
            )}>
                <div className={cn(
                    'px-10 py-8 border-b flex items-center justify-between',
                    dark ? 'border-slate-700 bg-slate-800' : 'border-slate-50 bg-white'
                )}>
                    <h2 className={cn('text-2xl font-black tracking-tighter', dark ? 'text-white' : 'text-slate-900')}>{title}</h2>
                    <button onClick={onClose} className={cn('p-2.5 rounded-2xl transition-all', dark ? 'hover:bg-slate-700' : 'hover:bg-slate-50')}>
                        <X size={20} className={dark ? 'text-slate-400' : 'text-slate-400'} />
                    </button>
                </div>
                <div className={cn('px-10 py-8 overflow-y-auto flex-1', dark && 'text-slate-200')}>
                    {children}
                </div>
                {footer && (
                    <div className={cn(
                        'px-10 py-6 border-t flex justify-end gap-3',
                        dark ? 'border-slate-700 bg-slate-700/30' : 'border-slate-50 bg-slate-50/30'
                    )}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// Pagination Component with Dark Theme Support
export const Pagination = ({ currentPage, totalPages, onPageChange, dark = false }) => (
    <div className="flex items-center justify-between mt-8 px-2">
        <p className={cn('text-xs font-bold italic', dark ? 'text-slate-400' : 'text-slate-400')}>
            Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1.5">
            <Button
                variant="outline"
                size="sm"
                dark={dark}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-xl h-10 w-10 p-0"
            >
                <ChevronLeft size={18} />
            </Button>
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => onPageChange(idx + 1)}
                        className={cn(
                            'h-10 w-10 rounded-xl text-xs font-black transition-all',
                            currentPage === idx + 1
                                ? dark
                                    ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/30'
                                    : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                                : dark
                                    ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        )}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
            <Button
                variant="outline"
                size="sm"
                dark={dark}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-xl h-10 w-10 p-0"
            >
                <ChevronRightIcon size={18} />
            </Button>
        </div>
    </div>
);

// Loader Component with Dark Theme Support
export const Loader = ({ dark = false }) => (
    <div className={cn(
        'flex flex-col items-center justify-center py-24 gap-6 rounded-[2.5rem] border shadow-sm',
        dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'
    )}>
        <div className={cn(
            'w-14 h-14 border-[5px] rounded-full animate-spin shadow-lg',
            dark
                ? 'border-blue-900 border-t-blue-500 shadow-blue-500/20'
                : 'border-orange-50 border-t-orange-500 shadow-orange-500/5'
        )} />
        <p className={cn(
            'text-[10px] font-black uppercase tracking-[0.3em] animate-pulse',
            dark ? 'text-slate-500' : 'text-slate-300'
        )}>Analyzing Server Data</p>
    </div>
);

// Empty State with Dark Theme Support
export const EmptyState = ({ title, message, icon: Icon = ShoppingBag, dark = false }) => (
    <div className={cn(
        'flex flex-col items-center justify-center py-24 text-center rounded-[2.5rem] border-2 border-dashed',
        dark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100/80'
    )}>
        <div className={cn(
            'p-8 rounded-[2rem] mb-6 shadow-inner',
            dark ? 'bg-slate-700/50 text-slate-600' : 'bg-slate-50 text-slate-300'
        )}>
            <Icon size={56} />
        </div>
        <h3 className={cn('text-xl font-black mb-2 tracking-tight', dark ? 'text-white' : 'text-slate-900')}>{title}</h3>
        <p className={cn('max-w-xs text-sm font-semibold leading-relaxed tracking-tight', dark ? 'text-slate-400' : 'text-slate-400')}>{message}</p>
    </div>
);
