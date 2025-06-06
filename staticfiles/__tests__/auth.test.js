import { login, logout, monitorAuthState } from '../auth';

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback({ uid: '123' });
    }),
    signInWithEmailAndPassword: jest.fn((auth, email, password) => {
      if (email === 'test@example.com' && password === 'password') {
        return Promise.resolve({ user: { uid: '123' } });
      } else {
        return Promise.reject(new Error('Invalid credentials'));
      }
    }),
    signOut: jest.fn(() => Promise.resolve()),
  };
});

describe('auth.js', () => {
  test('monitorAuthState calls callback with user', done => {
    monitorAuthState(user => {
      expect(user).toEqual({ uid: '123' });
      done();
    });
  });

  test('login success with correct credentials', async () => {
    const result = await login('test@example.com', 'password');
    expect(result.success).toBe(true);
    expect(result.user.uid).toBe('123');
  });

  test('login failure with incorrect credentials', async () => {
    const result = await login('wrong@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  test('logout success', async () => {
    const result = await logout();
    expect(result.success).toBe(true);
  });
});
