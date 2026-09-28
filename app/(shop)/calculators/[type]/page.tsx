import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrickWall, Grid2x2, Layers, Mountain, PaintRoller, Ruler } from "lucide-react";
import { CALCULATORS, type CalculatorType } from "@/lib/utils/calculators";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CalculatorForm } from "@/components/calculators/CalculatorForm";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<CalculatorType, React.ComponentType<{ className?: string }>> = { cement: Layers, bricks: BrickWall, tiles: Grid2x2, paint: PaintRoller, steel: Ruler, sand: Mountain };

type Props = { params: Promise<{ type: string }> };

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ type: c.type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const c = CALCULATORS.find((x) => x.type === type);
  return c ? { title: `${c.title} — Free Material Estimator`, description: c.description, alternates: { canonical: `/calculators/${c.type}` } } : { title: "Calculator" };
}

export default async function CalculatorPage({ params }: Props) {
  const { type } = await params;
  const calc = CALCULATORS.find((c) => c.type === type);
  if (!calc) notFound();
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Calculators", href: "/calculators/cement" }, { label: calc.title }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{calc.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{calc.description}</p>
      <nav aria-label="Calculators" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {CALCULATORS.map((c) => {
          const Icon = ICONS[c.type];
          return (
            <Link key={c.type} href={`/calculators/${c.type}`} aria-current={c.type === type ? "page" : undefined} className={cn("flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold", c.type === type ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600")}>
              <Icon className="size-4" /> {c.title.replace(" Calculator", "")}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">
        <CalculatorForm type={calc.type} />
      </div>
    </div>
  );
}
