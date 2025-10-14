import type { LeveredgeResource } from '../types/leveredge';

export const leveredgeResources: LeveredgeResource[] = [
    {
        id: '1',
        title: 'Leveredge User Manual',
        description: 'Comprehensive guide for using the Leveredge system',
        fileUrl: '/resources/leveredge-manual.pdf',
        fileType: 'pdf',
        fileSize: '2.5 MB',
        uploadDate: '2024-01-15',
        category: 'Documentation'
    },
    {
        id: '2',
        title: 'Quick Start Guide',
        description: 'Get started with Leveredge in minutes',
        fileUrl: '/resources/quick-start.pdf',
        fileType: 'pdf',
        fileSize: '500 KB',
        uploadDate: '2024-01-15',
        category: 'Documentation'
    },
    {
        id: '3',
        title: 'Training Materials',
        description: 'Training slides and exercises',
        fileUrl: '/resources/training.pptx',
        fileType: 'pptx',
        fileSize: '5 MB',
        uploadDate: '2024-01-16',
        category: 'Training'
    },
    {
        id: '4',
        title: 'Configuration Template',
        description: 'Standard configuration template for Leveredge setup',
        fileUrl: '/resources/config-template.xlsx',
        fileType: 'xlsx',
        fileSize: '1 MB',
        uploadDate: '2024-01-17',
        category: 'Templates'
    }
];