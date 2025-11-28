import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import './Analytics.css';

interface CohortMetrics {
    return_rate: number;
    total_orders: number;
    total_returns: number;
}

interface CohortChartProps {
    newCustomers: CohortMetrics;
    returningCustomers: CohortMetrics;
}

export const CohortChart: React.FC<CohortChartProps> = ({ newCustomers, returningCustomers }) => {
    return (
        <GlassCard className="p-6">
            <h3 className="analytics-title">Return Rate by Cohort</h3>
            <div className="cohort-chart-container">
                {/* New Customers Bar */}
                <div className="cohort-bar-group">
                    <div className="text-sm font-bold mb-1">{newCustomers.return_rate}%</div>
                    <div
                        className="cohort-bar new"
                        style={{ height: `${Math.max(newCustomers.return_rate * 2, 4)}px` }}
                    />
                    <div className="text-xs text-center text-gray-500">
                        New<br />Customers
                    </div>
                </div>

                {/* Returning Customers Bar */}
                <div className="cohort-bar-group">
                    <div className="text-sm font-bold mb-1">{returningCustomers.return_rate}%</div>
                    <div
                        className="cohort-bar returning"
                        style={{ height: `${Math.max(returningCustomers.return_rate * 2, 4)}px` }}
                    />
                    <div className="text-xs text-center text-gray-500">
                        Returning<br />Customers
                    </div>
                </div>
            </div>
            <div className="cohort-stats">
                <div className="stat-box">
                    <div className="stat-label">New Customer Orders</div>
                    <div className="stat-value">{newCustomers.total_orders}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Returning Customer Orders</div>
                    <div className="stat-value">{returningCustomers.total_orders}</div>
                </div>
            </div>
        </GlassCard>
    );
};
