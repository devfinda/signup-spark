import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from './Button';

interface GoogleSignInButtonProps {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GoogleSignInButton({ variant = 'primary', size = 'md', className }: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        });
        
        const userInfo = await userInfoResponse.json();
        
        setUser({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
        });

        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to get user info:', error);
      }
    },
    onError: () => {
      console.error('Login Failed');
    },
  });

  return (
    <Button
      onClick={() => login()}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      data-signin-button
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5" />
      {size === 'sm' ? 'Sign in' : 'Sign in with Google'}
    </Button>
  );
}