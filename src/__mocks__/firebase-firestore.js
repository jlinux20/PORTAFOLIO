let mockMessages = [];

export const resetMessages = () => {
    mockMessages = [];
};

export const addMessage = (message) => {
    const docRef = { 
        id: `mock-${Date.now()}`
    };
    
    const timestampObj = {
        toDate: () => new Date()
    };

    const newMessage = {
        id: docRef.id,
        ...message,
        timestamp: message.timestamp || timestampObj,
        read: false
    };
    
    mockMessages = [newMessage, ...mockMessages];
    return new Promise((resolve) => {
        setTimeout(() => resolve(docRef), 10);
    });
};

export const getMockFirestore = {
    getFirestore: jest.fn(() => {
        return {};
    }),
    collection: jest.fn(() => ({})),
    addDoc: jest.fn((_, data) => {
        return addMessage(data);
    }),
    getDocs: jest.fn((arg) => {
        console.log('Mock getDocs called with arg:', arg, 'returning messages:', mockMessages, 'Timestamp:', new Date().toISOString());
        console.trace();
        return Promise.resolve({
            size: mockMessages.length,
            forEach: (cb) => mockMessages.forEach(doc => cb({
                id: doc.id,
                data: () => ({ ...doc })
            })),
            docs: mockMessages.map(doc => ({
                id: doc.id,
                data: () => ({ ...doc })
            }))
        });
    }),
    orderBy: jest.fn(() => ({})),
    limit: jest.fn(() => ({})),
    query: jest.fn(() => ({})),
    serverTimestamp: jest.fn(() => ({
        toDate: () => new Date()
    }))
};
