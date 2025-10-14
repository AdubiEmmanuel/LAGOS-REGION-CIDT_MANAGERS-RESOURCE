import { 
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import type { LeveredgeResource } from '../../types/leveredge';
import { isPreviewable } from '../../utils/fileUtils';
import { getOfficeViewerUrl, isOfficeFile } from '../../utils/officeViewer';

interface ResourceCardProps {
    resource: LeveredgeResource;
    onDelete: (filename: string) => void;
    onRename: (oldFilename: string, newName: string) => void;
}

interface PreviewDialogProps {
    open: boolean;
    onClose: () => void;
    resource: LeveredgeResource;
}

const PreviewDialog = ({ open, onClose, resource }: PreviewDialogProps) => {
    // Determine how to display the content based on file type
    const getViewerContent = () => {
        const fileUrl = resource.fileUrl.toLowerCase();
        const isOffice = isOfficeFile(resource.fileUrl);
        const viewerUrl = isOffice ? getOfficeViewerUrl(resource.fileUrl) : resource.fileUrl;
        
        if (fileUrl.endsWith('.pdf')) {
            return (
                <object
                    data={viewerUrl}
                    type="application/pdf"
                    style={{ width: '100%', height: '100%' }}
                >
                    <iframe 
                        src={viewerUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={resource.title}
                    />
                </object>
            );
        }
        
        if (isOffice) {
            return (
                <iframe 
                    src={viewerUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title={resource.title}
                />
            );
        }

        // For images
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].some(ext => fileUrl.endsWith(ext))) {
            return (
                <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: '#000'
                }}>
                    <img 
                        src={viewerUrl} 
                        alt={resource.title}
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain' 
                        }}
                    />
                </Box>
            );
        }

        // For text files, code files, etc.
        if (['.txt', '.csv', '.json', '.xml', '.log', '.js', '.ts', '.html', '.css'].some(ext => fileUrl.endsWith(ext))) {
            return (
                <iframe 
                    src={viewerUrl}
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none',
                        backgroundColor: '#fff' 
                    }}
                    title={resource.title}
                />
            );
        }

        // Default viewer - attempt to display in iframe or provide download option
        return (
            <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 2
            }}>
                <Typography variant="h6">
                    Preview not available for this file type
                </Typography>
                <Button 
                    variant="contained" 
                    href={viewerUrl} 
                    target="_blank"
                    startIcon={<DownloadIcon />}
                >
                    Download to View
                </Button>
            </Box>
        );
    };
    
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xl"
            fullScreen
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                left: 0,
                zIndex: 1,
                bgcolor: 'background.paper',
                boxShadow: 1
            }}>
                {resource.title}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ 
                height: '100vh', 
                p: '0 !important', 
                pt: '64px !important',
                bgcolor: '#f5f5f5'
            }}>
                {getViewerContent()}
            </DialogContent>
        </Dialog>
    );
};

const RenameDialog = ({ 
    open, 
    onClose, 
    resource,
    onRename
}: {
    open: boolean;
    onClose: () => void;
    resource: LeveredgeResource;
    onRename: (oldFilename: string, newName: string) => void;
}) => {
    const [newName, setNewName] = useState(resource.name);
    const [error, setError] = useState<string | null>(null);

    const handleRename = () => {
        if (!newName.trim()) {
            setError('File name cannot be empty');
            return;
        }
        onRename(resource.name, newName.trim());
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Rename File</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="New File Name"
                    type="text"
                    fullWidth
                    value={newName}
                    onChange={(e) => {
                        setNewName(e.target.value);
                        setError(null);
                    }}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleRename}>Rename</Button>
            </DialogActions>
        </Dialog>
    );
};

export const ResourceCard = ({ resource, onDelete, onRename }: ResourceCardProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const getFileIcon = () => {
        switch (resource.fileType) {
            case 'pdf':
                return <PictureAsPdfIcon />;
            case 'xlsx':
            case 'xls':
                return <TableChartIcon />;
            case 'pptx':
            case 'ppt':
                return <SlideshowIcon />;
            default:
                return <DescriptionIcon />;
        }
    };

    // All files are now previewable
    const isPreviewableFile = true;
    
    // Determine if we should use Office Viewer or direct URL
    const shouldUseOfficeViewer = isOfficeFile(resource.fileUrl);
    
    return (
        <>
            <Card 
                sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column'
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        {getFileIcon()}
                        <Typography variant="subtitle1" sx={{ ml: 1, wordBreak: 'break-word' }}>
                            {resource.title}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Size: {resource.fileSize}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Category: {resource.category}
                    </Typography>
                    {resource.uploadDate && (
                        <Typography variant="body2" color="text.secondary">
                            Uploaded: {new Date(resource.uploadDate).toLocaleDateString()}
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    {isPreviewableFile && (
                        <IconButton 
                            onClick={() => setPreviewOpen(true)}
                            title="View"
                            color="primary"
                        >
                            <VisibilityIcon />
                        </IconButton>
                    )}
                    <IconButton 
                        onClick={() => window.open(resource.fileUrl, '_blank')}
                        title="Download"
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => setRenameOpen(true)}
                        title="Rename"
                    >
                        <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => setDeleteConfirmOpen(true)}
                        title="Delete"
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>

            {/* Preview Dialog */}
            {previewOpen && (
                <PreviewDialog 
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    resource={resource}
                />
            )}

            {/* Rename Dialog */}
            <RenameDialog 
                open={renameOpen}
                onClose={() => setRenameOpen(false)}
                resource={resource}
                onRename={onRename}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={() => {
                            onDelete(resource.name);
                            setDeleteConfirmOpen(false);
                        }}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};