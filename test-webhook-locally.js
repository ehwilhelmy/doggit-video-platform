// Test webhook endpoint locally without Stripe
// This simulates what Stripe sends to test our webhook logic

const testWebhook = async () => {
  const webhookUrl = 'https://training.doggit.app/api/stripe/webhook';
  
  // Simulate a checkout.session.completed event
  const mockEvent = {
    id: 'evt_test_123',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        client_reference_id: 'test-user-id-123', // This should be a real user ID from your database
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
        metadata: {
          supabase_user_id: 'test-user-id-123'
        }
      }
    }
  };

  console.log('🧪 Testing webhook with mock data...');
  console.log('Mock event:', JSON.stringify(mockEvent, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: This won't pass signature verification, but we can see other errors
      },
      body: JSON.stringify(mockEvent)
    });

    console.log('Response status:', response.status);
    console.log('Response text:', await response.text());
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testWebhook();