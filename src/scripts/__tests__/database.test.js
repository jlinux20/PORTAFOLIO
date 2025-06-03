import * as database from '../database';

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    serverTimestamp: jest.fn(),
  };
});

describe('database.js', () => {
  test('should have expected functions', () => {
    expect(typeof database).toBe('object');
    expect(typeof database.addProject).toBe('function');
    expect(typeof database.getFeaturedProjects).toBe('function');
    expect(typeof database.getSkills).toBe('function');
    expect(typeof database.getCertifications).toBe('function');
    expect(typeof database.logAnalytics).toBe('function');
  });

  // Add more specific tests here based on the actual functions in database.js
});
