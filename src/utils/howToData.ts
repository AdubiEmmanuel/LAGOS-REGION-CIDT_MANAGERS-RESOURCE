import type { HowToGuide } from '../types/howTo';

export const howToGuides: HowToGuide[] = [
    {
        id: 'resolve-fibn-da',
        title: 'Resolve DA Issue for FIBN',
        description: 'Step by step guide to resolve DA issues for FIBN distributor',
        prerequisites: [
            'Access to the database',
            'Distributor code ready (example: 18033402)'
        ],
        steps: [
            {
                id: 'check-da-head',
                order: 1,
                description: 'Query DA_HEAD to get vendor information',
                script: "SELECT VENDOR, VENDOR_TYPE, * FROM DA_HEAD WHERE DISTRIBUTOR = '18033402' AND STATUS = '0'"
            },
            {
                id: 'prepare-doc-numbers',
                order: 2,
                description: 'Format the document numbers from the previous query result',
                script: "-- Example format:\n-- '5120302766','5120302767','5120302770'\n-- Copy the DOC_NO values from step 1 and format them with single quotes and commas"
            },
            {
                id: 'update-da-head',
                order: 3,
                description: 'Update the DA_HEAD table with formatted document numbers',
                script: "UPDATE DA_HEAD SET VENDOR = NULL, VENDOR_TYPE = '0001' WHERE DISTRIBUTOR = '18033402' AND DOC_NO IN ('5120302766','5120302767','5120302770','5120302838','5120302855','5120302866','5120302870','5120302884','5120302892','5120302945','5120302946','5120302947','5120302952','5120302968')"
            }
        ],
        notes: [
            'Replace 18033402 with your actual distributor code',
            'Make sure to properly format the document numbers from step 1 before running step 3',
            'Double-check the document numbers before running the update query',
            'The example DOC_NO values are for reference only - use your actual values'
        ]
    },
    {
        id: 'delete-mis-kpi',
        title: 'Delete Old MIS/IQ KPI Data',
        description: 'Remove historical MIS/KPI data from the system',
        prerequisites: [
            'Backup your database before proceeding',
            'Ensure no active processes are using the MIS/KPI data'
        ],
        steps: [
            {
                id: 'delete-old-data',
                order: 1,
                description: 'Delete MIS/KPI data older than 2021',
                script: "delete from mis_kpi_data where column02<'2021'"
            }
        ],
        notes: [
            'This operation cannot be undone',
            'Verify the year in the script before running',
            'Consider archiving old data before deletion'
        ]
    },
    {
        id: 'remove-asn',
        title: 'Remove ASN (DA) from System',
        description: 'Step by step guide to safely remove an ASN from the system',
        prerequisites: [
            'Have the Document Number ready',
            'Ensure the ASN is not in use'
        ],
        steps: [
            {
                id: 'delete-da-head',
                order: 1,
                description: 'Delete from DA_HEAD table where status is 0',
                script: "delete from da_head WHERE DOC_NO = ('5120178906') AND STATUS = '0'"
            },
            {
                id: 'delete-trans-detail',
                order: 2,
                description: 'Delete from TRANS_DETAIL table',
                script: "delete from trans_detail WHERE DOC_NO = ('5120178906')"
            }
        ],
        notes: [
            'Replace 5120178906 with your actual Document Number',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
        ]
    }
];