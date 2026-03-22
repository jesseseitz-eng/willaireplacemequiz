const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { jobTitle, score, riskLevel } = JSON.parse(event.body);
    const siteUrl = process.env.URL || 'https://willaireplaceme.online';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AI Career Deep Analysis',
            description: 'Personalized career resilience report for ' + jobTitle,
          },
          unit_amount: 999,
        },
        quantity: 1,
      }],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: siteUrl + '/paid.html?session_id={CHECKOUT_SESSION_ID}&job=' + encodeURIComponent(jobTitle) + '&score=' + score + '&risk=' + encodeURIComponent(riskLevel),
      cancel_url: siteUrl + '/#results',
      metadata: {
        jobTitle: jobTitle,
        score: String(score),
        riskLevel: riskLevel,
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
