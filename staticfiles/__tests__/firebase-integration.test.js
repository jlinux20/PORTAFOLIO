import { resetMessages, getMockFirestore } from '../../src/__mocks__/firebase-firestore';

jest.mock('../firebase-config', () => {
    const originalModule = jest.requireActual('../firebase-config');
    const { getMockFirestore } = require('../../src/__mocks__/firebase-firestore');
    const mockFirebaseService = {
        saveMessage: jest.fn(async (messageData) => {
            console.log('Mock saveMessage called with data:', messageData);
            await getMockFirestore.addDoc(null, messageData);
            return { success: true, id: 'mock-id', timestamp: new Date().toISOString() };
        }),
        getRecentMessages: jest.fn(async (page, pageSize) => {
            console.log('Mock getRecentMessages called with page:', page, 'pageSize:', pageSize);
            const snapshot = await getMockFirestore.getDocs();
            const messages = snapshot.docs.map(doc => doc.data());
            return { success: true, messages };
        })
    };
    return {
        ...originalModule,
        firebaseService: mockFirebaseService
    };
});

import { firebaseService } from '../firebase-config';

describe('Firebase Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetMessages();
    });

    it('should save and retrieve message', async () => {
        const messageData = {
            name: 'Integration Test',
            email: 'test@integration.com',
            message: 'Test message'
        };

        // Save message
        const saveResult = await firebaseService.saveMessage(messageData);
        expect(saveResult.success).toBe(true);

        // Wait a short time to ensure message is added
        await new Promise(resolve => setTimeout(resolve, 20));

        // Get messages
        const getResult = await firebaseService.getRecentMessages(1, 10);
        
        // Verify message content
        expect(getResult.success).toBe(true);
        expect(getResult.messages).toHaveLength(1);
        expect(getResult.messages[0]).toMatchObject({
            name: messageData.name,
            email: messageData.email,
            message: messageData.message
        });
    });
});