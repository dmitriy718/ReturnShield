import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, DollarSign } from 'lucide-react';
import './Analytics.css';

interface ProfitabilityData {
    revenue_retained: number;
    revenue_refunded: number;
    exchange_count: number;
    refund_count: number;
    retained_percentage: number;
}

interface ProfitabilityCardProps {
    data: ProfitabilityData;
}

export const ProfitabilityCard: React.FC<ProfitabilityCardProps> = ({ data }) => {
    return (
        <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-32 h-32 text-green-500" />
            </div>

            <h3 className="analytics-title relative z-10">Profitability Impact</h3>

            <div className="profitability-grid relative z-10">
                <div>
                    <div className="profit-metric-label">Revenue Retained (Exchanges)</div>
                    <div className="profit-metric-value green">
                        <DollarSign className="w-6 h-6" />
                        {data.revenue_retained.toLocaleString()}
                    </div>
                    <div className="profit-metric-sub">
                        {data.exchange_count} exchanges completed
                    </div>
                </div>

                <div>
                    <div className="profit-metric-label">Revenue Refunded</div>
                    <div className="profit-metric-value red">
                        <DollarSign className="w-6 h-6" />
                        {data.revenue_refunded.toLocaleString()}
                    </div>
                    <div className="profit-metric-sub">
                        {data.refund_count} refunds processed
                    </div>
                </div>
            </div>

            <div className="retention-bar-container relative z-10">
                <div className="retention-header">
                    <span className="text-gray-600">Retention Rate</span>
                    <span className="font-bold text-gray-900">{data.retained_percentage}%</span>
                </div>
                <div className="retention-track">
                    <div
                        className="retention-fill"
                        style={{ width: `${data.retained_percentage}%` }}
                    />
                </div>
            </div>
        </GlassCard>
    );
};
