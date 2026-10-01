export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée." }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await request.json();
    const question = String(body?.question || "").trim();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question vide." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY n'est pas configurée dans Vercel."
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":
              "Bearer " + process.env.OPENAI_API_KEY
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-5.6",
            input: [
              {
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text: "Tu es l'assistant pédagogique d'EduPlus. Explique clairement en français, étape par étape, avec des formules et des exemples quand c'est utile."
                  }
                ]
              },
              {
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: question
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error:
              data?.error?.message ||
              "Erreur du fournisseur IA."
          }),
          {
            status: response.status,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({
          answer: data.output_text || "Réponse vide."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erreur serveur IA." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};
