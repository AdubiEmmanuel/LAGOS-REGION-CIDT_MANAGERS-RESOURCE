export interface StepScript {
    id: string;
    order: number;
    description: string;
    script: string;
}

export interface HowToGuide {
    id: string;
    title: string;
    description: string;
    prerequisites?: string[];
    steps: StepScript[];
    notes?: string[];
}