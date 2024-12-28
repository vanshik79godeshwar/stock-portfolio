import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const Home = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post<{ token: string }>('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', data.token); // Store JWT token
      router.push('/portfolio'); // Navigate to the portfolio page
    } catch (error: any) {
      console.error('Error logging in:', error);

      if (error.response && error.response.data.message.includes('duplicate')) {
        alert('There are duplicates. Please create a new account.');
      } else {
        alert('Login failed. maybe there are duplicate entrie. make a new account and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="email"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="flex flex-row justify-center my-7 gap-5">
          <p>New user?</p>
          <Link href="/signup" className="text-blue-800">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
