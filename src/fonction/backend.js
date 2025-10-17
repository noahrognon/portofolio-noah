import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090"); // ��? remplace par ton URL PocketBase

export async function getProjetsPhares() {
	const records = await pb.collection("ProjetsPhares").getFullList({
		sort: "-created",
	});

	return records.map((record) => ({
		id: record.id,
		titre: record.Titre,
		description: record.description,
		themes: record.themes,
		image: `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.Image}`,
	}));
}

export async function getCarouselItems() {
	const records = await pb.collection("Carousel").getFullList({
		sort: "created",
	});

	return records.map((record) => ({
		id: record.id,
		name: record.nom ?? record.Nom ?? "",
		icon: record.svg
			? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.svg}`
			: null,
	}));
}

export async function getCompetencesDetaillees() {
	const records = await pb.collection("Competencedetaille").getFullList({
		sort: "created",
	});

	return records.map((record) => ({
		id: record.id,
		name: record.Nom ?? record.nom ?? "",
		description: record.sous_nom ?? record.sousNom ?? "",
		domain: record.domaine ?? record.domain ?? "",
		level: record.niveau ?? record.Niveau ?? "",
	}));
}

export async function getPolyvalentSkills() {
	const records = await pb.collection("Polyvalent").getFullList({
		sort: "created",
	});

	return records.map((record) => ({
		id: record.id,
		competence: record.Competence ?? record.competence ?? "",
		theme: record.Theme ?? record.theme ?? "",
	}));
}

export async function getProjects() {
	const records = await pb.collection("Projets").getFullList({
		sort: "-created",
	});

	return records.map((record) => {
		const technologies = Array.isArray(record.technologies)
			? record.technologies
			: Array.isArray(record.technologies?.values)
			? record.technologies.values
			: [];

		const imageField =
			record.apercu ??
			record.Apercu ??
			record.image ??
			record.Image ??
			record.visuel ??
			record.Visuel ??
			record.cover ??
			record.Cover ??
			null;

		const image =
			imageField && record.collectionId
				? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${imageField}`
				: null;

		return {
			id: record.id,
			etiquette: record.etiquette ?? "",
			titre: record.titre ?? "",
			temps: record.temps ?? "",
			equipe: record.equipe ?? "",
			technologies,
			liengithub: record.liengithub ?? "",
			image,
			statut: record.statut ?? record.etat ?? "",
			role: record.role ?? record.roles ?? "",
		};
	});
}
