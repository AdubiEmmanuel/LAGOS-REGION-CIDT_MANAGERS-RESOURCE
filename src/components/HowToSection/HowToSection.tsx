import { 
    Box, 
    Typography, 
    Paper, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stepper,
    Step,
    StepLabel,
    StepContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import type { HowToGuide } from '../../types/howTo';
import { SQLScriptCard } from '../SQLScriptCard/SQLScriptCard';

interface HowToSectionProps {
    guides: HowToGuide[];
}

export const HowToSection = ({ guides }: HowToSectionProps) => {
    return (
        <Paper 
            id="howto" 
            sx={{ 
                p: 3, 
                mb: 3,
                scrollMarginTop: '64px'
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom>
                How-To Guides
            </Typography>
            <Box sx={{ mt: 2 }}>
                {guides.map((guide) => (
                    <Accordion key={guide.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${guide.id}-content`}
                            id={`${guide.id}-header`}
                        >
                            <Typography variant="h6">{guide.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" paragraph>
                                {guide.description}
                            </Typography>

                            {guide.prerequisites && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <InfoIcon sx={{ mr: 1 }} /> Prerequisites
                                    </Typography>
                                    <List dense>
                                        {guide.prerequisites.map((prereq, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={prereq} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            <Stepper orientation="vertical">
                                {guide.steps.map((step) => (
                                    <Step key={step.id} active={true}>
                                        <StepLabel>
                                            {step.description}
                                        </StepLabel>
                                        <StepContent>
                                            <SQLScriptCard 
                                                script={{
                                                    id: step.id,
                                                    title: `Step ${step.order}`,
                                                    description: step.description,
                                                    script: step.script
                                                }}
                                            />
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>

                            {guide.notes && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WarningIcon sx={{ mr: 1 }} /> Important Notes
                                    </Typography>
                                    <List dense>
                                        {guide.notes.map((note, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <InfoIcon color="info" />
                                                </ListItemIcon>
                                                <ListItemText primary={note} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Paper>
    );
};