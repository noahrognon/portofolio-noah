import type { APIRoute } from "astro";
import PocketBase from "pocketbase";

export const prerender = false;

// Ensure we have an absolute PocketBase URL on the server. Fall back to the
// known production URL if the env var is not set.
const POCKETBASE_FALLBACK = "https://portfolio.noahrognon.fr:443";
const pbBase = import.meta.env.POCKETBASE_URL || process.env.POCKETBASE_URL || POCKETBASE_FALLBACK;
console.log("[api/chunks] PocketBase base URL:", pbBase);
const pb = new PocketBase(pbBase);

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
