import fs from "fs";
import path from "path";
import PocketBase from "pocketbase";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Ensure pb has an absolute URL. Prefer env, otherwise fallback to production host.
const POCKETBASE_FALLBACK = "https://portfolio.noahrognon.fr:443";
const pbBase = process.env.POCKETBASE_URL || POCKETBASE_FALLBACK;
console.log("[embed script] PocketBase base URL:", pbBase);
const pb = new PocketBase(pbBase);
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("[embed script] Missing OPENAI_API_KEY environment variable. Set it in your .env or environment.");
    process.exit(1);
}
const client = new OpenAI({ apiKey });

const DATA_DIR = "./data"; // dossier où tu as tes .md
const COLLECTION = "kb_chunks";

// Fonction simple pour découper le texte en "chunks"
function chunkText(text, size = 1200) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    let chunks = [];
    let chunk = "";

    for (const sentence of sentences) {
        if ((chunk + sentence).length > size) {
            chunks.push(chunk.trim());
            chunk = "";
        }
        chunk += sentence + " ";
    }

    if (chunk.trim()) chunks.push(chunk.trim());
    return chunks;
}

async function main() {
    const files = fs.readdirSync(DATA_DIR);

    for (const file of files) {
        if (!file.endsWith(".md")) continue;

        const source = path.basename(file, ".md");
        const content = fs.readFileSync(path.join(DATA_DIR, file), "utf8");

        const chunks = chunkText(content);

        console.log(`📄 ${source}: ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            // Génération de l’embedding
            const embeddingRes = await client.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
            });

            const embedding = embeddingRes.data[0].embedding;

            // Envoi dans PocketBase
            await pb.collection(COLLECTION).create({
                content: chunk,
                source,
                title: `${source} #${i + 1}`,
                tags: [],
                embedding,
                lang: "fr",
            });

            console.log(`✅ Uploaded chunk ${i + 1}/${chunks.length} from ${source}`);
        }
    }

    console.log("✨ All files processed and uploaded!");
}

main().catch(console.error);
