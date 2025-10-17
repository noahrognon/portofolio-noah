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

		const { input } = JSON.parse(raw) as { input?: string };

		if (!input || typeof input !== "string") {
			return new Response(
				JSON.stringify({ error: "Requête invalide. Fournis `input`." }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		const embeddingRes = await client.embeddings.create({
			model: "text-embedding-3-small",
			input,
		});

		const embedding = embeddingRes.data[0]?.embedding;

		return new Response(JSON.stringify({ embedding }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("[api/embedding] error:", error);
		return new Response(
			JSON.stringify({
				error: "Impossible de générer l'embedding.",
			}),
			{ status: 500 }
		);
	}
};
