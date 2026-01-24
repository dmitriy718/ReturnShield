import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { lookupOrder } from '../services/api';

export default function FindOrder() {
    const navigate = useNavigate();
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isGift, setIsGift] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const order = await lookupOrder(orderNumber, email, zipCode, isGift);
            navigate('/select-items', { state: { order, isGift } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Order not found');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Package className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Returns & Exchanges</h1>
                    <p className="text-muted-foreground">Enter your order details to get started.</p>
                </div>

                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Find your order</CardTitle>
                        <CardDescription>
                            We'll need your order number and email to look up your purchase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLookup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="orderNumber">Order Number</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="orderNumber"
                                        placeholder="#1001"
                                        className="pl-9"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email">{isGift ? 'Zip Code' : 'Email Address'}</Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsGift(!isGift);
                                            setEmail('');
                                            setZipCode('');
                                        }}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        {isGift ? 'I have an email' : 'Received as a gift?'}
                                    </button>
                                </div>
                                {isGift ? (
                                    <Input
                                        id="zipCode"
                                        placeholder="90210"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required
                                    />
                                ) : (
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Find Order'}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Having trouble? <a href="#" className="underline hover:text-primary">Contact support</a>
                </p>
            </motion.div>
        </div>
    );
}