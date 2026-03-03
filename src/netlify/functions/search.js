exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { query } = JSON.parse(event.body || "{}");
  if (!query) {
    return { statusCode: 400, body: "Missing query" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "API key not configured" };
  }

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
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search the web and find Phoenix Arizona summer camps matching: "${query}". Return ONLY a raw JSON array (no markdown, no backticks) of 2-3 real camps. Each camp needs: name, org, type (one of: Sports/Arts/STEM/Outdoor/Academic/Dance/Music), ages, cost, costNum (number only), dates, startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), address, desc, schedule, web, phone, extras, extCare (bool), beforeCare (bool), afterCare (bool), springBreak (bool), singleDay (bool), registrationOpen (bool), lat (number ~33.4), lng (number ~-112.0).`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: err };
    }

    const data = await response.json();
    const text = data.content.map(i => i.text || "").join("\n").replace(/```json|```/g, "").trim();
    const start = text.indexOf("["), end = text.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) {
      return { statusCode: 500, body: "No results found" };
    }
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
