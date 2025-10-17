import type { APIRoute } from "astro";
import PocketBase from "pocketbase";

export const prerender = false;

const pb = new PocketBase(import.meta.env.POCKETBASE_URL);

export const GET: APIRoute = async () => {
	try {
		const records = await pb.collection("kb_chunks").getList(1, 500, {
			sort: "-created",
			fields: "id,content,source,title,tags,embedding",
		});

		return new Response(JSON.stringify({ items: records.items }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("[api/chunks] error:", error);
		return new Response(
			JSON.stringify({
				error: "Impossible de récupérer les chunks PocketBase.",
			}),
			{ status: 500 }
		);
	}
};
