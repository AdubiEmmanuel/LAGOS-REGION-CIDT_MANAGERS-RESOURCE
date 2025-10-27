export const getOfficeViewerUrl = (fileUrl: string): string => {
    // Ensure we have an absolute URL so external viewers can fetch the file
    let absoluteUrl = fileUrl;
    try {
        // If running in browser and fileUrl is relative, prepend origin
        if (typeof window !== 'undefined' && fileUrl.startsWith('/')) {
            absoluteUrl = `${window.location.origin}${fileUrl}`;
        }
    } catch (e) {
        // ignore - fallback to provided fileUrl
    }

    const encodedUrl = encodeURIComponent(absoluteUrl);

    // Prefer Microsoft Office online viewer which supports more office formats
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
};

export const isOfficeFile = (fileType: string): boolean => {
    return ['xlsx', 'xls', 'pptx', 'ppt', 'doc', 'docx'].includes(fileType);
};