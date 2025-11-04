import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // visible dans la console du navigateur
    console.error("ErrorBoundary:", error, info);
  }
  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="p-6 m-6 border rounded-2xl bg-red-50 text-red-800">
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="mb-2">{String(error?.message || error)}</p>
          <button
            onClick={() => (window.location.hash = "#/")}
            className="mt-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          >
            Retour à l’accueil
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
