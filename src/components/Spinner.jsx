export default function Spinner({ size = 16 }) {
  const s = `${size}px`;
  return (
    <span
      aria-hidden="true"
      className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 align-[-0.125em]"
      style={{ width: s, height: s }}
    />
  );
}
