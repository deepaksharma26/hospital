// App.js
import React, { Suspense, useEffect } from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import routesConfig from './routes/index.js';
import PageLoader from './components/PageLoader.jsx';

function AppRoutes() {
  return useRoutes(routesConfig);
}

function App() {
  useEffect(() => {
    document.title = "Thakur Eye Hospital - Billing System";
  }, []);
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </HashRouter>
  );
}

export default App;