import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    addDoc: jest.fn(() => Promise.resolve({ id: 'test-id' })),
    getDocs: jest.fn(() => Promise.resolve({
        size: 1,
        forEach: jest.fn(),
        docs: [{
            id: 'test-id',
            data: () => ({
                name: 'Test User',
                email: 'test@example.com',
                message: 'Test message',
                timestamp: { toDate: () => new Date() },
                read: false
            })
        }]
    })),
    orderBy: jest.fn(() => ({})),
    limit: jest.fn(() => ({})),
    query: jest.fn(() => ({})),
    serverTimestamp: jest.fn(() => ({
        toDate: () => new Date()
    }))
}));

jest.mock('firebase/analytics', () => ({
    getAnalytics: jest.fn(() => null),
    isSupported: jest.fn(() => Promise.resolve(true))
}));

// Silence console in tests
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});