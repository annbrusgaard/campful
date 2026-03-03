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
    // First call: web search
    const searchResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search the web for Phoenix Arizona summer camps matching: "${query}". Find 2-3 real camps with their details.`
        }]
      })
    });

    if (!searchResponse.ok) {
      const err = await searchResponse.text();
      return { statusCode: searchResponse.status, body: err };
    }

    const searchData = await searchResponse.json();
    const searchText = searchData.content.map(i => i.text || "").join("\n");

    // Second call: convert to JSON
    const jsonResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `Based on this information about Phoenix summer camps:\n\n${searchText}\n\nReturn ONLY a valid JSON array (no markdown, no explanation, just raw JSON starting with [ ) of 2-3 camps matching "${query}". Each object must have: name, org, type (Sports/Arts/STEM/Outdoor/Academic/Dance/Music), ages, cost, costNum (number), dates, startDate, endDate, address, desc, schedule, web, phone, extras, extCare (bool), beforeCare (bool), afterCare (bool), springBreak (bool), singleDay (bool), registrationOpen (bool), lat (near 33.4), lng (near -112.0). Start with [ and end with ].`
        }]
      })
    });

    if (!jsonResponse.ok) {
      const err = await jsonResponse.text();
      return { statusCode: jsonResponse.status, body: err };
    }

    const jsonData = await jsonResponse.json();
    const text = jsonData.content.map(i => i.text || "").join("").trim();
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) {
      return { statusCode: 500, body: "Could not parse results" };
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
