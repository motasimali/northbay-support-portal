import Spinner from "./Spinner";

export default function LoadingButton({
  loading,
  children,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 ${loading ? "opacity-60" : ""} ${className}`}
    >
      {loading && <Spinner size={14} />}
      <span>{children}</span>
    </button>
  );
}
