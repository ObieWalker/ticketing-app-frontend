import React from 'react'
import Layout from '../layout/layout';

const FallbackUI = () => {
  return (
    <Layout>
      <h1>An unexpected error occured</h1>
      <p>Kindly refresh your browser. If error persists please try again later.</p>
    </Layout> 
  )
}

export default class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <FallbackUI />
      }
  
      return this.props.children;
    }
  }

