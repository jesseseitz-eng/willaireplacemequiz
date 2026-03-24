exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const score = parseInt(params.s) || 50;
  const job = params.j || 'your career';
  const risk = params.r || 'Moderate Risk';
  const safeJob = job.replace(/[<>"'&]/g, '');
  const safeRisk = risk.replace(/[<>"'&]/g, '');

  const riskEmoji = score <= 25 ? '\u{1F6E1}\uFE0F' : score <= 50 ? '\u26A0\uFE0F' : score <= 72 ? '\u{1F525}' : '\u{1F6A8}';
  const title = `${riskEmoji} ${safeJob}: ${score}/100 AI Risk Score`;
  const description = `${safeRisk} \u2014 How AI-resilient is YOUR career? Take the free 60-second assessment.`;

  // Generate a dynamic SVG OG image
  const col = score <= 25 ? '#22dd77' : score <= 50 ? '#ffcc00' : score <= 72 ? '#ff7733' : '#ff3344';
  const fillPct = score / 100;
  const arcEndX = 300 + Math.cos(Math.PI + fillPct * Math.PI) * 140;
  const arcEndY = 210 + Math.sin(Math.PI + fillPct * Math.PI) * 140;
  const largeArc = fillPct > 0.5 ? 1 : 0;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="glow" cx="300" cy="180" r="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${col}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#07070d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#07070d"/>
    <rect width="1200" height="630" fill="url(#glow)"/>

    <!-- Gauge background -->
    <path d="M 160 210 A 140 140 0 0 1 440 210" fill="none" stroke="#161625" stroke-width="28" stroke-linecap="round"/>
    <!-- Gauge fill -->
    <path d="M 160 210 A 140 140 0 ${largeArc} 1 ${arcEndX} ${arcEndY}" fill="none" stroke="${col}" stroke-width="28" stroke-linecap="round"/>
    <!-- Center dot -->
    <circle cx="300" cy="210" r="6" fill="#eeeef3"/>

    <!-- Score -->
    <text x="300" y="360" text-anchor="middle" fill="${col}" font-family="sans-serif" font-weight="800" font-size="100">${score}</text>
    <text x="300" y="400" text-anchor="middle" fill="#55556d" font-family="monospace" font-size="22">/ 100 risk score</text>
    <text x="300" y="445" text-anchor="middle" fill="${col}" font-family="sans-serif" font-weight="700" font-size="28">${safeRisk.toUpperCase()}</text>
    <text x="300" y="485" text-anchor="middle" fill="#9999b2" font-family="sans-serif" font-size="24">${safeJob}</text>

    <!-- Right side CTA -->
    <text x="800" y="200" text-anchor="middle" fill="#9999b2" font-family="sans-serif" font-weight="500" font-size="28">How AI-resilient is</text>
    <text x="800" y="245" text-anchor="middle" fill="#eeeef3" font-family="sans-serif" font-weight="700" font-size="34">YOUR career?</text>
    <text x="800" y="340" text-anchor="middle" fill="${col}" font-family="sans-serif" font-weight="700" font-size="30">willaireplaceme.online</text>
    <text x="800" y="385" text-anchor="middle" fill="#55556d" font-family="sans-serif" font-size="22">Free 60-second assessment</text>

    <!-- Bottom source -->
    <text x="600" y="590" text-anchor="middle" fill="#2a2a3d" font-family="monospace" font-size="16">Data: BLS 2026 \u00b7 Anthropic \u00b7 Goldman Sachs</text>

    <!-- Top accent line -->
    <line x1="100" y1="60" x2="1100" y2="60" stroke="${col}" stroke-opacity="0.3" stroke-width="1"/>
  </svg>`;

  // Check if requesting the image directly
  const reqPath = event.path || event.rawUrl || '';
  if (reqPath.includes('og.svg')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
      body: svg
    };
  }

  // OG image — use static PNG as fallback (most platforms don't render SVG reliably)
  // The SVG endpoint is still available at /share/og.svg for direct use
  const ogImageUrl = `https://willaireplaceme.online/og-image.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://willaireplaceme.online">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta http-equiv="refresh" content="0;url=https://willaireplaceme.online">
  <style>
    body{margin:0;background:#07070d;color:#eeeef3;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .c{text-align:center;padding:40px}
    .s{font-size:72px;font-weight:800;color:${col}}
    .l{font-size:24px;color:${col};margin:8px 0}
    .j{font-size:18px;color:#9999b2}
    a{color:${col};text-decoration:none;font-size:20px;margin-top:24px;display:inline-block}
  </style>
</head>
<body>
  <div class="c">
    <div class="s">${score}</div>
    <div style="color:#55556d;font-family:monospace">/ 100 risk score</div>
    <div class="l">${safeRisk}</div>
    <div class="j">${safeJob}</div>
    <br>
    <a href="https://willaireplaceme.online">Take the quiz \u2192</a>
    <p style="color:#55556d;font-size:14px">Redirecting...</p>
  </div>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=3600' },
    body: html
  };
};
