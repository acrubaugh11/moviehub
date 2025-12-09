import { useLocation } from 'react-router-dom';

function LoginPage() {
  const location = useLocation();

  // Get the path the user was trying to access, from ProtectedRoute
  const from = location.state?.from?.pathname || '/';
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:3000';

  // Construct the backend URL
  // We send the 'from' path as a query param so the backend can save it
  const googleLoginUrl = BACKEND_URL + '/auth/google?returnTo=' + from;

  return (
    <div>
      <h2>Login</h2>
      <p>You must log in to continue.</p>

      {/* regular <a> tag, not a React Router <Link>.
        We need a full-page navigation to leave our React app
        and go to the backend/Google.
      */}
      <a href={googleLoginUrl}>
        Login with Google
      </a>
    </div>
  );
}

export default LoginPage;