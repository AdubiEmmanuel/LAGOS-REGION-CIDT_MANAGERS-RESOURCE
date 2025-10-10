export interface ResourceLink {
    id: string;
    title: string;
    url: string;
    description?: string;
    category: string;
}

export interface ResourceSection {
    id: string;
    title: string;
    links: ResourceLink[];
}