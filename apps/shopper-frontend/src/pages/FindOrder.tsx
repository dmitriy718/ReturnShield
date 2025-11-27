import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { lookupOrder } from '../services/api';

export default function FindOrder() {
    const navigate = useNavigate();
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const order = await lookupOrder(orderNumber, email);
            navigate('/select-items', { state: { order } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to find order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                        ReturnShield
                    </h1>
                    <p className="text-white/60">Enter your details to find your order</p>
                </motion.div>

                <GlassCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-200 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="order" className="text-sm font-medium text-white/80 ml-1">
                                Order Number
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="order"
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="#1001"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-white/80 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@example.com"
                                className="input-field"
                                required
                            />
                        </div>

                        <NeonButton
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Find Order <ArrowRight className="w-4 h-4" />
                        </NeonButton>
                    </form>
                </GlassCard>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-white/30 text-sm mt-8"
                >
                    Powered by ReturnShield AI
                </motion.p>
            </div>
        </div>
    );
}
