module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({error:"Méthode non autorisée."});
  const question = String(req.body?.question || "").trim();
  if (!question) return res.status(400).json({error:"Question vide."});
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY n'est pas configurée dans Vercel."});
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL || "gpt-5.6",
        input:[
          {role:"system",content:[{type:"input_text",text:"Tu es l'assistant pédagogique d'EduPlus. Explique clairement en français, étape par étape, avec formules et exemples quand c'est utile."}]},
          {role:"user",content:[{type:"input_text",text:question}]}
        ]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({error:data?.error?.message || "Erreur du fournisseur IA."});
    return res.status(200).json({answer:data.output_text || "Réponse vide."});
  } catch(e) { return res.status(500).json({error:"Erreur serveur IA."}); }
};
