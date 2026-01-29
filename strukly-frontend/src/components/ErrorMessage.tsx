const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <p className="text-status-error text-sm font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
    {children}
  </p>
);

export default ErrorMessage;