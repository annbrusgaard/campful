exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { query } = JSON.parse(event.body || "{}");
  if (!query) return { statusCode: 400, body: "Missing query" };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { statusCode: 500, body: "API key not configured" };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You know Phoenix AZ summer camps well. Return a JSON array of 2 camps matching: "${query}". Use your training knowledge (no web search needed). Output ONLY raw JSON starting with [ — no markdown, no explanation. Fields: name, org, type (Sports/Arts/STEM/Outdoor/Academic/Dance/Music), ages, cost, costNum (number), dates, startDate, endDate, address, desc, schedule, web, phone, extras, extCare (bool), beforeCare (bool), afterCare (bool), springBreak (bool), singleDay (bool), registrationOpen (bool), lat (near 33.4), lng (near -112.0).`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: err };
    }

    const data = await response.json();
    const text = data.content.map(i => i.text || "").join("").trim();
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) return { statusCode: 500, body: "Could not parse results" };
    const parsed = JSON.parse(text.slice(start, end));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
