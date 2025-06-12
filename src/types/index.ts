import { LucideIcon } from "lucide-react";
import type React from "react";
export interface Channel {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	component: React.ComponentType;
}

export interface Server {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
	channels: Channel[];
}

export interface Skill {
	name: string;
	years: string;
	level: string;
	color: string;
}

export interface Project {
	title: string;
	description: string;
	tech: string[];
	url?: string;
	status: string;
	timestamp: string;
}

export interface Experience {
	role: string;
	company: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
}
