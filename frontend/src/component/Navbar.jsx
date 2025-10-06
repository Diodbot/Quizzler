import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth'); // redirect to login/signup page
  };

  return (
    <nav className="bg-gray-900 bg-opacity-30 backdrop-blur-md rounded-lg border border-gray-700 border-opacity-50 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50 text-white">
      <Link to="/" className="text-2xl font-bold hover:text-green-400 transition-colors duration-300">
        Quizzler
      </Link>
      <div className="space-x-4">
        {token ? (
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-600 transition-colors duration-300 font-semibold"
          >
            Logout
          </button>
        ) : (
         <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
