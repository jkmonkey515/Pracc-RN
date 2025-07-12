import * as Sentry from "sentry-expo";
import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    Sentry.Native.captureException(error);
    if (process.env.__DEV__) {
      console.error(error, info);
    }
  }

  render() {
    if (this.state.hasError && this.props.errorContent) {
      return this.props.errorContent;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
