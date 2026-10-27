import React from 'react';
import { LoadingView } from './LoadingView';
import { ErrorState } from './ErrorState';

interface Props {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export function QueryState({
  isLoading,
  isError,
  onRetry,
  loadingMessage,
  errorMessage = 'Something went wrong. Please try again.',
  children,
}: Props) {
  if (isLoading) return <LoadingView message={loadingMessage} />;
  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />;
  return <>{children}</>;
}
