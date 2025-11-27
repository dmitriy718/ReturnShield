import { motion } from 'framer-motion';
import { Check, RefreshCw, X } from 'lucide-react';
import { clsx } from 'clsx';

interface OrderItemProps {
    id: string;
    name: string;
    price: number;
    image: string;
    isSelected: boolean;
    onToggle: () => void;
}

export function OrderItemCard({ id, name, price, image, isSelected, onToggle }: OrderItemProps) {
    return (
        <motion.div
            layout
            onClick={onToggle}
            className={clsx(
                "relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300",
                isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                    : "border-white/10 bg-surface/30 hover:border-white/20 hover:bg-surface/50"
            )}
        >
            <div className="aspect-square relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={clsx(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    isSelected ? "bg-primary/40 opacity-100" : "opacity-0"
                )}>
                    <div className="bg-white text-primary rounded-full p-2 shadow-lg">
                        <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-medium text-white truncate">{name}</h3>
                <p className="text-white/60 text-sm">${price.toFixed(2)}</p>
            </div>
        </motion.div>
    );
}
