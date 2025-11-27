import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#ffffff', '#818cf8']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#ffffff', '#818cf8']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                >
                    <Check className="w-12 h-12 text-white stroke-[3]" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Return Submitted!</h1>
                    <p className="text-white/60 mb-8 text-lg">
                        We've sent a confirmation email with your shipping label and instructions.
                    </p>

                    <GlassCard className="mb-8 text-left">
                        <h3 className="font-bold text-white mb-2">What happens next?</h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">1</div>
                                <span>Print your shipping label</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">2</div>
                                <span>Pack the items securely</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">3</div>
                                <span>Drop off at any shipping partner</span>
                            </li>
                        </ul>
                    </GlassCard>

                    <NeonButton onClick={() => navigate('/')} className="w-full">
                        <Home className="w-4 h-4 mr-2" /> Back to Home
                    </NeonButton>
                </motion.div>
            </div>
        </div>
    );
}
