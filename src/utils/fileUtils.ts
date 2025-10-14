export const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    // Normalize Office file extensions
    if (extension === 'pptx' || extension === 'ppt') {
        return 'pptx';
    }
    if (extension === 'xlsx' || extension === 'xls') {
        return 'xlsx';
    }
    return extension;
};

export const isPreviewable = (fileType: string): boolean => {
    const previewableTypes = ['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif'];
    return previewableTypes.includes(fileType);
};

export const getFileSize = async (fileUrl: string): Promise<string> => {
    try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        const sizeInMB = size ? Math.round((parseInt(size) / (1024 * 1024)) * 100) / 100 : 0;
        return `${sizeInMB} MB`;
    } catch (error) {
        console.error('Error getting file size:', error);
        return 'Unknown';
    }
};

export const formatFileName = (fileName: string): string => {
    // Remove the extension and replace hyphens/underscores with spaces
    const nameWithoutExt = fileName.split('.')[0].replace(/[-_]/g, ' ');
    
    // Capitalize first letter of each word
    const formattedName = nameWithoutExt
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Truncate if longer than 40 characters
    return formattedName.length > 40 ? formattedName.substring(0, 37) + '...' : formattedName;
};