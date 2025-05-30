import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductManagementPage from './pages/ProductManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
