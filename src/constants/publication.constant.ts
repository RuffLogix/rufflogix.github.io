import type { PublicationInformation } from "../types/publication.d.ts";

export const publicationInformation: PublicationInformation[] = [
  {
    title:
      "A Glossary Must Be Scoped to the Speech It Will Hear: Terminology Control for Live Thai-English Medical Captioning",
    authors: ["Teejuta Sriwaranon", "Monchai Lertsutthiwong"],
    selfAuthorIndex: 0,
    venue:
      "2026 21st International Joint Symposium on Artificial Intelligence and Natural Language Processing (iSAI-NLP)",
    date: "2026",
    type: "Conference Paper",
    status: "accepted",
    area: "Speech and Language Processing",
    abstract:
      "A deployed real-time Thai-English captioning system for medical conferences built around a deterministic term-protection layer: one curated glossary grounds an LLM correction stage over ASR finals, and protected terms are masked before a black-box MT call and restored afterwards, with an append-on-loss fallback. On 440 synthesized utterances with known ground truth, the best configuration reaches 90.0% term fidelity against 47.9% for corrected text through plain MT; on 54.1 minutes of real speech, a support check blocks 19 of 20 off-domain glossary insertions.",
    tags: [
      "Speech Translation",
      "Code-Switching",
      "Thai NLP",
      "Terminology Control",
      "Live Captioning",
      "Medical NLP",
    ],
  },
  {
    title:
      "Cross-Specimen Forecasting of Copper Oxidation Appearance for Physically Based Rendering",
    authors: [
      "Teejuta Sriwaranon",
      "Borworntat Dendumrongkul",
      "Tanapat Chamted",
      "Sirichai Leelachao",
      "Pizzanu Kanongchaiyos",
    ],
    selfAuthorIndex: 0,
    venue:
      "2026 30th International Computer Science and Engineering Conference (ICSEC)",
    date: "2026",
    type: "Conference Paper",
    status: "accepted",
    area: "Computer Graphics",
    abstract:
      "A system that observes a copper plate with a fixed camera, forecasts its appearance ten accelerated units ahead, and converts the forecast into metallic-roughness PBR maps. Under leave-one-recording-out evaluation across an accelerated-chamber and an open-air recording, a training-free global affine color extrapolation is the only method that beats repeating the last observed frame in both directions (+11.7% and +51.2%), while chamber-trained learned models improve only on held-back frames of their own recording.",
    tags: [
      "Appearance Forecasting",
      "PBR Material",
      "Computer Graphics",
      "Surface Oxidation",
      "Cross-Specimen Generalization",
    ],
  },
  {
    title:
      "Timed-Automata Verification of Payload-Link Supervision, Watchdog Gating, and A/B Boot Policy in STM32 Flight Software",
    authors: [
      "Borworntat Dendumrongkul",
      "Natdanai Hirunsirikul",
      "Teejuta Sriwaranon",
      "Phongsatorn Saisutjarit",
      "Pizzanu Kanongchaiyos",
    ],
    selfAuthorIndex: 2,
    venue:
      "2026 30th International Computer Science and Engineering Conference (ICSEC)",
    date: "2026",
    type: "Conference Paper",
    status: "accepted",
    area: "Formal Verification",
    abstract:
      "Verifies an abstracted design model of three interacting recovery mechanisms in an STM32 small-satellite flight-software prototype (payload-link supervision, a health-gated hardware watchdog, and a CRC-validated A/B bootloader) as UPPAAL timed automata. Across fifteen model configurations and 254 TCTL formulas every verdict matches a pre-declared oracle; model checking exposes one design defect, confirmed and fixed in source, and the verified bounds are checked against hash-verified hardware traces from 90 fault-injection trials.",
    tags: [
      "Formal Verification",
      "Timed Automata",
      "UPPAAL",
      "Embedded Systems",
      "Flight Software",
    ],
  },
  {
    title:
      "Formal Verification of DirectX11 Graphics Pipeline Using Colored Petri Nets",
    authors: [
      "Borworntat Dendumrongkul",
      "Teejuta Sriwaranon",
      "Nuengwong Tuaycharoen",
      "Wiwat Vatanawood",
    ],
    selfAuthorIndex: 1,
    venue:
      "2026 30th International Computer Science and Engineering Conference (ICSEC)",
    date: "2026",
    type: "Conference Paper",
    status: "accepted",
    area: "Formal Verification",
    abstract:
      "A compositional Colored Petri Net model of all ten stages of the DirectX 11 graphics pipeline, with the core rasterization path exhaustively verified against six LTL properties spanning safety, liveness, boundedness, and resource correctness. Breadth-first exploration reaches up to 208,905 states; a fault-injection matrix shows every checker is sensitive to its own fault, and two properties fail in stronger forms: per-lane starvation freedom under an arbitration policy DX11 permits, and token conservation under geometry-shader fan-out.",
    tags: [
      "Formal Verification",
      "Colored Petri Nets",
      "Graphics Pipeline",
      "DirectX 11",
      "Model Checking",
    ],
  },
  {
    title:
      "What Will This Copper Look Like Later? Forecasting Surface Appearance and Rendering It as a PBR Material",
    authors: [
      "Teejuta Sriwaranon",
      "Borworntat Dendumrongkul",
      "Tanapat Chamted",
      "Pizzanu Kanongchaiyos",
    ],
    selfAuthorIndex: 0,
    venue: "arXiv preprint (cs.GR, cs.CV)",
    date: "August 2026",
    type: "Preprint",
    area: "Computer Graphics",
    abstract:
      "A system that forecasts how copper surfaces evolve as they oxidize and renders the predicted appearance as a PBR material (albedo, normal, roughness, metallic) from a single camera observation. A learned spatio-temporal model underperforms last-frame copying on unseen specimens, while a closed-form global color extrapolation transfers successfully, improving accuracy by 13.4-16.7% depending on the prediction horizon, indicating that learned models encode specimen-specific corrosion patterns whereas global color trajectories generalize.",
    tags: [
      "Appearance Forecasting",
      "PBR Material",
      "Computer Graphics",
      "Surface Oxidation",
      "Spatio-Temporal Modeling",
    ],
    doi: "10.48550/arXiv.2608.28102",
    doiLink: "https://arxiv.org/abs/2608.28102",
    pdfLink: "https://arxiv.org/pdf/2608.28102",
    codeLink: "https://github.com/RuffLogix/kstep-copper-forecast",
  },
  {
    title:
      "An End-to-End Deep Learning Pipeline for Automated Mandible Virtual Surgical Planning Using Real-World Clinical Data",
    authors: [
      "Nattapon Kamboonsri",
      "Teejuta Sriwaranon",
      "Natdanai Tantisereepatana",
      "Chedtha Puncreobutr",
      "Boonrat Lohwongwatana",
      "Gregory B. Olson",
      "Alessandro Tel",
      "Massimo Robiony",
      "Titipat Achakulvisut",
      "Peerapon Vateekul",
    ],
    selfAuthorIndex: 1,
    venue: "IEEE Access",
    date: "June 2026",
    type: "Journal Article",
    area: "Medical Imaging AI",
    abstract:
      "An end-to-end deep learning pipeline that automates mandible virtual surgical planning from real-world clinical data, combining volumetric segmentation and reconstruction to streamline the workflow for maxillofacial surgery.",
    tags: [
      "Deep Learning",
      "Volumetric Segmentation",
      "Volumetric Reconstruction",
      "Automated Pipeline",
      "Virtual Surgical Planning",
    ],
    doi: "10.1109/ACCESS.2026.3702327",
    doiLink: "https://ieeexplore.ieee.org/document/11557298",
  },
  {
    title:
      "Fine-Grained Formal Verification of an Asynchronous Speaker Diarization Pipeline Using Hierarchical Timed Colored Petri Nets",
    authors: [
      "Teejuta Sriwaranon",
      "Nuengwong Tuaycharoen",
      "Wiwat Vatanawood",
    ],
    selfAuthorIndex: 0,
    venue:
      "2026 23rd International Joint Conference on Computer Science and Software Engineering (JCSSE)",
    date: "June 2026",
    type: "Conference Paper",
    area: "Formal Verification",
    abstract:
      "A fine-grained hierarchical Timed Colored Petri Net (HTCPN) model of an asynchronous speaker diarization pipeline that exposes three generalizable structural deadlock patterns in concurrent AI pipelines. Seven correctness properties are verified, including a novel attribution consistency property, showing that sub-module decomposition is necessary for complete pipeline verification.",
    tags: [
      "Formal Verification",
      "Hierarchical Petri Nets",
      "Speaker Diarization",
      "Reachability Analysis",
      "Deadlock Freedom",
      "Liveness",
    ],
    doi: "10.1109/JCSSE68839.2026.11597080",
    doiLink: "https://ieeexplore.ieee.org/document/11597080",
  },
];
