import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import type { OnboardingStage } from '../types';
import './SetupWizard.css';

interface WizardStep {
  key: OnboardingStage;
  title: string;
  description: string;
  component: ReactNode;
  ctaLabel?: string;
  helper?: string;
  isCompletable?: (user: any) => boolean; // Function to check if the step can be marked as complete
}

interface SetupWizardProps {}

export const SetupWizard: React.FC<SetupWizardProps> = () => {
  const navigate = useNavigate();
  const { user, updateOnboarding, refreshUser, completeWalkthrough } = useAuth();
  const isAuthenticated = !!user;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const wizardSteps: WizardStep[] = [
    {
      key: 'connect',
      title: 'Connect Your Shopify Store',
      description: 'To get started, connect your Shopify store to ReturnShield. This will allow us to start analyzing your returns data.',
      component: (
        <div className="wizard-step-content">
          <p>Click the button below to go to the Shopify App Store and install the ReturnShield app. You will be redirected back here after the installation is complete.</p>
          <button className="wizard-button primary" onClick={() => window.open('https://apps.shopify.com/returnshield', '_blank')}>
            Connect Shopify Store
          </button>
          <p className="wizard-note">Note: You may need to log in to your Shopify account.</p>
        </div>
      ),
      ctaLabel: 'I have connected my store',
      isCompletable: (user) => user?.has_shopify_store,
    },
    {
      key: 'sync',
      title: 'Sync Your Return Data',
      description: 'We are now syncing your historical return data. This process may take a few minutes depending on the size of your store.',
      component: (
        <div className="wizard-step-content">
          <p>This initial sync is crucial for providing you with accurate insights and recommendations.</p>
          <div className="sync-progress">
            <div className={`sync-progress-bar ${isSyncing ? 'animating' : ''}`}></div>
            <span>{isSyncing ? 'Syncing...' : 'Sync complete!'}</span>
          </div>
        </div>
      ),
      ctaLabel: 'Go to Dashboard',
    },
    {
      key: 'insights',
      title: 'Explore Your Insights',
      description: 'Your dashboard is now populated with initial insights based on your historical data. Take a moment to explore.',
      component: (
        <div className="wizard-step-content">
          <p>Here are a few things to check out:</p>
          <ul>
            <li><strong>ROI Snapshot:</strong> See your potential margin recovery.</li>
            <li><strong>Returnless Intelligence:</strong> Identify high-risk products.</li>
            <li><strong>AI Exchange Coach:</strong> Get recommendations for converting refunds into exchanges.</li>
          </ul>
        </div>
      ),
      ctaLabel: 'Continue',
    },
    {
      key: 'complete',
      title: 'Onboarding Complete!',
      description: 'Congratulations! You have successfully set up ReturnShield.',
      component: (
        <div className="wizard-step-content">
          <p>You can now start using ReturnShield to manage and optimize your returns process. If you have any questions, please don't hesitate to contact our support team.</p>
          <button className="wizard-button" onClick={() => navigate('/dashboard')}>
            Go to My Dashboard
          </button>
        </div>
      ),
      ctaLabel: 'Finish',
    },
  ];

  const currentStep = wizardSteps[currentStepIndex];

  const shouldShowWizard = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return !user.has_completed_walkthrough;
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user && shouldShowWizard) {
      const stageIndex = wizardSteps.findIndex(step => step.key === user.onboarding_stage);
      if (stageIndex !== -1 && stageIndex !== currentStepIndex) {
        setCurrentStepIndex(stageIndex);
      }
    }
  }, [user, shouldShowWizard, wizardSteps, currentStepIndex]);
  
  useEffect(() => {
    if (currentStep.key === 'sync' && shouldShowWizard) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setIsSyncing(false);
      }, 5000); // Simulate a 5 second sync
      return () => clearTimeout(timer);
    }
  }, [currentStep, shouldShowWizard]);

  const handleAdvance = useCallback(async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const isStepCompletable = currentStep.isCompletable ? currentStep.isCompletable(user) : true;
      if (!isStepCompletable) {
        alert("Please complete the current step's action before proceeding.");
        setProcessing(false);
        return;
      }
      
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < wizardSteps.length) {
        const nextStageKey = wizardSteps[nextStepIndex].key;
        await updateOnboarding(nextStageKey);
        await refreshUser();
        setCurrentStepIndex(nextStepIndex);
      } else {
        await completeWalkthrough(true);
        await updateOnboarding('complete');
        await refreshUser();
      }
    } catch (error) {
      console.error('Failed to advance wizard:', error);
    } finally {
      setProcessing(false);
    }
  }, [currentStepIndex, wizardSteps, updateOnboarding, refreshUser, completeWalkthrough, processing, currentStep, user]);
  
  if (!shouldShowWizard || !currentStep) {
    return null;
  }

  const progress = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  return (
    <div className="setup-wizard-overlay" role="dialog" aria-modal="true">
      <div className="setup-wizard-card">
        <header>
          <div className="wizard-progress">
            <div className="wizard-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </header>
        <div className="wizard-body">
          <h2>{currentStep.title}</h2>
          <p>{currentStep.description}</p>
          {currentStep.component}
          {currentStep.helper && <p className="wizard-helper">{currentStep.helper}</p>}
        </div>
        <footer>
          <button type="button" className="wizard-button primary" onClick={handleAdvance} disabled={processing}>
            {processing ? 'Processing…' : currentStep.ctaLabel ?? 'Next'}
          </button>
        </footer>
      </div>
    </div>
  );
};