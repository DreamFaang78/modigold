'use client';
import { useActionState } from 'react';
import Image from 'next/image';
import { loginAction, type LoginState } from '@/app/admin/actions';

const INITIAL: LoginState = {};

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A2340' }}>
      <form action={action} className="bg-white p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-4" style={{ width: 150, height: 50 }}>
            <Image src="https://www.modigold.in/wp-content/uploads/2021/12/Modi-Gold-Logo1-1.png" alt="Modigold" fill className="object-contain" />
          </div>
          <h1 className="heading-md">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="input-label">Email</label>
            <input type="email" name="email" className="input-field" placeholder="admin@modigold.in" autoComplete="username" />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input type="password" name="password" className="input-field" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">{state.error}</p>
          )}
          <button type="submit" disabled={pending} className="btn-gold w-full justify-center py-4 disabled:opacity-60">
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
