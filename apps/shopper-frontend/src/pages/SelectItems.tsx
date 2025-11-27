import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { OrderItemCard } from '../components/ui/OrderItemCard';
import type { Order } from '../services/api';

export default function SelectItems() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const order = location.state?.order as Order | undefined;

    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) return null;

    const toggleItem = (id: string) => {
        const next = new Set(selectedItems);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedItems(next);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Order</span>
                </button>
                <div className="text-right">
                    <p className="text-sm text-white/40">Order #{order.order_number}</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">What are you returning?</h1>
                <p className="text-white/60">Select the items you'd like to return or exchange.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {order.items.map((item) => (
                    <OrderItemCard
                        key={item.line_item_id}
                        id={item.line_item_id}
                        name={item.title}
                        price={parseFloat(item.price)}
                        image="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=400" // Fallback image for now
                        isSelected={selectedItems.has(item.line_item_id)}
                        onToggle={() => toggleItem(item.line_item_id)}
                    />
                ))}
            </div>

            <GlassCard className="sticky bottom-4 border-t border-white/10 bg-surface/80 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/60">Selected Items</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold">{selectedItems.size} items</p>
                            {selectedItems.size > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm text-primary"
                                >
                                    Est. Refund: ${order.items
                                        .filter(item => selectedItems.has(item.line_item_id))
                                        .reduce((sum, item) => sum + parseFloat(item.price), 0)
                                        .toFixed(2)}
                                </motion.p>
                            )}
                        </div>
                    </div>
                    <NeonButton
                        disabled={selectedItems.size === 0}
                        onClick={() => navigate('/return-reason', { state: { order, selectedItems } })}
                    >
                        Continue <ArrowRight className="w-4 h-4" />
                    </NeonButton>
                </div>
            </GlassCard>
        </div>
    );
}
