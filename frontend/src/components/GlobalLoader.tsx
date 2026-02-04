import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoading } from './LoadingContext';

const GlobalLoader: React.FC = () => {
  const { loading } = useLoading();

  if (!loading.isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4 transition-all duration-300 ease-in-out transform scale-100">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
        {loading.message && (
          <p className="text-sm font-medium text-center">{loading.message}</p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoader;
