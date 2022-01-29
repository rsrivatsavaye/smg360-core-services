export const categories= {
    // Navigation
    menu: 'Menu',
    filterPanel: 'Filter Panel',
    // Reports
    commentReport: 'Comment Report',
    categoryTrend: 'Category Trend',
    // Dashboard Cards
    topTopicsDashboardCard: 'Top Topics', /* Should match the comment report? */
    wordCloudDashboardCard: 'Word Cloud',
    commentReportDashboardCard:'Comment Report Dashboard Card' 
}
export const actions= {
    filterPanelActions: {
        clear: 'Clear Filter',
        apply: 'Apply Filter',
        selectFilter: 'Select Filter',
        selectMenu: 'Select Menu',
        selectNavigation: 'Select Navigation'
    },
    categoryTrendActions: {
        dataType: 'Data Type',
        periodType: 'Period Type',
        chartClick: 'Chart Click - Report',
        chartHover: 'Chart Hover - Report',
        commentReportNavigation: 'Comment Report Navigation',
        categoryChanged: 'Category Changed',
        openModal: 'Open Modal',
        closeModal: 'Close Modal',
        exportCsv: 'Export CSV',
        exportExcel:'Export Excel',
    },
    categoryTrendDashboardCardActions: {
        load: 'Dashboard Card Load',
        dataType: 'Dashboard Card Data Type',
        periodType: 'Dashboard Card Period Type',
        chartClick: 'Dashboard Card Chart Click',
        commentReportNavigation: 'Dashboard Card Comment Report Navigation',
        categoryTrendNavigation: 'Dashboard Card Category Trend Navigation',
        chartHover: 'Dashboard Card Chart Hover'
    },
    topTopicsDashboardCardActions: {
        load: 'Dashboard Card Load',
        chartClick: 'Dashboard Card Chart Click',
        commentReportNavigation: 'Dashboard Card Comment Report Navigation',
        chartHover: 'Chart Hover'
    },
    commentReportDashboardCardActions: {
        load: 'Dashboard Card Load',
        chartClick: 'Dashboard Card Chart Click',
        commentReportNavigation: 'Dashboard Card Comment Report Navigation',
        chartHover: 'Chart Hover'
      },
    wordCloudDashboardCardActions: {
        load: 'Dashboard Card Load',
        chartClick: 'Dashboard Card Chart Click',
        commentReportNavigation: 'Dashboard Card Comment Report Navigation',
        wordHover: 'Chart Hover'
    },
    exportActions: {
        export: 'Export'
    }
}
export const labels= {
    filterPanelLabels: {
        navigation: {
            navigation: 'Navigation',
            reports: 'Reports',
            previousReportingSite: 'Previous Reporting Site',
            logout: 'Logout',
            dashboards: 'Dashboards',
            feedback: 'Feedback'
         
        },
        filters: {
            filters: 'Filters',
            sources: 'Sources',
            date: 'Date',
            hierarchy: 'Hierarchy',
            caseTypes: 'Case Types',
            resolutionStatus: 'Resolution Status',
            escalated: 'Escalated',
            pastDue: 'Past Due',
            attributes: 'Attributes',
            openEnds: 'Open Ends',
            social: 'Social',
            sentiment: 'Sentiment',
            notifications: 'Notifications'
        }
    },
    categoryTrendLabels: {
        dataType: {
            percentage: 'Percentage',
            count: 'Count'
        },
        periodType: {
            quarter: 'Quarter/Quarter',
            month: 'Month/Month',
            week: 'Week/Week'
        },
        chartClick: {
            area: 'Area Chart',
            line: 'Line Chart'
        },
        commentReportNavigation: {
            trend: 'Trend Chart',
            sentiment: 'Sentiment Chart',
            product: 'Product List'
        },
        export: {
            trend: 'Trend Raw Data',
            aggregated: 'Aggregated Table Data',
            both: 'Both Trend Raw and Aggregated Table Data',
        },
        chartHover:{
            period: 'Period',
            chart: 'Chart'
        }
    },
    categoryTrendDashboardCardLabels: {
        dataType: {
            percentage: 'Percentage',
            count: 'Count'
        },
        periodType: {
            quarter: 'Quarter',
            month: 'Month',
            week: 'Week'
        },
        chartClick: {
            line: 'Line Chart'
        },
        commentReportNavigation: {
            trendClick: 'Trend Chart Click'
        },
        categoryTrendReportNavigation: {
            buttonClick: 'Button Click'
        },
        pageLabel: "Category Trend Dashboard Card",
        periodHover: 'Period Hover',
        chartHover: 'Chart Hover',
    },
    topTopicsDashboardCardLabels: {
        labelClick: 'Comment Click',
        chartClick: 'Chart Click',
        buttonClick: 'Button Click',
        labelHover: 'Label Hover',
        chartHover: 'Chart Hover',
        tabSwitch: 'Tab Switch'
    },
    commentReportDashboardCardLabels: {
        labelClick: 'Label Click',
        chartClick: 'Chart Click',
        buttonClick: 'Button Click',
        labelHover: 'Label Hover',
        chartHover: 'Chart Hover',
        tabSwitch: 'Carousel Click'
      },
    wordCloudDashboardCardLabels: {
        chartClick: 'Chart Click',
        buttonClick: 'Button Click',
        chartHover: 'Chart Hover',
        labelHover: 'Label Hover'

    },
    exportLabels: {
        csv: 'CSV',
        excel: 'Excel'
    }
}
