// Verifies that a Stripe checkout session was actually paid
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { sessionId } = JSON.parse(event.body);
    
    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing session ID' }),
      };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paid: true,
          jobTitle: session.metadata.jobTitle,
          score: session.metadata.score,
          riskLevel: session.metadata.riskLevel,
        }),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ paid: false, error: 'Payment not completed' }),
      };
    }
  } catch (error) {
    console.error('Verify error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
