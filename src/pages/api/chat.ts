import type { APIRoute } from "astro";
import { OpenAI } from "openai";

export const prerender = false;

const client = new OpenAI({
	apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
	try {
		const raw = await request.text();
		if (!raw) {
			return new Response(JSON.stringify({ error: "Corps de requête vide." }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const payload = JSON.parse(raw);
		const { question, contextChunks } = payload as {
			question?: string;
			contextChunks?: Array<{
				content: string;
				source?: string;
				title?: string;
			}>;
		};

		if (!question || !Array.isArray(contextChunks)) {
			return new Response(
				JSON.stringify({
					error: "Requête invalide. Fournis `question` et `contextChunks`.",
				}),
				{ status: 400 }
			);
		}

		const context = contextChunks
			.map((chunk, index) => {
				const header = `#${index + 1}${chunk.source ? ` (${chunk.source})` : ""
					}`;
				return `${header}\n${chunk.content}`;
			})
			.join("\n\n");

		const messages = [
			{
				role: "system" as const,
				content: `Tu es l'assistant personnel de Noah Rognon.
Tu réponds uniquement à partir du contexte fourni. 
Si tu ne possèdes pas l'information ou si la question sort du contexte, indique-le poliment.`,
			},
			{
				role: "user" as const,
				content: `CONTEXTE:\n${context}\n\nQUESTION:\n${question}`,
			},
		];

		const completion = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages,
		});

		const answer = completion.choices[0]?.message?.content ?? "";

		return new Response(JSON.stringify({ answer }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("[api/chat] error:", error);
		return new Response(
			JSON.stringify({
				error: "Une erreur est survenue lors de l'appel à l'API OpenAI.",
			}),
			{ status: 500 }
		);
	}
};
