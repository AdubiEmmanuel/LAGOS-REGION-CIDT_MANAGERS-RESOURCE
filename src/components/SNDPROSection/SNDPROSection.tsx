import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { SNDPROProcess } from '../../types/sndpro';
import { SQLScriptCard } from '../SQLScriptCard/SQLScriptCard';
import { DocNumberFormatter } from '../DocNumberFormatter/DocNumberFormatter';

interface SNDPROSectionProps {
    processes: SNDPROProcess[];
}

export const SNDPROSection = ({ processes }: SNDPROSectionProps) => {
    return (
        <Paper 
            id="sndpro" 
            sx={{ 
                p: 3, 
                mb: 3,
                scrollMarginTop: '64px'
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom>
                SNDPRO Processes
            </Typography>
            <Box sx={{ mt: 2 }}>
                {processes.map((process) => (
                    <Accordion key={process.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${process.id}-content`}
                            id={`${process.id}-header`}
                        >
                            <Typography variant="h6">{process.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {process.description}
                            </Typography>
                            {process.id === 'resolve-fibn-da' && (
                                <Box sx={{ mb: 3 }}>
                                    <DocNumberFormatter />
                                </Box>
                            )}
                            {process.scripts.map((script) => (
                                <SQLScriptCard key={script.id} script={script} />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Paper>
    );
};