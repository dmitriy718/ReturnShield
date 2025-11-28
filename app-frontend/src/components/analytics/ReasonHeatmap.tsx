import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import './Analytics.css';

interface ReasonData {
    sku: string;
    reasons: Record<string, number>;
    total_returns: number;
}

interface ReasonHeatmapProps {
    data: ReasonData[];
}

export const ReasonHeatmap: React.FC<ReasonHeatmapProps> = ({ data }) => {
    return (
        <GlassCard className="p-6">
            <h3 className="analytics-title">Return Reasons by SKU</h3>
            <div className="analytics-table-container">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Top Reason</th>
                            <th className="text-right">Total Returns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => {
                            const topReason = Object.entries(item.reasons).sort((a, b) => b[1] - a[1])[0];
                            return (
                                <tr key={item.sku}>
                                    <td className="font-medium">{item.sku}</td>
                                    <td>
                                        {topReason ? (
                                            <span className="reason-badge">
                                                {topReason[0]} ({topReason[1]})
                                            </span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="text-right">{item.total_returns}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
};
