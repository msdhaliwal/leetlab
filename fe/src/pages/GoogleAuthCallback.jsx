import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Index = () => {
  const { loginGoogle } = useAuthStore();
  const url = new URL(window.location.href);
  const navigate = useNavigate();
  useEffect(() => {
    const code = url.searchParams.get('code');
    console.log('code :>> ', code);
    loginGoogle({ code })
      .then(() => {
        console.log('all good');
        navigate('/');
      })
      .catch(() => {
        navigate('/');
      });
  }, []);
  // return <Loader />;
};

export default Index;
