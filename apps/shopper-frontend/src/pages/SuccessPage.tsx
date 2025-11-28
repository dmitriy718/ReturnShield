import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Check, ArrowRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();

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

                    import {QRCodeSVG} from 'qrcode.react';

                    // ... (imports)

                    // ... (inside component)
                    <GlassCard className="mb-8 text-left">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-2">Printerless Return</h3>
                                <p className="text-sm text-white/80 mb-4">
                                    Show this QR code at a drop-off location to print your label instantly.
                                </p>
                                <ul className="space-y-3 text-sm text-white/80">
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">1</div>
                                        <span>Show QR code to clerk</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">2</div>
                                        <span>They print the label</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">3</div>
                                        <span>Hand over package</span>
                                    </li>
                                </ul>
                            </div>
                            {location.state?.labelUrl && (
                                <div className="bg-white p-4 rounded-xl">

                                    <QRCodeSVG value={location.state.labelUrl} size={128} />
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <div className="flex flex-col gap-3">
                        {location.state?.labelUrl && (
                            <NeonButton
                                onClick={() => window.open(location.state.labelUrl, '_blank')}
                                className="w-full"
                            >
                                Download Shipping Label <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white/60 hover:text-white flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" /> Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
