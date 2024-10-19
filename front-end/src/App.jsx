import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <div>
<Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path= "/dashboard" element ={<Dashboard/>} />
      </Routes>
    </Router>
</div>
  )
}

export default App;
