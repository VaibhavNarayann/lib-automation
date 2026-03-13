export function useToast() {
  return {
    toasts: [] as {
      id: string;
      title?: React.ReactNode;
      description?: React.ReactNode;
      action?: React.ReactElement;
      [key: string]: unknown;
    }[],
  };
}

export function toast(_props: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  [key: string]: unknown;
}) {
  // Temporary no-op toast implementation so the app can render safely.
}
