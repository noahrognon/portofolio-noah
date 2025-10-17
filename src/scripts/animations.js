import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const prefersReducedMotion = () =>
	window.matchMedia &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initScrollAnimations = () => {
	if (prefersReducedMotion()) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	const revealContainers = gsap.utils.toArray(
		".hero-section, section, [data-reveal], .reveal-block"
	);

	revealContainers.forEach((container) => {
		if (!(container instanceof HTMLElement)) {
			return;
		}

		const targets =
			container.querySelectorAll(":scope > *") ?? [container];

		gsap.from(targets, {
			opacity: 0,
			y: 40,
			duration: 0.9,
			ease: "power2.out",
			stagger: 0.14,
			scrollTrigger: {
				trigger: container,
				start: "top 80%",
				toggleActions: "play none none reverse",
			},
		});
	});

	const projetsCards = gsap.utils.toArray(
		".projets-phares article, section article, [data-project-card]"
	);
	projetsCards.forEach((card) => {
		if (!(card instanceof HTMLElement)) {
			return;
		}
		gsap.from(card, {
			opacity: 0,
			y: 50,
			duration: 0.7,
			delay: 0.1,
			ease: "power2.out",
			scrollTrigger: {
				trigger: card,
				start: "top 85%",
				toggleActions: "play none none reverse",
			},
		});
	});
};

const initHeroParallax = () => {
	if (prefersReducedMotion()) {
		return;
	}

	const hero = document.querySelector(".hero-section");
	if (!hero) {
		return;
	}

	const parallaxTargets = hero.querySelectorAll(
		".hero-title, .hero-description, .hero-btn-primary, .hero-btn-secondary"
	);

	parallaxTargets.forEach((element, index) => {
		if (!(element instanceof HTMLElement)) {
			return;
		}
		element.style.willChange = "transform";
		gsap.to(element, {
			yPercent: -6 - index * 2,
			ease: "none",
			scrollTrigger: {
				trigger: hero,
				start: "top top",
				end: "+=600",
				scrub: true,
			},
		});
	});
};

const initCursor = () => {
	if (window.innerWidth < 768 || prefersReducedMotion()) {
		return;
	}

	const pointerFine =
		window.matchMedia &&
		window.matchMedia("(pointer: fine)").matches;
	if (!pointerFine) {
		return;
	}

	const cursor = document.createElement("div");
	cursor.className = "custom-cursor";
	document.body.append(cursor);

	const style = document.createElement("style");
	style.textContent = `
		body.custom-cursor-hidden {
			cursor: none;
		}
		.custom-cursor {
			position: fixed;
			top: 0;
			left: 0;
			width: 22px;
			height: 22px;
			border: 2px solid #FF6600;
			border-radius: 9999px;
			pointer-events: none;
			z-index: 9999;
			transform: translate(-50%, -50%);
			opacity: 0;
			mix-blend-mode: screen;
		}
		.custom-cursor.is-hidden {
			opacity: 0;
		}
		@media (max-width: 767px) {
			body.custom-cursor-hidden {
				cursor: auto;
			}
			.custom-cursor {
				display: none;
			}
		}
	`;
	document.head.append(style);
	document.body.classList.add("custom-cursor-hidden");

	const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	const mouse = { ...position };

	const render = () => {
		position.x += (mouse.x - position.x) * 0.18;
		position.y += (mouse.y - position.y) * 0.18;
		gsap.set(cursor, { x: position.x, y: position.y });
		requestAnimationFrame(render);
	};
	render();

	window.addEventListener("mousemove", (event) => {
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		cursor.style.opacity = "1";
	});

	window.addEventListener("mouseleave", () => {
		cursor.classList.add("is-hidden");
	});

	window.addEventListener("mouseenter", () => {
		cursor.classList.remove("is-hidden");
		cursor.style.opacity = "1";
	});

	const interactiveSelectors = "a, button, [role='button'], [data-cursor='interactive']";
	const interactiveElements = document.querySelectorAll(interactiveSelectors);

	interactiveElements.forEach((element) => {
		element.addEventListener("mouseenter", () => {
			gsap.to(cursor, {
				scale: 1.6,
				opacity: 0.5,
				borderRadius: "16px",
				duration: 0.25,
				ease: "power3.out",
			});
		});
		element.addEventListener("mouseleave", () => {
			gsap.to(cursor, {
				scale: 1,
				opacity: 1,
				borderRadius: "9999px",
				duration: 0.25,
				ease: "power3.out",
			});
		});
	});
};

const initSmoothScroll = () => {
	if (prefersReducedMotion()) {
		return;
	}
	document.documentElement.style.scrollBehavior = "smooth";
};

const ensureBackgroundLayer = () => {
	let layer = document.querySelector(".animated-bg-layer");
	if (layer) {
		return layer;
	}

	layer = document.createElement("div");
	layer.className =
		"animated-bg-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden";

	const blobCount = window.innerWidth <= 768 ? 2 : 5;
	for (let i = 0; i < blobCount; i++) {
		const blob = document.createElement("div");
		blob.className = "animated-bg-blob";
		layer.append(blob);
	}
	document.body.prepend(layer);
	return layer;
};

const initBackgroundBlobs = () => {
	if (prefersReducedMotion()) return;

	const layer = ensureBackgroundLayer();
	const blobs = layer.querySelectorAll(".animated-bg-blob");

	// Styles de base
	const blobStyles = document.createElement("style");
	blobStyles.textContent = `
		.animated-bg-layer {
			background: radial-gradient(circle at top left, rgba(255,102,0,0.08), transparent 55%);
			position: fixed;
			inset: 0;
			z-index: -10;
			will-change: transform;
		}
		.animated-bg-blob {
			position: absolute;
			width: 420px;
			height: 420px;
			filter: blur(120px);
			border-radius: 9999px;
			background: rgba(255,102,0,0.28);
			opacity: 0.45;
			transform-origin: center;
			will-change: transform;
		}
		@media (max-width: 1024px) {
			.animated-bg-blob {
				width: 260px;
				height: 260px;
				filter: blur(90px);
				opacity: 0.3;
			}
		}
	`;
	document.head.append(blobStyles);

	blobs.forEach((blob, index) => {
		if (!(blob instanceof HTMLElement)) return;

		// Distribution régulière sur toute la page
		const y = `${(index / blobs.length) * 100}%`;
		const x = index % 2 === 0 ? "20%" : "80%";
		blob.style.left = x;
		blob.style.top = y;

		// Animation lente et fluide
		gsap.to(blob, {
			duration: 20 + index * 4,
			xPercent: gsap.utils.random(-18, 18, 1),
			yPercent: gsap.utils.random(-18, 18, 1),
			scale: gsap.utils.random(0.9, 1.4),
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});

		// Suivi du scroll global (optionnel, pour un effet léger)
		ScrollTrigger.create({
			trigger: document.body,
			start: "top top",
			end: "bottom bottom",
			onUpdate: (self) => {
				const progress = self.progress;
				gsap.to(blob, {
					yPercent: gsap.utils.mapRange(0, 1, -25, 25, progress),
					overwrite: "auto",
					duration: 1,
					ease: "sine.out",
				});
			},
		});
	});
};

const init = () => {
	initScrollAnimations();
	initHeroParallax();
	initCursor();
	initBackgroundBlobs();
	initSmoothScroll();
};

if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init, { once: true });
	} else {
		init();
	}
}
