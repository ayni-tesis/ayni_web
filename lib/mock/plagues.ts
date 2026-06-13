import type { Plague } from "@/lib/api/types";

/**
 * Catálogo de plagas mock — basado en las 5 plagas foliares objetivo del proyecto
 * (CLAUDE.md §1). Las descripciones evitan claims que el modelo aún no puede
 * sostener (e.g. "100% detección"); priorizamos información de campo verificable.
 */
export const MOCK_PLAGUES: Plague[] = [
  {
    id: "rust",
    commonName: "Roya del cafeto",
    scientificName: "Hemileia vastatrix",
    description:
      "Hongo devastador que cubre el envés de la hoja con un polvo anaranjado. Provoca defoliación prematura y reduce el rendimiento hasta en 50%.",
    severity: "CRITICAL",
    tags: ["FUNGUS", "LEAVES"],
    imageUrl: null,
    estimatedLossPercent: 50,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-03-15T09:30:00Z",
  },
  {
    id: "borer",
    commonName: "Broca del café",
    scientificName: "Hypothenemus hampei",
    description:
      "Coleóptero diminuto que perfora el fruto del café para depositar sus huevos. Destruye el grano antes de la cosecha y puede afectar entre 30% y 80% del cultivo.",
    severity: "HIGH_RISK",
    tags: ["INSECT", "CHERRY"],
    imageUrl: null,
    estimatedLossPercent: 80,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-04-02T14:15:00Z",
  },
  {
    id: "miner",
    commonName: "Minador de la hoja",
    scientificName: "Leucoptera coffeella",
    description:
      "Las larvas se alimentan dentro de la hoja y forman lesiones necróticas en forma de galería. Reduce la superficie fotosintética y puede afectar hasta 50% del fruto.",
    severity: "MODERATE",
    tags: ["INSECT", "LEAVES"],
    imageUrl: null,
    estimatedLossPercent: 50,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-02-20T11:00:00Z",
  },
  {
    id: "phoma",
    commonName: "Phoma del cafeto",
    scientificName: "Phyllasticta coffeicola",
    description:
      "Conocida como quema, causa manchas pardas con halo amarillo y caída prematura del fruto. Avanza rápido en condiciones húmedas y zonas de altura.",
    severity: "HIGH_RISK",
    tags: ["FUNGUS", "LEAVES", "CHERRY"],
    imageUrl: null,
    estimatedLossPercent: 35,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-01-10T08:45:00Z",
  },
  {
    id: "cercospora",
    commonName: "Cercosporiosis",
    scientificName: "Cercospora coffeicola",
    description:
      "Genera manchas circulares de color marrón con centro grisáceo. En estado severo afecta entre 15% y 30% de la productividad de la planta.",
    severity: "MODERATE",
    tags: ["FUNGUS", "LEAVES"],
    imageUrl: null,
    estimatedLossPercent: 30,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-03-28T16:20:00Z",
  },
];
