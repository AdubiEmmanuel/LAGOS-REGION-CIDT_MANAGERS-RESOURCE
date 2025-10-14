export const getOfficeViewerUrl = (fileUrl: string): string => {
    // Encode the file URL to be used as a parameter
    const encodedUrl = encodeURIComponent(fileUrl);
    
    // Use Google Docs viewer which works better with localhost
    return `https://docs.google.com/viewer?embedded=true&url=${encodedUrl}`;
};

export const isOfficeFile = (fileType: string): boolean => {
    return ['xlsx', 'xls', 'pptx', 'ppt', 'doc', 'docx'].includes(fileType);
};