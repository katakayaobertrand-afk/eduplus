// EduPlus Pro — backend Node/Express
// 1) npm install
// 2) copier .env.example vers .env et ajouter la clé IA
// 3) npm start
const express=require("express");
const path=require("path");
const app=express();
app.use(express.json({limit:"2mb"}));
app.use(express.static(path.join(__dirname,"../public")));

app.post("/api/ai", async (req,res)=>{
  const q=(req.body.question||"").trim();
  if(!q) return res.status(400).json({error:"Question vide."});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY non configurée."});
  try{
    const response=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||"gpt-5.6",
        input:[
          {role:"system",content:[{type:"input_text",text:"Tu es l'assistant pédagogique d'EduPlus. Explique clairement en français, étape par étape, avec formules et exemples quand c'est utile. Ne prétends pas connaître un document qui n'a pas été fourni."}]},
          {role:"user",content:[{type:"input_text",text:q}]}
        ]
      })
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data.error?.message||"Erreur du fournisseur IA."});
    res.json({answer:data.output_text||"Réponse vide."});
  }catch(e){res.status(500).json({error:"Erreur serveur IA."})}
});
app.get("/health",(req,res)=>res.json({ok:true,service:"EduPlus"}));
app.listen(process.env.PORT||3000,()=>console.log("EduPlus sur http://localhost:"+(process.env.PORT||3000)));
