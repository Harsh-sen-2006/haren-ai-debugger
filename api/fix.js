// Haren-Dev: Backend logic for AI Bug Fixer
// Using Vercel Serverless Function to keep API Key secure

export default async function handler(req, res) {
    
    // Sirf POST request allow karni hai (security check)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed. Use POST." });
    }

    // Input data frontend se lena
    const userCode = req.body.code;
    const taskMode = req.body.mode;

    // OpenRouter API key environment variable se fetch karna
    // Taaki client-side par key expose na ho
    const myApiKey = process.env.OPENROUTER_API_KEY;

    try {
        // API call to OpenRouter (GPT-4o-mini model)
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + myApiKey
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: "Task: " + taskMode + "\nCode to process:\n" + userCode
                    }
                ]
            })
        });

        // Response ko JSON mein badalna
        const resultData = await response.json();

        // Successful response wapas bhejna
        res.status(200).json(resultData);

    } catch (err) {
        // Error handling agar API ya network fail ho jaye
        console.log("Error in AI Backend: ", err);
        res.status(500).json({ error: "Something went wrong with the AI engine." });
    }
}
