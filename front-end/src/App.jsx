import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import SignUpOrg from './components/SignUpOrg';
import LoginOrg from './components/LoginOrg';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
function App() {
  
  return (
    <div>
<Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path = '/loginorg' element={<LoginOrg/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path= "/dashboard" element={<Dashboard />}/>
        <Route path ="/signuporg" element={<SignUpOrg/>}/>
        <Route path ='/admin/dashboard' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
      </Routes>
    </Router>
</div>
  )
}

export default App;
