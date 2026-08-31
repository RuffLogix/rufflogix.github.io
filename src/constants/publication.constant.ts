import type { PublicationInformation } from "../types/publication.d.ts";

export const publicationInformation: PublicationInformation[] = [
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
