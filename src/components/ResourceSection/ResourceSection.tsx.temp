import { Box, Typography, Link, Paper } from '@mui/material';
import type { ResourceSection as ResourceSectionType } from '../../types/links';

interface ResourceSectionProps {
    section: ResourceSectionType;
}

export const ResourceSection = ({ section }: ResourceSectionProps) => {
    return (
        <Paper 
            id={section.id} 
            sx={{ 
                p: 3, 
                mb: 3,
                scrollMarginTop: '64px'
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom>
                {section.title}
            </Typography>
            <Box sx={{ 
                display: 'grid', 
                gap: 2, 
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                }
            }}>
                {section.links.map((link) => (
                    <Paper
                        key={link.id}
                        elevation={2}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                            }
                        }}
                    >
                        <Typography variant="h6" component="h3" gutterBottom>
                            <Link 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {link.title}
                            </Link>
                        </Typography>
                        {link.description && (
                            <Typography variant="body2" color="text.secondary">
                                {link.description}
                            </Typography>
                        )}
                    </Paper>
                ))}
            </Box>
        </Paper>
    );
};