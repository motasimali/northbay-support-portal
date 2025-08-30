import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { if (import.meta.env.DEV) console.error(err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="m-6 rounded-xl border bg-red-50 p-4 text-red-800">
          <h2 className="mb-1 font-semibold">Something went wrong.</h2>
          <p>Please refresh the page or try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
