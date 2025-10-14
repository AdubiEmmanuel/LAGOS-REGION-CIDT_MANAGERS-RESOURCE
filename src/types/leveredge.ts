export interface LeveredgeResource {
    id: string;
    name: string;
    title: string;
    description?: string;
    fileUrl: string;
    fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';
    fileSize?: string;
    uploadDate: string;
    category?: string;
}