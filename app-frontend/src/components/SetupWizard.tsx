import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Store, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { GlassCard } from './ui/GlassCard';
import { apiFetch } from '../services/api';

type Step = 'welcome' | 'platform' | 'connect' | 'sync' | 'complete';

export function SetupWizard() {
    const { user, refreshUser, updateOnboarding } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('welcome');
    const [platform, setPlatform] = useState<string>('shopify');
    const [domain, setDomain] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = async () => {
        setIsLoading(true);
        try {
            // In a real OAuth flow, we'd redirect here. 
            // For this wizard, we'll update the user profile with the store domain.
            await apiFetch('/accounts/store/', {
                method: 'PATCH',
                body: JSON.stringify({
                    store_platform: platform,
                    store_domain: domain
                })
            });
            await updateOnboarding('sync');
            setStep('sync');
            // Simulate sync delay
            setTimeout(async () => {
                await updateOnboarding('insights');
                setStep('complete');
            }, 3000);
        } catch (error) {
            console.error("Failed to connect store", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        await updateOnboarding('complete');
        await refreshUser();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <GlassCard className="w-full max-w-2xl p-0 overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'welcome' ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'}`}>
                                {step === 'welcome' ? '1' : <Check size={16} />}
                            </div>
                            <div className={`h-1 w-12 rounded-full ${step === 'welcome' ? 'bg-muted' : 'bg-green-500'}`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'platform' || step === 'connect' ? 'bg-primary text-primary-foreground' : (step === 'sync' || step === 'complete' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground')}`}>
                                {(step === 'sync' || step === 'complete') ? <Check size={16} /> : '2'}
                            </div>
                            <div className={`h-1 w-12 rounded-full ${['sync', 'complete'].includes(step) ? 'bg-green-500' : 'bg-muted'}`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'complete' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                {step === 'complete' ? <Check size={16} /> : '3'}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                            Setup Wizard
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'welcome' && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col justify-center"
                            >
                                <h1 className="text-3xl font-bold mb-4">Welcome to ReturnShield!</h1>
                                <p className="text-muted-foreground text-lg mb-8">
                                    Let's get your store connected so we can start protecting your revenue.
                                    We'll sync your orders and set up your first return rule.
                                </p>
                                <button 
                                    onClick={() => setStep('platform')}
                                    className="self-start flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-lg"
                                >
                                    Get Started <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === 'platform' && (
                            <motion.div
                                key="platform"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-6">Select your platform</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {['shopify', 'bigcommerce', 'woocommerce'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPlatform(p)}
                                            className={`p-6 rounded-xl border-2 text-left transition-all ${platform === p ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                                        >
                                            <Store className={`w-8 h-8 mb-4 ${platform === p ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div className="font-bold capitalize">{p}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-auto">
                                    <button 
                                        onClick={() => setStep('connect')}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
                                    >
                                        Next Step <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'connect' && (
                            <motion.div
                                key="connect"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-2">Connect {platform}</h2>
                                <p className="text-muted-foreground mb-8">Enter your store URL to initiate the connection.</p>
                                
                                <div className="max-w-md space-y-4 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Store Domain</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 text-muted-foreground" size={20} />
                                            <input 
                                                type="text" 
                                                className="w-full pl-10 p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                                placeholder={platform === 'shopify' ? 'your-store.myshopify.com' : 'https://yourstore.com'}
                                                value={domain}
                                                onChange={(e) => setDomain(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-auto">
                                    <button 
                                        onClick={() => setStep('platform')}
                                        className="text-muted-foreground hover:text-foreground font-medium"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleConnect}
                                        disabled={!domain || isLoading}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : 'Connect Store'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'sync' && (
                            <motion.div
                                key="sync"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Syncing your orders...</h2>
                                <p className="text-muted-foreground max-w-md">
                                    We're importing your order history to build your analytics dashboard. This usually takes less than a minute.
                                </p>
                            </motion.div>
                        )}

                        {step === 'complete' && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                                <p className="text-muted-foreground max-w-md mb-8">
                                    Your store is connected and ReturnShield is active. Let's take you to your dashboard.
                                </p>
                                <button 
                                    onClick={handleComplete}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-lg shadow-lg shadow-primary/25"
                                >
                                    Go to Dashboard <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </div>
    );
}
