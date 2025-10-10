import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { SQLScript } from '../../types/sndpro';
import { useState } from 'react';

interface SQLScriptCardProps {
    script: SQLScript;
}

export const SQLScriptCard = ({ script }: SQLScriptCardProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(script.script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <Paper 
            elevation={2}
            sx={{ 
                p: 2,
                mb: 2,
                backgroundColor: '#f5f5f5',
                position: 'relative'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    {script.title}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton onClick={handleCopy} size="small">
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {script.description}
            </Typography>
            
            <Paper 
                sx={{ 
                    p: 2,
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: 'monospace',
                    overflow: 'auto'
                }}
            >
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {script.script}
                </Typography>
            </Paper>
        </Paper>
    );
};