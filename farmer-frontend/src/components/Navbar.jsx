import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/farmer-dashboard'} 
                  className="text-xl font-bold">
              NaapTol - Farmer's Help
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              {user.role === 'farmer' ? (
                <>
                  <Link to="/farmer-dashboard" className="hover:text-primary-200">Dashboard</Link>
                  <Link to="/naaptol" className="hover:text-primary-200">NaapTol</Link>
                  <Link to="/analytics" className="hover:text-primary-200">Analytics</Link>
                  <Link to="/dealers" className="hover:text-primary-200">Dealers</Link>
                  <Link to="/tips" className="hover:text-primary-200">Tips</Link>
                  <Link to="/weather" className="hover:text-primary-200">Weather</Link>
                  <Link to="/chat" className="hover:text-primary-200">Chat</Link>
                </>
              ) : (
                <>
                  <Link to="/admin-dashboard" className="hover:text-primary-200">Dashboard</Link>
                  <Link to="/analytics" className="hover:text-primary-200">Analytics</Link>
                  <Link to="/dealers" className="hover:text-primary-200">Dealers</Link>
                  <Link to="/tips" className="hover:text-primary-200">Tips</Link>
                  <Link to="/chat" className="hover:text-primary-200">Chat</Link>
                </>
              )}
              
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {user.name} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
