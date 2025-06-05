import { firebaseService } from '../firebase-config';

describe('Firebase Integration', () => {
  it('should save and retrieve message', async () => {
    const messageData = {
      name: 'Integration Test',
      email: 'test@integration.com',
      message: 'Test message'
    };

    // Save message
    const saveResult = await firebaseService.saveMessage(messageData);
    expect(saveResult.success).toBe(true);

    // Get messages
    const getResult = await firebaseService.getRecentMessages(1, 10);
    expect(getResult.messages).toContainEqual(
      expect.objectContaining({
        name: messageData.name,
        email: messageData.email,
        message: messageData.message
      })
    );
  });
});
