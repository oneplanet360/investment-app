import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';


import ErrorFallback from '../components/common/error-fallback';
import LoadingSpinner from '../components/common/loading-spinner';
import AuthProvider from '../context/auth.provder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HelmetProvider>
              {children}
              <Toaster richColors />
            </HelmetProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}