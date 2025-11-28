import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import {
    getReasonAnalytics,
    getCohortAnalytics,
    getProfitabilityAnalytics,
    type ReasonData,
    type CohortData,
    type ProfitabilityData
} from '../services/api';
import { ReasonHeatmap } from '../components/analytics/ReasonHeatmap';
import { CohortChart } from '../components/analytics/CohortChart';
import { ProfitabilityCard } from '../components/analytics/ProfitabilityCard';

export default function AnalyticsPage() {
    const { token } = useAuth();
    const [reasonData, setReasonData] = useState<ReasonData[]>([]);
    const [cohortData, setCohortData] = useState<CohortData | null>(null);
    const [profitabilityData, setProfitabilityData] = useState<ProfitabilityData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const [reasons, cohorts, profitability] = await Promise.all([
                    getReasonAnalytics(token),
                    getCohortAnalytics(token),
                    getProfitabilityAnalytics(token)
                ]);

                setReasonData(reasons);
                setCohortData(cohorts);
                setProfitabilityData(profitability);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (isLoading) {
        return <div className="p-8 text-white">Loading analytics...</div>;
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Analytics & Insights</h1>

            <div className="grid-2-col">
                {profitabilityData && <ProfitabilityCard data={profitabilityData} />}
                {cohortData && (
                    <CohortChart
                        newCustomers={cohortData.new_customers}
                        returningCustomers={cohortData.returning_customers}
                    />
                )}
            </div>

            <div className="mb-8">
                <ReasonHeatmap data={reasonData} />
            </div>
        </div>
    );
}
