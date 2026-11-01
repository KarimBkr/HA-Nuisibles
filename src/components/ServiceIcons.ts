import { Bird, Bug, BugOff, Hexagon, Rat, SprayCan, Wind } from "lucide-react";
import type { Service } from "@/config/services";

export const ICONS: Record<Service["icon"], typeof Rat> = { Rat, Bug, BugOff, Hexagon, Bird, Wind, SprayCan };
