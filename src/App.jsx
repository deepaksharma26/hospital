// App.js
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routesConfig from './routes/index.js';
import PageLoader from './components/PageLoader.jsx';

function AppRoutes() {
  return useRoutes(routesConfig);
}

function App() {
  useEffect(() => {
    // Any global setup can be done here, like setting up a theme or global state
    document.title = "Thakur Eye Hospital - Billing System"; // Example: Set the document title
  }, []);
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}> 
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;