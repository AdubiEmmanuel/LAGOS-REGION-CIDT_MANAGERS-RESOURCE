import { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import { formatDocNumbers } from '../../utils/formatters';

export const DocNumberFormatter = () => {
    const [input, setInput] = useState('');
    const [formatted, setFormatted] = useState('');
    const [copied, setCopied] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleFormat = () => {
        const formattedText = formatDocNumbers(input);
        setFormatted(formattedText);
    };

    const handleClear = () => {
        setInput('');
        setFormatted('');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formatted);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleCloseCopiedAlert = () => {
        setCopied(false);
    };

    return (
        <Paper sx={{ p: 3, mb: 3, maxWidth: '800px' }}>
            <Typography variant="h6" gutterBottom>
                Document Number Formatter
            </Typography>
            
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Paste your document numbers here (one per line or separated by spaces/commas)"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleFormat}
                        disabled={!input}
                    >
                        Format Numbers
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleClear}
                        disabled={!input && !formatted}
                        color="secondary"
                        startIcon={<ClearIcon />}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>

            {formatted && (
                <Paper 
                    sx={{ 
                        p: 2, 
                        bgcolor: 'grey.100',
                        position: 'relative',
                        wordBreak: 'break-word'
                    }}
                >
                    <IconButton
                        onClick={handleCopy}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <ContentCopyIcon />
                    </IconButton>
                    <Typography 
                        component="pre" 
                        sx={{ 
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            mr: 4
                        }}
                    >
                        {formatted}
                    </Typography>
                </Paper>
            )}

            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={handleCloseCopiedAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Copied to clipboard!
                </Alert>
            </Snackbar>
        </Paper>
    );
};