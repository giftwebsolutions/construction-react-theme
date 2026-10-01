import { Plane, Fan, Flame, BrickWall, Construction, DoorOpen, Drill, Droplets, Factory, Grid2x2, Hammer, HardHat, House, Mountain, PaintRoller, Pipette, Plug, ShowerHead, Trees, type LucideProps } from "lucide-react";
import type { CategoryIconName } from "@/types";

const ICONS: Record<CategoryIconName, React.ComponentType<LucideProps>> = {
  plane: Plane, fan: Fan, flame: Flame,
  factory: Factory,
  construction: Construction,
  "brick-wall": BrickWall,
  mountain: Mountain,
  grid: Grid2x2,
  "paint-roller": PaintRoller,
  droplets: Droplets,
  pipette: Pipette,
  plug: Plug,
  "shower-head": ShowerHead,
  trees: Trees,
  "door-open": DoorOpen,
  house: House,
  hammer: Hammer,
  drill: Drill,
  "hard-hat": HardHat,
};

export function CategoryIcon({ name, ...props }: { name: CategoryIconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden {...props} />;
}
