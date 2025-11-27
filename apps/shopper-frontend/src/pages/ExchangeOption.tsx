import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RefreshCw, DollarSign, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { submitReturn } from '../services/api';
import type { Order } from '../services/api';

export default function ExchangeOption() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState<'exchange' | 'refund' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const order = location.state?.order as Order | undefined;
    const selectedItems = location.state?.selectedItems as Set<string> | undefined;
    const reason = location.state?.reason as string | undefined;

    useEffect(() => {
        if (!order || !selectedItems || !reason) {
            navigate('/');
        }
    }, [order, selectedItems, reason, navigate]);

    if (!order || !selectedItems || !reason) return null;

    // Calculate refund amount (mock logic: sum of selected items)
    const refundAmount = order.items
        .filter(item => selectedItems.has(item.line_item_id))
        .reduce((sum, item) => sum + parseFloat(item.price), 0);

    const bonusAmount = refundAmount * 1.10; // 10% bonus

    const handleSubmit = async () => {
        if (!selectedOption) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await submitReturn(
                order.id,
                Array.from(selectedItems),
                reason,
                selectedOption
            );
            navigate('/success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit return');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto flex flex-col">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/return-reason', { state: { order, selectedItems } })}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Reason</span>
                </button>
                <div className="text-right">
                    <p className="text-sm text-white/40">Step 3 of 3</p>
                    <p className="font-medium">Resolution</p>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="text-3xl font-bold mb-2">How would you like to resolve this?</h1>
                        <p className="text-white/60">Choose the option that works best for you.</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-200 text-sm justify-center"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Option 1: Exchange / Store Credit (The Hero) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setSelectedOption('exchange')}
                            className={`
                relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group
                ${selectedOption === 'exchange'
                                    ? 'border-primary bg-primary/10 shadow-[0_0_40px_rgba(99,102,241,0.3)]'
                                    : 'border-white/10 bg-surface/30 hover:border-primary/50 hover:bg-surface/50'}
              `}
                        >
                            {/* "Recommended" Badge */}
                            <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                RECOMMENDED
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-full ${selectedOption === 'exchange' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                                    <RefreshCw className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Store Credit</h3>
                                    <p className="text-primary font-medium">+10% Bonus Value</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-4xl font-bold text-white mb-1">${bonusAmount.toFixed(2)}</p>
                                <p className="text-white/60 text-sm">Available immediately</p>
                            </div>

                            <ul className="space-y-3 text-sm text-white/80">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" /> No return shipping fees
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" /> Instant delivery via email
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" /> Never expires
                                </li>
                            </ul>
                        </motion.div>

                        {/* Option 2: Refund (The Boring Option) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setSelectedOption('refund')}
                            className={`
                p-8 rounded-2xl border cursor-pointer transition-all duration-300
                ${selectedOption === 'refund'
                                    ? 'border-white bg-white/10'
                                    : 'border-white/5 bg-surface/10 hover:border-white/20 hover:bg-surface/30'}
              `}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-full ${selectedOption === 'refund' ? 'bg-white text-black' : 'bg-white/5 text-white/40'}`}>
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white/80">Refund</h3>
                                    <p className="text-white/40">Original Payment Method</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-4xl font-bold text-white/60 mb-1">${refundAmount.toFixed(2)}</p>
                                <p className="text-white/40 text-sm">5-10 business days</p>
                            </div>

                            <ul className="space-y-3 text-sm text-white/40">
                                <li className="flex items-center gap-2">
                                    <span className="w-4 h-4 block" /> May deduct shipping
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-4 h-4 block" /> Wait for bank processing
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    <GlassCard className="sticky bottom-4 border-t border-white/10 bg-surface/80 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/60">Selected Option</p>
                                <p className="text-xl font-bold">
                                    {selectedOption === 'exchange' ? 'Store Credit' : selectedOption === 'refund' ? 'Refund' : 'None selected'}
                                </p>
                            </div>
                            <NeonButton
                                disabled={!selectedOption || isSubmitting}
                                isLoading={isSubmitting}
                                onClick={handleSubmit}
                            >
                                Confirm Return <ArrowRight className="w-4 h-4" />
                            </NeonButton>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
