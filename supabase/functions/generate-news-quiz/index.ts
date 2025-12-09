import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch a random Wikipedia article
    console.log("Fetching Wikipedia article...");
    const wikiResponse = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/random/summary"
    );
    
    if (!wikiResponse.ok) {
      throw new Error("Failed to fetch Wikipedia article");
    }

    const wikiData = await wikiResponse.json();
    const articleTitle = wikiData.title;
    const articleExtract = wikiData.extract;

    console.log("Generating quiz from article:", articleTitle);

    // Generate quiz questions using AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a quiz generator. Generate exactly 5 multiple-choice questions based on the provided Wikipedia article. 
            
            Return a valid JSON object with this exact structure:
            {
              "topic": "string (the topic name)",
              "questions": [
                {
                  "question": "string",
                  "options": ["string", "string", "string", "string"],
                  "correct": number (0-3, index of correct answer)
                }
              ]
            }
            
            Make questions interesting and educational. Ensure all information is accurate based on the article content.
            Return ONLY the JSON, no markdown or extra text.`,
          },
          {
            role: "user",
            content: `Create a quiz based on this Wikipedia article about "${articleTitle}":\n\n${articleExtract}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let quizData;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      quizData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid quiz format from AI");
    }

    console.log("Quiz generated successfully for:", quizData.topic);

    return new Response(
      JSON.stringify({
        topic: quizData.topic || articleTitle,
        source: `Based on: ${articleTitle}`,
        questions: quizData.questions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-news-quiz:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
