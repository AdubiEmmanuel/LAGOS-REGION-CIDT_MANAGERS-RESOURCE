export interface SQLScript {
    id: string;
    title: string;
    description: string;
    script: string;
}

export interface SNDPROProcess {
    id: string;
    name: string;
    description: string;
    scripts: SQLScript[];
}