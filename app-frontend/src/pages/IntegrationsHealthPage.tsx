import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { getIntegrationsHealth } from '../services/api';
import type { IntegrationHealth } from '../types';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import './IntegrationsHealthPage.css';

export function IntegrationsHealthPage() {
  const { token } = useAuth();
  const [healthChecks, setHealthChecks] = useState<IntegrationHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getIntegrationsHealth(token)
        .then(setHealthChecks)
        .catch((error) => {
          console.error('Failed to fetch integrations health:', error);
          setError('Failed to load integration health status.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  if (isLoading) {
    return <LoadingScreen message="Checking integrations health..." />;
  }

  if (error) {
    return <div className="health-error">{error}</div>;
  }

  return (
    <div className="integrations-health-page">
      <h1>Integrations Health</h1>
      <div className="health-checks-grid">
        {healthChecks.length === 0 ? (
          <p>No active integrations found.</p>
        ) : (
          healthChecks.map((check) => (
            <div key={check.domain} className={`health-card health-card--${check.status}`}>
              <div className="health-card-header">
                <h2>{check.platform}</h2>
                <span className={`health-status-badge health-status-badge--${check.status}`}>
                  {check.status}
                </span>
              </div>
              <div className="health-card-body">
                <p><strong>Domain:</strong> {check.domain}</p>
                <p><strong>Message:</strong> {check.message}</p>
                <p><strong>Last Checked:</strong> {new Date(check.last_checked_at).toLocaleString()}</p>
              </div>
              {check.status === 'error' && (
                <div className="health-card-footer">
                  <button onClick={() => alert('Re-authentication flow not implemented yet.')}>
                    Re-authenticate
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
