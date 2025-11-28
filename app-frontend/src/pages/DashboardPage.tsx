import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  ReturnlessInsights,
  ExchangeCoachPayload,
  VipQueuePayload,
} from '../types';
import { apiFetch, ApiError } from '../services/api';
import { useAuth } from '../providers/AuthProvider';

import { LoadingScreen } from '../components/ui/LoadingScreen';
import { SetupWizard } from '../components/SetupWizard';
import './DashboardPage.css';

type DashboardState = {
  insights: ReturnlessInsights | null;
  coach: ExchangeCoachPayload | null;
  vip: VipQueuePayload | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: DashboardState = {
  insights: null,
  coach: null,
  vip: null,
  loading: true,
  error: null,
};



type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  status: 'done' | 'todo' | 'progress';
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const tipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = tipTimeoutRef.current;
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!user) {
      return;
    }

    const isTrialPlan = user.subscription_status === 'trial';
    const requiresSubscriptionForData = user.has_shopify_store && isTrialPlan;

    if (requiresSubscriptionForData) {
      setState({
        insights: null,
        coach: null,
        vip: null,
        loading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [insights, coach, vip] = await Promise.all([
        apiFetch<ReturnlessInsights>('/returns/returnless-insights/'),
        apiFetch<ExchangeCoachPayload>('/returns/exchange-coach/'),
        apiFetch<VipQueuePayload>('/returns/vip-resolution/'),
      ]);

      setState({
        insights,
        coach,
        vip,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.detail ?? error.message : 'Unable to load dashboard data.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    void loadDashboard();
  }, [user, loadDashboard]);

  const hasShopifyStore = user?.has_shopify_store ?? false;
  const isTrial = user?.subscription_status === 'trial';
  const isPaid = !!user && user.subscription_status !== 'trial';
  const walkthroughComplete = user?.has_completed_walkthrough ?? false;
  const isSampleData = !hasShopifyStore && isTrial;
  const sampleBannerVisible = isSampleData && !isWalkthroughActive;
  const showLoadingScreen = authLoading && !user;

  const handlePlanSelection = useCallback(() => {
    navigate('/billing');
  }, [navigate]);

  const checklistItems = useMemo<ChecklistItem[]>(() => {
    return [
      {
        id: 'shopify',
        label: hasShopifyStore ? 'Shopify storefront verified' : 'Confirm your Shopify storefront',
        detail: hasShopifyStore
          ? 'We sync your return events nightly so insights stay fresh.'
          : 'Tell us which Shopify domain to connect so we can prepare live data.',
        status: hasShopifyStore ? 'done' : 'todo',
        action: hasShopifyStore
          ? undefined
          : {
            label: 'Email onboarding',
            href: 'mailto:concierge@returnshield.app?subject=Connect%20Shopify%20store',
          },
      },
      {
        id: 'walkthrough',
        label: walkthroughComplete ? 'Guided tour completed' : 'Complete the guided dashboard tour',
        detail: walkthroughComplete
          ? 'Revisit sections any time using the checklist below.'
          : 'We reveal each dashboard module step-by-step before unlocking data.',
        status: walkthroughComplete ? 'done' : 'progress',
        action:
          !walkthroughComplete && isTrial
            ? {
              label: 'Resume guided tour',
              onClick: () => setIsWalkthroughActive(true),
            }
            : undefined,
      },
      {
        id: 'plan',
        label: isPaid ? `Plan active: ${user?.subscription_status.toUpperCase()}` : 'Choose a plan to unblur live data',
        detail: isPaid
          ? 'Manage billing or upgrade anytime inside the Billing tab.'
          : 'Live returns stay blurred until you pick Launch, Scale, or Elite.',
        status: isPaid ? 'done' : 'todo',
        action: isPaid
          ? {
            label: 'Manage billing',
            onClick: handlePlanSelection,
          }
          : {
            label: 'Choose plan',
            onClick: handlePlanSelection,
          },
      },
    ];
  }, [hasShopifyStore, walkthroughComplete, isTrial, isPaid, handlePlanSelection, user?.subscription_status]);



  if (showLoadingScreen) {
    return <LoadingScreen message="Preparing your dashboard..." />;
  }

  return (
    <div className="dashboard">
      <SetupWizard />
      {state.error && (
        <div className="dashboard-error">
          <p>{state.error}</p>
          <button type="button" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      )}
      {sampleBannerVisible ? (
        <div className="sample-banner">
          <strong>Preview mode.</strong> You’re exploring ReturnShield’s guided sample workspace. Connect Shopify and
          activate billing to replace this with your live data.
        </div>
      ) : null}

      <div className="dashboard-grid">
        <article className="panel checklist-panel">
          <header>
            <h2>Quick start checklist</h2>
          </header>
          <p className="panel-subtitle">
            Work through these steps to replace the guided preview with live automations from your brand.
          </p>
          <ul className="checklist">
            {checklistItems.map((item) => (
              <li key={item.id} className={`checklist-item checklist-item--${item.status}`}>
                <div className="checklist-copy">
                  <span className="checklist-label">{item.label}</span>
                  <p>{item.detail}</p>
                </div>
                <div className="checklist-meta">
                  <span className="checklist-status">{item.status === 'done' ? 'Done' : item.status === 'progress' ? 'In progress' : 'To do'}</span>
                  {item.action ? (
                    item.action.href ? (
                      <a className="checklist-action" href={item.action.href}>
                        {item.action.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="checklist-action"
                        onClick={item.action.onClick}
                      >
                        {item.action.label}
                      </button>
                    )
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}


