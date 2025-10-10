import { SNDPROProcess } from '../types/sndpro';

export const sndproProcesses: SNDPROProcess[] = [
    {
        id: 'fortnite',
        name: 'Creating Fortnite',
        description: 'Update PJP weeks in cycle',
        scripts: [
            {
                id: 'update-weeks-cycle',
                title: 'Update Weeks in Cycle',
                description: 'Updates the weeks_in_cycle field in pjp_head table',
                script: "UPDATE pjp_head SET weeks_in_cycle='2' WHERE pjp='pjpcode'"
            }
        ]
    },
    {
        id: 'distributor-info',
        name: 'Distributor Information',
        description: 'View distributor details',
        scripts: [
            {
                id: 'view-distributors',
                title: 'View All Distributors',
                description: 'Display all distributor information',
                script: 'SELECT * FROM DISTRIBUTOR'
            },
            {
                id: 'working-date',
                title: 'Display Working Date',
                description: 'Show working date from distributor',
                script: 'SELECT WORKING_DATE FROM DISTRIBUTOR'
            }
        ]
    }
];