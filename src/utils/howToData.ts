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
            },
            
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
            },
            
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
    },
    {
        id: 'batch-resolve',
        title: 'Resolve BAtch Issue on skus sales process',
        description: 'Step by step guide to remove duplicate batch 1-1-1 from sales process',
        prerequisites: [
            'Execute the following scripts in order',
            'ensure you have necessary permissions'
        ],
        steps: [
            {
                id: 'select-batch',
                order: 1,
                description: 'Delete from BATCH table where BATCH is 1-1-1 for specific SKUs',
                script: "SELECT * FROM BATCH WHERE BATCH = '1-1-1' AND SKU IN ('64401562','64997464','64997466')"
            },
            {
                id: 'select-from-cashmemo_details',
                order: 2,
                description: 'select from CASHMEMO_DETAIL table',
                script: "SELECT * FROM CASHMEMO_DETAIL WHERE BATCH = '1-1-1' AND SKU IN ('64401562','64997464','64997466')"
            },
            {
                id: 'update-cashmemo_details',
                order: 2,
                description: 'Update from CASHMEMO_DETAIL table',
                script: "UPDATE CASHMEMO_DETAIL SET BATCH = '1-1' WHERE BATCH = '1-1-1' AND SKU IN ('64401562','64997464','64997466')"
            },
            {
                id: 'delete-cashmemo_details',
                order: 2,
                description: 'Delete from CASHMEMO_DETAIL table',
                script: "DELETE FROM CASHMEMO_DETAIL WHERE BATCH = '1-1-1' AND SKU IN ('64401562','64997464','64997466')"
            }
        ],
        notes: [
            'Replace 64401562 with your actual affected sku code',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
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
            },        
                  
        ],
        notes: [
            'Replace P120, DOC_DATE, DOC_NO with your actual code respectively!',
            'Run scripts in the specified order',
            'Contact support if you need further assistance'
        ]
    }
];