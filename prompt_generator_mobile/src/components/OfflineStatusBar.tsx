import React from 'react';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

// Component to display offline status and sync information
const OfflineStatusBar: React.FC = () => {
  const { isOnline, pendingSync } = useOfflineSupport();

  if (isOnline && !pendingSync) {
    return null; // Don't show anything when online and no pending sync
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-2 text-center text-sm font-medium ${
      isOnline ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-red-900 bg-opacity-30 text-red-300'
    }`}>
      {!isOnline ? (
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.07m-3.536 3.536a1 1 0 010-1.414" />
          </svg>
          <span>You're offline. Changes will be saved locally.</span>
        </div>
      ) : pendingSync ? (
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Syncing changes...</span>
        </div>
      ) : null}
    </div>
  );
};

export default OfflineStatusBar;
