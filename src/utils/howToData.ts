import type { HowToGuide, ChannelMapping } from '../types/howTo';

/**
 * Channel mapping data for POP SUB_ELEMENT codes.
 * Used for POP rechanneling and channel mapping operations.
 * 
 * @type {ChannelMapping[]}
 * @property {string} SUB_ELEMENT - The unique channel code (e.g., C10001)
 * @property {string} SDESC - Short description of the channel (e.g., WS)
 * @property {string} LDESC - Long description of the channel (e.g., WHOLESALER)
 */
export const channelMappings: ChannelMapping[] = [
    { SUB_ELEMENT: 'C10001', SDESC: 'WS', LDESC: 'WHOLESALER' },
    { SUB_ELEMENT: 'C10002', SDESC: 'KA', LDESC: 'KEY ACCOUNT' },
    { SUB_ELEMENT: 'C10003', SDESC: 'GT', LDESC: 'GENERAL TRADE' },
    { SUB_ELEMENT: 'C10004', SDESC: 'DRL', LDESC: 'DISTRIBUTOR RETAIL' },
    { SUB_ELEMENT: 'C10005', SDESC: 'DWS', LDESC: 'DISTRIBUTOR WHOLESALE' },
    { SUB_ELEMENT: 'C10006', SDESC: 'TSR', LDESC: 'TERRITORY SALES REP' },
    { SUB_ELEMENT: 'C10007', SDESC: 'SMK', LDESC: 'SUPERMARKET' },
    { SUB_ELEMENT: 'C10008', SDESC: 'BSR', LDESC: 'BRAND SALES REP' },
    { SUB_ELEMENT: 'C10009', SDESC: 'OMLS', LDESC: 'OMLS' },
    { SUB_ELEMENT: 'C10010', SDESC: 'OMFS', LDESC: 'OMFS' }
];

export const howToGuides: HowToGuide[] = [
    {
        id: 'resolve-batch-error',
        title: 'Resolve SKU Batch Error (Non 1-1 Batch)',
        description: 'Comprehensive solution to fix SKU batch issues where batch is not 1-1, including backup and cleanup steps',
        prerequisites: [
            'Access to the database',
            'Affected SKU number',
            'Backup before proceeding',
            'Verify the SKU and batch information'
        ],
        steps: [
            {
                id: 'backup-records',
                order: 1,
                description: 'Create backup of affected records',
                script: "SELECT * INTO Cashmemo_detail_Backup_10102025 FROM CASHMEMO_DETAIL WHERE BATCH <> '1-1' AND SKU = '62768303';"
            },
            {
                id: 'update-cashmemo',
                order: 2,
                description: 'Update Cashmemo Detail to correct batch (1-1)',
                script: "UPDATE CASHMEMO_DETAIL SET BATCH = '1-1' WHERE BATCH <> '1-1' AND SKU = '62768303' AND DOC_NO = ''"
            },
            {
                id: 'update-batch-indexes',
                order: 3,
                description: 'Update Batch table indexes',
                script: "UPDATE BATCH SET BatchIndex = '0' WHERE BATCH <> '1-1' AND SKU = '62768303';\nUPDATE BATCH SET BatchIndex = '1' WHERE BATCH = '1-1' AND SKU = '62768303';"
            },
            {
                id: 'clean-qs-entries',
                order: 4,
                description: 'Clean QS_GROUP_DATE_ENTRY records',
                script: "DELETE FROM QS_GROUP_DATE_ENTRY WHERE DELV_DATE_UPLOADED > '20250101';"
            },
            {
                id: 'delete-wrong-batch',
                order: 5,
                description: 'Remove incorrect batch records',
                script: "DELETE FROM BATCH WHERE BATCH <> '1-1' AND SKU = '62768303';"
            }
        ],
        notes: [
            'Replace 62768303 with your actual SKU code',
            'Replace 20250101 with appropriate date for QS cleanup',
            'Always verify backup is created before proceeding',
            'Run scripts in the specified order',
            'Document number (DOC_NO) needs to be specified in step 2',
            'Consider archiving backup table after successful fix',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'resolve-inactive-dsr',
        title: 'Resolve Inactive DSR Issue in FIBN',
        description: 'Step by step guide to resolve inactive DSR issues that prevent mobility day start',
        prerequisites: [
            'Access to the database',
            'Access to xnapp monitor',
            'Distributor code',
            'DSR details'
        ],
        steps: [
            {
                id: 'check-pjp-status',
                order: 1,
                description: 'Check PJP status for DSR',
                script: "SELECT * FROM PJP_STATUS WHERE DSR IN ('DSR_CODE') AND STATUS = 'Y'"
            },
            {
                id: 'check-dsr-setup',
                order: 2,
                description: 'Check DSR setup status',
                script: "SELECT * FROM DSR WHERE STATUS = 'Y' AND DSR_CODE IN ('DSR_CODE')"
            },
            {
                id: 'check-xnapp',
                order: 3,
                description: 'Check xnapp monitor steps',
                script: "-- Follow these manual steps in xnapp monitor:\n-- 1. Login to xnapp monitor\n-- 2. Search for distributor using distributor code\n-- 3. Navigate to ROUTE -> ROUTE LIST\n-- 4. Find inactive DSRs and check their boxes\n-- 5. Click through to activate them"
            }
        ],
        notes: [
            'Replace DSR_CODE with your actual DSR codes',
            'Verify each DSR status in both database and xnapp monitor',
            'All 3 checks must pass for DSR to be fully active',
            'Multiple DSR codes can be checked at once using IN clause',
            'If issues persist after all steps, contact support'
        ]
    },
    {
        id: 'rechannel-pop-ws',
        title: 'Rechannel POP to Wholesaler (WS)',
        description: 'Step by step guide to rechannel a POP to the Wholesaler (WS) channel',
        prerequisites: [
            'Access to the database',
            'POP codes ready to rechannel',
            'Verify the POP is valid and active'
        ],
        steps: [
            {
                id: 'verify-pop',
                order: 1,
                description: 'Verify current POP details before rechanneling',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TLA5200900190101462')"
            },
            {
                id: 'update-channel',
                order: 2,
                description: 'Update POP SUB_ELEMENT to WS channel (C10001)',
                script: "UPDATE POP SET SUB_ELEMENT = 'C10001' WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TLA5200900190101462')"
            },
            {
                id: 'verify-update',
                order: 3,
                description: 'Verify the channel update was successful',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TLA5200900190101462')"
            }
        ],
        notes: [
            'Replace TLA5200900190101462 with your actual POP code',
            'Ensure to use the correct SUB_ELEMENT code (C10001 for WS)',
            'Run scripts in order to verify the change',
            'Multiple POP codes can be added using commas: (\'CODE1\',\'CODE2\')',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'rechannel-pop-rural-dpoint',
        title: 'POP Rechanneling For New Rural DPoint',
        description: 'Step by step guide to rechannel a POP to the New Rural DPoint channel',
        prerequisites: [
            'Access to the database',
            'POP codes ready to rechannel',
            'Verify the POP is valid and active'
        ],
        steps: [
            {
                id: 'verify-pop',
                order: 1,
                description: 'Verify current POP details before rechanneling',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TWE2400300190272236')"
            },
            {
                id: 'update-channel',
                order: 2,
                description: 'Update POP SUB_ELEMENT to New Rural DPoint channel (C11075)',
                script: "UPDATE POP SET SUB_ELEMENT = 'C11075' WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TWE2400300190272236')"
            },
            {
                id: 'verify-update',
                order: 3,
                description: 'Verify the channel update was successful',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('TWE2400300190272236')"
            }
        ],
        notes: [
            'Replace TWE2400300190272236 with your actual POP code',
            'Ensure to use the correct SUB_ELEMENT code (C11075 for New Rural DPoint)',
            'Run scripts in order to verify the change',
            'Multiple POP codes can be added using commas: (\'CODE1\',\'CODE2\')',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'rechannel-pop-new-biz',
        title: 'POP Rechanneling For New Biz',
        description: 'Step by step guide to rechannel a POP to the New Biz channel',
        prerequisites: [
            'Access to the database',
            'POP codes ready to rechannel',
            'Verify the POP is valid and active'
        ],
        steps: [
            {
                id: 'verify-pop',
                order: 1,
                description: 'Verify current POP details before rechanneling',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'update-channel',
                order: 2,
                description: 'Update POP SUB_ELEMENT to New Biz channel (C11075)',
                script: "UPDATE POP SET SUB_ELEMENT = 'C11075' WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'verify-update',
                order: 3,
                description: 'Verify the channel update was successful',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            }
        ],
        notes: [
            'Insert your POP code(s) within the empty quotes (\'\') in the scripts',
            'Ensure to use the correct SUB_ELEMENT code (C11075 for New Biz)',
            'Run scripts in order to verify the change',
            'Multiple POP codes can be added using commas: (\'CODE1\',\'CODE2\')',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'rechannel-pop-nls',
        title: 'POP Rechanneling For NLS',
        description: 'Step by step guide to rechannel a POP to the National Listing Service (NLS) channel',
        prerequisites: [
            'Access to the database',
            'POP codes ready to rechannel',
            'Verify the POP is valid and active'
        ],
        steps: [
            {
                id: 'verify-pop',
                order: 1,
                description: 'Verify current POP details before rechanneling',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'update-channel',
                order: 2,
                description: 'Update POP SUB_ELEMENT to NLS channel (C10104)',
                script: "UPDATE POP SET SUB_ELEMENT = 'C10104' WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'verify-update',
                order: 3,
                description: 'Verify the channel update was successful',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            }
        ],
        notes: [
            'Insert your POP code(s) within the empty quotes (\'\') in the scripts',
            'Ensure to use the correct SUB_ELEMENT code (C10104 for NLS)',
            'Run scripts in order to verify the change',
            'Multiple POP codes can be added using commas: (\'CODE1\',\'CODE2\')',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'rechannel-pop-omfs-retail',
        title: 'POP Rechanneling For OMFS RETAIL',
        description: 'Step by step guide to rechannel a POP to the OMFS RETAIL channel',
        prerequisites: [
            'Access to the database',
            'POP codes ready to rechannel',
            'Verify the POP is valid and active'
        ],
        steps: [
            {
                id: 'verify-pop',
                order: 1,
                description: 'Verify current POP details before rechanneling',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'update-channel',
                order: 2,
                description: 'Update POP SUB_ELEMENT to OMFS RETAIL channel (C10720)',
                script: "UPDATE POP SET SUB_ELEMENT = 'C10720' WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            },
            {
                id: 'verify-update',
                order: 3,
                description: 'Verify the channel update was successful',
                script: "SELECT POP, SUB_ELEMENT, ACTIVE FROM POP WHERE TOWN+LOCALITY+SLOCALITY+POP in ('')"
            }
        ],
        notes: [
            'Insert your POP code(s) within the empty quotes (\'\') in the scripts',
            'Ensure to use the correct SUB_ELEMENT code (C10720 for OMFS RETAIL)',
            'Run scripts in order to verify the change',
            'Multiple POP codes can be added using commas: (\'CODE1\',\'CODE2\')',
            'Contact support if you need further assistance'
        ]
    },
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
        id: 'qs-partial',
        title: 'QS-PARTIAL',
        description: 'Step by step guide to resolve PARTIAL issue for QS on DT.',
        prerequisites: [
            'Access to the database',
            'Distributor code ready (example: 18033402)'
        ],
        steps: [
            {
                id: 'check-da-head',
                order: 1,
                description: "update QS_UPDATED_VERSION set QS_PREV_ROW_VER='99'",
                script: "update QS_UPDATED_VERSION set QS_PREV_ROW_VER='99',QS_ROW_VER='100' where QS_TABLE_ID in (select QS_TABLE_ID from QS_TABLE where TABLE_NAME in ('company_price_structure','master_sku','sku','batch','price_structure') and QS_TYPE='D')"
            }
        ],
        notes: [
           'Double-check the SCRIPTS ensure all parenthesis are closed'
        ]
    },
    {
        id: 'price-update',
        title: 'UPDATE-PRICE-OF-SKUS',
        description: 'Step by step guide to UPDATE PRICE OF SKUS on DT.',
        prerequisites: [
            'Access to the database',
            'Distributor code ready (example: 18033402)'
        ],
        steps: [
            {
                id: 'UPDATE-PRICE_UNIT',
                order: 1,
                description: "UPDATE PRICE_STRUCTURE SET PRICE_UNIT1",
                script: "UPDATE PRICE_STRUCTURE SET PRICE_UNIT1 = '195839.04', PRICE_UNIT3 = '4079.98', PRICE_STANDARD = '195839.04', RPRICE_UNIT1 = '195839.04', RPRICE_UNIT3 = '4079.98', RPRICE_STANDARD = '195839.04', GPRICE_UNIT1 = '195839.04', GPRICE_UNIT3 = '4079.98', GRPRICE_UNIT1 = '195839.04', GRPRICE_UNIT3 = '4079.98', PRICE_PURCHASE1='185361.60 ', PRICE_PURCHASE2 = '0', PRICE_PURCHASE3 = '3861.70', GPRICE_PURCHASE1 = '185361.60', GPRICE_PURCHASE2 = '0', GPRICE_PURCHASE3 = '3861.70', Retail_Price = '195839.04', MRSP = '195839.04' WHERE SKU IN ('21087115','20204888','20268731','21087112','21087113','21087111') AND PRICE_STRUC = '0001';"
            },
            {
                id: 'SET-EFFECTIVE_DATE',
                order: 2,
                description: "UPDATE PRICE_STRUCTURE SET EFFECTIVE_DATE",
                script: "UPDATE PRICE_STRUCTURE SET EFFECTIVE_DATE = '19-AUGUST-2025' WHERE SKU IN ('21087115','20204888','20268731','21087112','21087113','21087111') AND PRICE_STRUC = '0001';"
            },
            {
                id: 'CHECK-REFRESH-FILE',
                order: 3,
                description: "select distinct a.sku",
                script: "select distinct a.SKU,b.LDESC 'SKU DESCRIPTION',a.PRICE_STRUC,PRICE_UNIT1,PRICE_UNIT3 from PRICE_STRUCTURE a inner join SKU b on a.SKU=b.SKU inner join DISTRIBUTOR c on a.DISTRIBUTOR=c.DISTRIBUTOR where EFFECTIVE_DATE = '20250819' and PRICE_STRUC IN ('0001') "
            }
        ],
        notes: [
           'Replace 21087115 with your actual SKU CODE',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
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
        id: 'activate-pop',
        title: 'Re-activate inactive POP',
        description: 'Step by step guide to Activate inactive POP in the system',
        prerequisites: [
            'Execute the following scripts in order',
            'ensure you have necessary permissions'
        ],
        steps: [
            {
                id: 'select-batch',
                order: 1,
                description:'update POP set active=1 where TOWN+LOCALITY+SLOCALITY+pop in ( ... )',
                script: "'update POP set active=1 where TOWN+LOCALITY+SLOCALITY+pop in (`TLA5200900190101462`,`TLA5200600390238776 `,`TLA5200600190244028 `, `TLA5200600190244030`)'"
            }        
        ],
        notes: [
            'Replace TLA5200900190101462 with your actual POP code',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'reset-pop-geomatch',
        title: 'Reset Geo-match for POPs',
        description: 'Step by step guide to reset geo match for POP in the system',
        prerequisites: [
            'Execute the following scripts in order',
            'ensure you have necessary permissions'
        ],
        steps: [
            {
                id: 'update-pop-geomatch',
                order: 1,
                description:'GEO CODE RESET SCRIPTS ',
                script: "update POP set LONGITUDE=0, LATITUDE=0    where ACTIVE=1  and TOWN+LOCALITY+SLOCALITY+POP in ('TLA5200900190101462')"
            }        
        ],
        notes: [
            'Replace TLA5200900190101462 with your actual POP code',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
        ]
    },
    {
        id: 'delete-cashmemo',
        title: 'HOW TO DELETE CASHMEMO WITH SCRIPTS',
        description: 'Step by step guide to delete cashmemo from the system',
        prerequisites: [
            'Execute the following scripts in order',
            'ensure you have necessary permissions'
        ],
        steps: [
            {
                id: 'select-cashmemo',
                order: 1,
                description:"'SELECT ALL FROM CASHMEMO",
                script: "SELECT * FROM CASHMEMO WHERE DOC_DATE='' AND PJP IN ('P120', 'P240') AND DOC_NO IN ('')"
            },
            {
                id: 'update-cashmemo',
                order: 1,
                description:"'UPDATE CASHMEMO",
                script: "UPDATE CASHMEMO SET NET_AMOUNT=0 WHERE DOC_DATE='' AND POP_NAME LIKE '%IYABOSE SHOP%' AND  DOC_NO=''"
            },          
            {
                id: 'delete-cashmemo',
                order: 2,
                description:"'DELETE FROM CASHMEMO",
                script: "DELETE FROM CASHMEMO WHERE DOC_DATE='' AND POP_NAME LIKE '%IYABOSE SHOP%' AND  DOC_NO=''"
            }
        ],
        notes: [
            'Replace P120, DOC_DATE, DOC_NO with your actual code respectively!',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
        ]
    }
];