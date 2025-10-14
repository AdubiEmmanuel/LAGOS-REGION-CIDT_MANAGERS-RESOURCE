import { 
    Container, 
    AppBar, 
    Toolbar, 
    Typography, 
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    useMediaQuery,
    useTheme,
    Divider,
    Fab,
    Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { ResourceSection } from '../../components/ResourceSection/ResourceSection';
import { SNDPROSection } from '../../components/SNDPROSection/SNDPROSection';
import { HowToSection } from '../../components/HowToSection/HowToSection';
import { DocNumberFormatter } from '../../components/DocNumberFormatter/DocNumberFormatter';
import { LeveredgeSection } from '../../components/LeveredgeSection/LeveredgeSection';
import { gfcsSection } from '../../utils/gfcsLinks';
import { sndproProcesses } from '../../utils/sndproData';
import { howToGuides } from '../../utils/howToData';
import { leveredgeResources } from '../../utils/leveredgeData';
import { useState } from 'react';

const DRAWER_WIDTH = 240;

export const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (isMobile) {
                setMobileOpen(false);
            }
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigationItems = [
        { id: 'doc-formatter', text: 'Document Formatter', icon: <FormatListNumberedIcon /> },
        { id: 'gfcs', text: 'GFCS Links', icon: <LinkIcon /> },
        { id: 'sndpro', text: 'SNDPRO', icon: <CodeIcon /> },
        { id: 'howto', text: 'How-To Guides', icon: <HelpIcon /> },
        { id: 'leveredge', text: 'Leveredge Resources', icon: <LibraryBooksIcon /> },
    ];

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Navigation
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {navigationItems.map((item) => (
                    <ListItem 
                        component="div"
                        key={item.id} 
                        onClick={() => scrollToSection(item.id)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            },
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="h1" color="primary" sx={{ flexGrow: 1 }}>
                        LAGOS REGION CDIT MANAGER RESOURCE
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: DRAWER_WIDTH,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: '100vh',
                    pt: { xs: 8, sm: 9 },
                }}
            >
                <Container maxWidth={false}>
                    <Paper 
                        id="doc-formatter" 
                        sx={{ 
                            p: 3, 
                            mb: 3,
                            scrollMarginTop: '64px'
                        }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom>
                            Document Number Formatter
                        </Typography>
                        <DocNumberFormatter />
                    </Paper>
                    <ResourceSection section={gfcsSection} />
                    <SNDPROSection processes={sndproProcesses} />
                    <HowToSection guides={howToGuides} />
                    <LeveredgeSection resources={leveredgeResources} />
                </Container>

                <Fab
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        display: 'flex',
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Box>
    );
};