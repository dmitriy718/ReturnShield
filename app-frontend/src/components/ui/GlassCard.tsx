import React from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`glass-card ${className}`}
        >
            <div className="glass-card-gradient" />
            <div className="glass-card-content">{children}</div>
        </motion.div>
    );
}
