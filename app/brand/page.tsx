import { AyniMark } from "@/components/brand/ayni-mark";
import { LandscapeArt } from "@/components/brand/landscape-art";
import { Panel } from "@/components/brand/panel";

const FOREST = "#0A1F12";
const FOREST_2 = "#0F2A1B";
const CREAM = "#F5F1E8";
const CREAM_2 = "#EEE8D8";

const COLOR_SWATCHES = [
  { name: "Primary", token: "primary", hex: "#04A033" },
  { name: "Secondary", token: "secondary", hex: "#DDFFE7" },
  { name: "Forest", token: "forest", hex: "#053D1F" },
  { name: "Cream", token: "cream", hex: "#F5F1E8" },
  { name: "Black 2", token: "black-2", hex: "#1D1D1D" },
] as const;

const TYPE_SCALE = [
  { label: "H1", size: 56, weight: 700 },
  { label: "H4", size: 32, weight: 700 },
  { label: "Body", size: 16, weight: 400 },
  { label: "Small", size: 14, weight: 400 },
] as const;

export default function BrandPage() {
  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: FOREST }}>
      <BrandHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-[1440px] mx-auto">
        <LogoCoverPanel />
        <ConstructionPanel />
        <TaglinePanel />
        <ColorSystemPanel />
        <TypographyPanel />
        <DigitalApplicationPanel />
        <PhysicalApplicationPanel />
        <ImageDirectionPanel />
        <SystemDetailPanel />
      </div>

      <BrandFooter />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Header / Footer
// ────────────────────────────────────────────────────────────

function BrandHeader() {
  return (
    <div className="max-w-[1440px] mx-auto mb-8 flex items-end justify-between text-white">
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
          AYNI — Identity System
        </p>
        <h1 className="text-h4 font-bold mt-2">Brand Guidelines · v1.0</h1>
      </div>
      <p className="text-sm opacity-60 max-w-xs text-right">
        Visión computacional offline-first para la detección temprana de plagas
        en hojas de café. Villa Rica, Perú.
      </p>
    </div>
  );
}

function BrandFooter() {
  return (
    <div className="max-w-[1440px] mx-auto mt-8 flex items-center justify-between text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
      <span>UPC · Ingeniería de Software</span>
      <span>Reciprocidad · Hoja sana · Cosecha cuidada</span>
      <span>2025 – 2026</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Panels
// ────────────────────────────────────────────────────────────

function LogoCoverPanel() {
  return (
    <Panel
      label="Logotype"
      labelTone="dark"
      style={{ backgroundColor: CREAM }}
      className="aspect-[4/3]"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AyniMark size={140} background={null} fill="#053D1F" veinColor={CREAM} />
        <p
          className="mt-6 text-black-2 font-bold tracking-tight"
          style={{ fontSize: 56, lineHeight: "0.95" }}
        >
          AYNI
        </p>
        <p className="mt-3 text-xs tracking-[0.4em] uppercase text-black-2/60">
          Agri-tech · for coffee
        </p>
      </div>
    </Panel>
  );
}

function ConstructionPanel() {
  return (
    <Panel
      label="Geometry"
      labelTone="light"
      style={{ backgroundColor: FOREST_2 }}
      className="aspect-[4/3] text-white"
    >
      <div className="flex-1 grid grid-cols-2 gap-4 items-center pt-2">
        <div className="flex items-center justify-center">
          <div className="text-primary">
            <AyniMark
              size={150}
              background={null}
              fill="currentColor"
              veinColor={FOREST_2}
              showConstruction
            />
          </div>
        </div>
        <ul className="text-xs text-white/70 space-y-3 leading-relaxed">
          <li>
            <span className="text-white/40 mr-2">01</span>
            Silueta hoja-escudo.
          </li>
          <li>
            <span className="text-white/40 mr-2">02</span>
            Vena central en eje vertical.
          </li>
          <li>
            <span className="text-white/40 mr-2">03</span>
            Letra A formada por venas laterales.
          </li>
          <li>
            <span className="text-white/40 mr-2">04</span>
            Proporción 6:7 sobre grid base 12.
          </li>
        </ul>
      </div>
    </Panel>
  );
}

function TaglinePanel() {
  return (
    <Panel
      label="Promise"
      labelTone="light"
      style={{ backgroundColor: "#04A033" }}
      className="aspect-[4/3] text-white"
    >
      <div className="flex-1 flex flex-col justify-between pt-4">
        <div>
          <p
            className="font-bold leading-[0.95] tracking-tight"
            style={{ fontSize: 64 }}
          >
            Cuida
            <br />
            cada hoja.
          </p>
        </div>
        <p className="text-sm leading-relaxed max-w-xs text-white/85">
          Ayni significa reciprocidad en quechua. Detectamos a tiempo lo que la
          hoja calla — y devolvemos al caficultor el cuidado de su cosecha.
        </p>
      </div>
    </Panel>
  );
}

function ColorSystemPanel() {
  return (
    <Panel
      label="Color System"
      labelTone="dark"
      style={{ backgroundColor: CREAM_2 }}
      className="aspect-[4/3]"
    >
      <div className="flex-1 flex flex-col justify-end gap-3 pt-2">
        <div className="grid grid-cols-5 gap-2">
          {COLOR_SWATCHES.map((c) => (
            <div key={c.token} className="flex flex-col gap-2">
              <div
                className="aspect-square rounded-xl border border-black-2/10"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <p className="text-[11px] font-bold text-black-2 leading-tight">
                  {c.name}
                </p>
                <p className="text-[10px] font-mono text-black-2/50 tracking-tight">
                  {c.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function TypographyPanel() {
  return (
    <Panel
      label="Typography · Nunito"
      labelTone="dark"
      style={{ backgroundColor: CREAM }}
      className="aspect-[4/3]"
    >
      <div className="flex-1 grid grid-cols-2 gap-4 items-center pt-2">
        <div>
          <p
            className="text-black-2 font-bold leading-[0.9]"
            style={{ fontSize: 180 }}
          >
            Aa
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-black-2/50 mt-2">
            400 · 600 · 700
          </p>
        </div>
        <ul className="space-y-2">
          {TYPE_SCALE.map((t) => (
            <li
              key={t.label}
              className="flex items-baseline justify-between gap-3 border-b border-black-2/10 pb-2"
            >
              <span
                className="text-black-2 leading-none truncate"
                style={{ fontSize: Math.min(t.size, 28), fontWeight: t.weight }}
              >
                Caficultor
              </span>
              <span className="text-[10px] font-mono text-black-2/50 shrink-0">
                {t.label} · {t.size}/{t.weight}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function DigitalApplicationPanel() {
  return (
    <Panel
      label="Digital Application"
      labelTone="light"
      style={{ backgroundColor: FOREST_2 }}
      className="aspect-[4/3]"
    >
      <div className="flex-1 flex items-center justify-center pt-2">
        <div className="w-full bg-white rounded-xl overflow-hidden border border-white/10">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-5 border-b border-gray-5">
            <span className="w-2 h-2 rounded-full bg-error/60" />
            <span className="w-2 h-2 rounded-full bg-warning/60" />
            <span className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="ml-3 flex-1 bg-white rounded-md px-2 py-0.5 text-[10px] text-gray-3 font-mono">
              ayni.farm/admin
            </div>
          </div>
          {/* App preview */}
          <div className="flex">
            <div className="w-16 bg-white border-r border-gray-5 p-2 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <AyniMark size={18} background={null} fill="#fff" veinColor="#04A033" />
              </div>
              <div className="h-1.5 w-10 rounded-full bg-secondary" />
              <div className="h-1.5 w-8 rounded-full bg-gray-5" />
              <div className="h-1.5 w-9 rounded-full bg-gray-5" />
            </div>
            <div className="flex-1 p-3">
              <div className="h-2 w-24 rounded bg-black-2 mb-2" />
              <div className="h-1.5 w-32 rounded bg-gray-5 mb-3" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-secondary" />
                  <div className="h-1.5 flex-1 rounded bg-gray-5" />
                  <div className="h-3 w-10 rounded-full bg-secondary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-gray-5" />
                  <div className="h-1.5 flex-1 rounded bg-gray-5" />
                  <div className="h-3 w-10 rounded-full bg-gray-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-secondary" />
                  <div className="h-1.5 flex-1 rounded bg-gray-5" />
                  <div className="h-3 w-10 rounded-full bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PhysicalApplicationPanel() {
  return (
    <Panel
      label="Physical · Seal"
      labelTone="dark"
      style={{ backgroundColor: CREAM_2 }}
      className="aspect-[4/3]"
    >
      <div className="flex-1 flex items-center justify-center pt-2">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden>
            <title>AYNI seal</title>
            <defs>
              <path
                id="circlePath"
                d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0"
                fill="none"
              />
            </defs>
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="#053D1F"
              strokeWidth="1.5"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#053D1F"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            <text
              fontSize="9"
              fontWeight="700"
              fill="#053D1F"
              letterSpacing="4"
            >
              <textPath href="#circlePath" startOffset="0">
                AYNI · CUIDA CADA HOJA · VILLA RICA · 2026 ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AyniMark size={72} background={null} fill="#053D1F" veinColor={CREAM_2} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ImageDirectionPanel() {
  return (
    <Panel
      label="Image Direction"
      labelTone="light"
      className="aspect-[4/3] text-white"
      style={{ backgroundColor: FOREST }}
    >
      <div className="flex-1 relative -mx-6 -mb-6 mt-3 overflow-hidden rounded-b-2xl">
        <LandscapeArt className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/70">
            Selva alta · Pasco
          </p>
          <p className="text-[10px] font-mono text-white/40">
            -10.71°, -75.35°
          </p>
        </div>
      </div>
    </Panel>
  );
}

function SystemDetailPanel() {
  return (
    <Panel
      label="System Detail"
      labelTone="light"
      style={{ backgroundColor: FOREST_2 }}
      className="aspect-[4/3] text-white"
    >
      <div className="flex-1 flex flex-col justify-end gap-3 pt-2">
        <div className="flex flex-wrap gap-2">
          <Chip bg="bg-secondary" text="text-primary">
            Farmer
          </Chip>
          <Chip bg="bg-[#E8F1FF]" text="text-[#3B6FE0]">
            Agronomist
          </Chip>
          <Chip bg="bg-black-2" text="text-white">
            Admin
          </Chip>
          <Chip bg="bg-secondary" text="text-primary" dot="bg-primary">
            Active
          </Chip>
          <Chip bg="bg-gray-5" text="text-gray-2" dot="bg-gray-3">
            Inactive
          </Chip>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            className="h-9 px-4 rounded-full bg-primary text-white text-xs font-bold"
          >
            + New Report
          </button>
          <button
            type="button"
            className="h-9 px-4 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20"
          >
            Filters
          </button>
          <div className="h-9 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            ml-pipeline · healthy
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Chip({
  bg,
  text,
  dot,
  children,
}: {
  bg: string;
  text: string;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 rounded-full px-3 text-xs font-bold ${bg} ${text}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  );
}
