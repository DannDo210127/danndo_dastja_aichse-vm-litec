'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redirect to the login page
  }, [router]);

  return null; // Render nothing while redirecting
};

export default IndexPage;