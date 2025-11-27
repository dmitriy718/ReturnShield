import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import type { Order } from '../services/api';

const REASONS = [
    "Size too small",
    "Size too big",
    "Item defective",
    "Arrived too late",
    "Changed my mind",
    "Other"
];

export default function ReturnReason() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const order = location.state?.order as Order | undefined;
    const selectedItems = location.state?.selectedItems as Set<string> | undefined;

    useEffect(() => {
        if (!order || !selectedItems) {
            navigate('/');
        }
    }, [order, selectedItems, navigate]);

    if (!order || !selectedItems) return null;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto flex flex-col">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/select-items', { state: { order } })}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Items</span>
                </button>
                <div className="text-right">
                    <p className="text-sm text-white/40">Step 2 of 3</p>
                    <p className="font-medium">Reason for Return</p>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl font-bold mb-2">Why are you returning?</h1>
                        <p className="text-white/60">Help us understand so we can make it right.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {REASONS.map((reason, index) => (
                            <motion.button
                                key={reason}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedReason(reason)}
                                className={`
                  p-6 rounded-xl border text-left transition-all duration-300
                  ${selectedReason === reason
                                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                        : 'border-white/10 bg-surface/30 hover:border-white/20 hover:bg-surface/50'}
                `}
                            >
                                <span className={`text-lg font-medium ${selectedReason === reason ? 'text-white' : 'text-white/80'}`}>
                                    {reason}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    <GlassCard className="sticky bottom-4 border-t border-white/10 bg-surface/80 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/60">Selected Reason</p>
                                <p className="text-xl font-bold">{selectedReason || 'None selected'}</p>
                            </div>
                            <NeonButton
                                disabled={!selectedReason}
                                onClick={() => navigate('/exchange-option', { state: { order, selectedItems, reason: selectedReason } })}
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </NeonButton>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
