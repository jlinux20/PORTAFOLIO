import { jest } from '@jest/globals';
import { firebaseService, FirebaseError } from '../firebase-config.js';

const { getDocs } = jest.requireMock('firebase/firestore');

// Helper function for mock data
const createMockFirestoreData = (count = 2) => {
    const messages = Array.from({ length: count }, (_, i) => ({
        id: `${i + 1}`,
        data: () => ({
            timestamp: { toDate: () => new Date() },
            message: `Test message ${i + 1}`,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`
        })
    }));

    return {
        forEach: (callback) => messages.forEach(callback),
        size: messages.length,
        docs: messages
    };
};

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => {
    const mockDocs = createMockFirestoreData(2);
    return {
        getFirestore: jest.fn(() => ({})),
        collection: jest.fn(),
        addDoc: jest.fn(() => Promise.resolve({ id: 'mockId' })),
        getDocs: jest.fn(() => Promise.resolve(mockDocs)),
        orderBy: jest.fn(),
        limit: jest.fn(),
        query: jest.fn(),
        serverTimestamp: jest.fn(() => ({
            toDate: () => new Date()
        }))
    };
});

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
}));

describe('firebaseService', () => {
  beforeAll(() => {
    // Silenciar console.error en tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('validateMessage', () => {
    it('should throw error if required fields are missing', () => {
      const incompleteMessage = { name: 'John' };
      expect(() => firebaseService.validateMessage(incompleteMessage)).toThrow(FirebaseError);
    });

    it('should throw error if email is invalid', () => {
      const invalidEmailMessage = { name: 'John', email: 'invalidemail', message: 'Hello' };
      expect(() => firebaseService.validateMessage(invalidEmailMessage)).toThrow(FirebaseError);
    });

    it('should not throw error for valid message', () => {
      const validMessage = { name: 'John', email: 'john@example.com', message: 'Hello' };
      expect(() => firebaseService.validateMessage(validMessage)).not.toThrow();
    });

    it('should handle special characters in message', () => {
      const messageWithSpecialChars = {
        name: 'John<script>',
        email: 'john@example.com',
        message: '<script>alert("test")</script>'
      };

      expect(() => 
        firebaseService.validateMessage(messageWithSpecialChars)
      ).not.toThrow();
    });

    it('should handle very long messages', () => {
      const longMessage = {
        name: 'John',
        email: 'john@example.com',
        message: 'a'.repeat(1000)
      };

      expect(() => 
        firebaseService.validateMessage(longMessage)
      ).not.toThrow();
    });
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should save message and return success response', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      };

      const addDocMock = jest.spyOn(require('firebase/firestore'), 'addDoc')
        .mockResolvedValue({ id: 'mockId' });

      const response = await firebaseService.saveMessage(messageData);
      
      expect(response).toEqual({
        success: true,
        id: 'mockId',
        timestamp: expect.any(String)
      });

      expect(addDocMock).toHaveBeenCalled();
    });

    it('should throw FirebaseError on save failure', async () => {
      const messageData = {
        name: '',
        email: '',
        message: '',
        company: undefined
      };
      
      const validateSpy = jest.spyOn(firebaseService, 'validateMessage')
        .mockImplementationOnce(() => {
          throw new FirebaseError('Validation failed', 'VALIDATION_ERROR');
        });

      await expect(firebaseService.saveMessage(messageData))
        .rejects
        .toThrow(FirebaseError);

      expect(validateSpy).toHaveBeenCalledWith(messageData);
      validateSpy.mockRestore();
    });
  });

  describe('getRecentMessages', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return messages with pagination info', async () => {
      const mockData = createMockFirestoreData(2);
      const getDocs = jest.fn().mockResolvedValueOnce(mockData);
      
      jest.spyOn(require('firebase/firestore'), 'getDocs')
        .mockImplementation(getDocs);

      const result = await firebaseService.getRecentMessages(1, 5);

      expect(result).toEqual({
        success: true,
        messages: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            message: expect.any(String),
            timestamp: expect.any(Date)
          })
        ]),
        pagination: {
          page: 1,
          limit: 5,
          total: 2,
          pages: 1
        }
      });
    });
  });

  describe('logAnalytics', () => {
    it('should not throw error when logging analytics', async () => {
      const eventData = { eventName: 'test_event', eventData: {} };
      await expect(firebaseService.logAnalytics(eventData)).resolves.not.toThrow();
    });
  });

  describe('getClientIP', () => {
    it('should return a string IP or "unknown"', async () => {
      const ip = await firebaseService.getClientIP();
      expect(typeof ip).toBe('string');
    });
  });
});
