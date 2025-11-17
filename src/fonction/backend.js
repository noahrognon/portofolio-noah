import PocketBase from "pocketbase";

const pb = new PocketBase("https://portfolio.noahrognon.fr:443"); // ��? remplace par ton URL PocketBase
const getCollectionId = (record) =>
	record?.collectionId ?? record?.collection?.id ?? record?.collection ?? null;

const toFileUrl = (record, fileName) => {
	if (!record || !fileName) {
		return null;
	}

	const collectionId = getCollectionId(record);
	if (!collectionId) {
		return null;
	}

	return `${pb.baseUrl}/api/files/${collectionId}/${record.id}/${fileName}`;
};

const getFileField = (record, field, { multiple = false } = {}) => {
	const value = record?.[field];
	if (!value) {
		return multiple ? [] : null;
	}

	if (Array.isArray(value)) {
		const urls = value.map((file) => toFileUrl(record, file)).filter(Boolean);
		return multiple ? urls : urls[0] ?? null;
	}

	const url = toFileUrl(record, value);
	return multiple ? (url ? [url] : []) : url;
};

const parseJSONField = (value, fallback = []) => {
	if (!value) return fallback;
	if (Array.isArray(value)) return value;

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed : fallback;
		} catch {
			return fallback;
		}
	}

	if (typeof value === "object") {
		return [value];
	}

	return fallback;
};

const splitStringList = (value) => {
	if (!value) return [];
	if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim());

	if (typeof value === "string") {
		return value
			.split(/[,/|;]+/)
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
};

const escapeFilterValue = (value) =>
	typeof value === "string" ? value.replace(/"/g, '\\"') : value;

const normalizePointList = (value) => {
	const rawList = parseJSONField(value);
	if (rawList.length > 0) {
		return rawList
			.map((item) => {
				if (typeof item === "string") {
					return { title: "", text: item };
				}
				if (item && typeof item === "object") {
					return {
						title: item.title ?? item.label ?? "",
						text: item.text ?? item.description ?? "",
					};
				}
				return null;
			})
			.filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => ({ title: "", text: line }));
	}

	return [];
};

const normalizeStackItems = (value) => {
	const rawList = parseJSONField(value);
	return rawList
		.map((item) => {
			if (typeof item === "string") {
				return { label: item, category: "" };
			}
			if (item && typeof item === "object") {
				return {
					label: item.label ?? item.name ?? "",
					category: item.category ?? item.type ?? "",
				};
			}
			return null;
		})
		.filter((item) => item && item.label);
};

const normalizeProcessSteps = (record) => {
	const rawSteps = parseJSONField(record?.process_steps);
	return rawSteps
		.map((step, index) => {
			if (!step || typeof step !== "object") return null;

			const imageUrl = step.image
				? step.image.startsWith("http")
					? step.image
					: toFileUrl(record, step.image)
				: null;

			return {
				index: index + 1,
				title: step.title ?? step.step_title ?? "",
				description: step.description ?? step.step_description ?? "",
				points: Array.isArray(step.points ?? step.step_points)
					? (step.points ?? step.step_points)
					: [],
				tags: Array.isArray(step.tags ?? step.step_tags)
					? (step.tags ?? step.step_tags)
					: splitStringList(step.tags ?? step.step_tags),
				image: imageUrl,
			};
		})
		.filter(Boolean);
};

const normalizeContextBlocks = (record) => {
	const rawBlocks = parseJSONField(record?.context_extra_blocks);
	return rawBlocks
		.map((block) => {
			if (!block || typeof block !== "object") return null;
			return {
				title: block.title ?? block.label ?? "",
				description: block.text ?? block.description ?? "",
				icon: block.icon ?? null,
				points: Array.isArray(block.points) ? block.points : [],
			};
		})
		.filter((block) => block && (block.title || block.description));
};

const normalizeProjectDetail = (record) => {
	if (!record) return null;

	const tags = splitStringList(record.project_tags);

	return {
		id: record.id,
		projectId: record.projet ?? null,
		title: record.project_title ?? record.titre ?? "",
		subtitle: record.intro_subtitle ?? "",
		tagline: record.intro_tagline ?? "",
		tags,
		heroImage: getFileField(record, "hero_image"),
		gallery: {
			desktop: getFileField(record, "gallery_desktop"),
			mobile: getFileField(record, "gallery_mobile"),
		},
		metrics: {
			durationWeeks: record.project_duration_weeks ?? null,
			year: record.project_year ?? null,
			hours: record.project_hours ?? null,
			techCount: record.project_tech_count ?? null,
			performanceScore: record.project_performance_score ?? null,
		},
		ctas: {
			project: record.intro_cta_project_url ?? "",
			ai: record.intro_cta_ai_url ?? "",
		},
		context: {
			title: record.context_title ?? "",
			paragraphs: [record.context_paragraph_1, record.context_paragraph_2].filter(Boolean),
			stats: [
				{
					value: record.context_stat_1_value ?? "",
					label: record.context_stat_1_label ?? "",
				},
				{
					value: record.context_stat_2_value ?? "",
					label: record.context_stat_2_label ?? "",
				},
			].filter((stat) => stat.value || stat.label),
			solution: {
				title: record.context_solution_title ?? "",
				text: record.context_solution_text ?? "",
			},
			images: getFileField(record, "context_images", { multiple: true }),
			highlights: normalizeContextBlocks(record),
		},
		process: {
			title: record.process_title ?? "",
			intro: record.process_intro ?? "",
			steps: normalizeProcessSteps(record),
		},
		result: {
			title: record.result_title ?? "",
			points: normalizePointList(record.result_points),
			desktopImage: getFileField(record, "result_images_desktop"),
			mobileImage: getFileField(record, "result_images_mobile"),
		},
		stack: {
			title: record.stack_title ?? "",
			items: normalizeStackItems(record.stack_items),
			featuresTitle: record.stack_features_title ?? "",
			features: normalizePointList(record.stack_features).map((item) =>
				item.text ? item.text : item.title
			),
		},
		impact: {
			title: record.impact_title ?? "",
			learnedTitle: record.impact_learned_title ?? "",
			doDifferentTitle: record.impact_do_different_title ?? "",
			quote: record.impact_quote ?? "",
			learnedPoints: normalizePointList(record.impact_learned_points),
			doDifferentPoints: normalizePointList(record.impact_do_different_points),
		},
		stats: {
			weeks: {
				value: record.stats_weeks_value ?? record.project_duration_weeks ?? null,
				title: record.stats_weeks_title ?? "",
			},
			tech: {
				value: record.stats_tech_value ?? record.project_tech_count ?? null,
				title: record.stats_tech_title ?? "",
			},
			hours: {
				value: record.stats_hours_value ?? record.project_hours ?? null,
				title: record.stats_hours_title ?? "",
			},
			performance: {
				value: record.stats_performance_value ?? record.project_performance_score ?? null,
				title: record.stats_performance_title ?? "",
			},
		},
	};
};

const fetchProjectDetailRecord = async (identifier) => {
	if (!identifier) return null;

	const collection = pb.collection("Projects");

	try {
		const safeId = escapeFilterValue(identifier);
		return await collection.getFirstListItem(`projet="${safeId}"`);
	} catch (error) {
		try {
			return await collection.getOne(identifier);
		} catch {
			return null;
		}
	}
};

export async function getProjectDetail(identifier) {
	const record = await fetchProjectDetailRecord(identifier);
	return normalizeProjectDetail(record);
}

export async function getProjectDetailsList() {
	const records = await pb.collection("Projects").getFullList({
		sort: "-created",
	});

	return records.map(normalizeProjectDetail).filter(Boolean);
}

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

export async function getParcours() {
	const records = await pb.collection("Parcours").getFullList();

	const parseOrder = (value) => {
		if (typeof value === "number") return value;
		if (typeof value === "string") {
			const parsed = parseFloat(value);
			return Number.isNaN(parsed) ? null : parsed;
		}
		return null;
	};

	const sorted = [...records].sort((a, b) => {
		const orderA =
			parseOrder(a.ordre ?? a.order ?? a.position) ??
			new Date(a.created ?? 0).getTime();
		const orderB =
			parseOrder(b.ordre ?? b.order ?? b.position) ??
			new Date(b.created ?? 0).getTime();
		return orderA - orderB;
	});

	return sorted.map((record) => {
		const title =
			record.titre ??
			record.Titre ??
			record.title ??
			record.Title ??
			record.nom ??
			"";
		const description =
			record.description ?? record.Description ?? record.desc ?? "";
		const year =
			record.annee ??
			record.Annee ??
			record.annees ??
			record.anneeEtude ??
			record.periode ??
			record.periodeEtude ??
			"";

		const iconField =
			record.icons ??
			record.icon ??
			record.icone ??
			record.Icon ??
			record.image ??
			record.Image ??
			null;

		const icon =
			iconField && record.collectionId
				? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${iconField}`
				: null;

		return {
			id: record.id,
			title,
			description,
			year,
			icon,
		};
	});
}

export async function getValeurs() {
	const records = await pb.collection("Valeurs").getFullList({
		sort: "created",
	});

	return records.map((record) => {
		const title =
			record.titre ??
			record.Titre ??
			record.title ??
			record.Title ??
			record.nom ??
			"";
		const description =
			record.description ?? record.Description ?? record.desc ?? "";
		const iconField =
			record.icons ??
			record.icon ??
			record.icone ??
			record.Icon ??
			record.image ??
			record.Image ??
			null;

		const icon =
			iconField && record.collectionId
				? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${iconField}`
				: null;

		return {
			id: record.id,
			title,
			description,
			icon,
		};
	});
}

export async function getCvFile() {
	try {
		const record = await pb
			.collection("CV")
			.getFirstListItem("", { sort: "-updated" });

		if (!record) {
			return null;
		}

		const fileField =
			record.cv ??
			record.CV ??
			record.file ??
			record.File ??
			record.fichier ??
			record.Fichier ??
			null;

		const url =
			fileField && record.collectionId
				? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${fileField}`
				: null;

		return {
			id: record.id,
			url,
			filename: fileField ?? null,
		};
	} catch (error) {
		console.error("Impossible de recuperer le CV depuis PocketBase:", error);
		return null;
	}
}
