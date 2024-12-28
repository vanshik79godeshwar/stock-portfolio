import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const Signup = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      router.push('/'); 
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4">Sign Up</h2>
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
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <div className='flex flex-row justify-center my-7 gap-5'>
        <p>Already registered?</p>
        <Link href="/" className='text-blue-800'>Signin</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
