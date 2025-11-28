import { useEffect, useState } from 'react'
import { getAutomationRules, getFraudSettings, type AutomationRule, type FraudSettings as FraudSettingsType } from '../services/api'
import { useAuth } from '../providers/AuthProvider'
import { AutomationRules } from '../components/automation/AutomationRules'
import { FraudSettings } from '../components/automation/FraudSettings'
import './AutomationPage.css'

export function AutomationPage() {
  const { token } = useAuth()
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [fraudSettings, setFraudSettings] = useState<FraudSettingsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [rulesData, fraudData] = await Promise.all([
          getAutomationRules(token),
          getFraudSettings(token)
        ]);
        setRules(rulesData);
        setFraudSettings(fraudData);
      } catch (error) {
        console.error('Failed to fetch automation data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading automation settings...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Merchant Operations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AutomationRules rules={rules} onUpdate={() => {
            // Re-fetch data
            const fetchData = async () => {
              if (!token) return;
              const [rulesData] = await Promise.all([getAutomationRules(token)]);
              setRules(rulesData);
            };
            fetchData();
          }} />
        </div>
        <div>
          {fraudSettings && (
            <FraudSettings settings={fraudSettings} onUpdate={() => {
              // Re-fetch data
              const fetchData = async () => {
                if (!token) return;
                const [fraudData] = await Promise.all([getFraudSettings(token)]);
                setFraudSettings(fraudData);
              };
              fetchData();
            }} />
          )}
        </div>
      </div>
    </div>
  )
}

