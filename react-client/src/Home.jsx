import './styles/home.css'
import theatreImg from './assets/theatre.png'
import Logo from './components/Logo.jsx'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './components/auth/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  };

  return (
    <div id="home-page">
      <img src={theatreImg} alt="movie theatre image" className='bg-img'/>

      <div id='home-content'>
        <div id='left-side'>
          <Logo id='title' />
          <h2>Discover, Organize, and Share Your Favorite Films.</h2>
        </div>

        <div id='middle'>
            <Link
                id='explore-movies'
                to='/login'>
                Explore Movies
            </Link>
        </div>


        <div id='right-side'>
            <Link to="/login" state={{ from: { pathname: '/dashboard' } }} id='login'>
                Login
            </Link>

        </div>
      </div>
    </div>
  )
};
