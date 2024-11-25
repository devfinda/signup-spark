import { Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from './Button';

export default function UserMenu() {
  const { user, setUser } = useAuthStore();

  const handleSignOut = () => {
    setUser(null);
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium hidden md:inline">
          {user.name}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}