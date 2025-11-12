// Mock service for Professional Dashboard and GST filing data

export const professionalService = {
  async getProfessionalDashboard(tenantId: string | 'all') {
    // Simulated dashboard data
    return {
      tenants: [
        { id: 't1', name: 'Tenant 1' },
        { id: 't2', name: 'Tenant 2' },
      ],
      complianceData: [
        { id: 1, title: 'GSTR-3B Filing', dueDate: '2025-10-25', tenantName: 'Tenant 1', status: 'due' },
        { id: 2, title: 'ITR Filing', dueDate: '2025-11-10', tenantName: 'Tenant 2', status: 'pending' },
      ],
      recentActivities: [
        { id: 1, description: 'Filed GSTR-1 for Sep', timestamp: Date.now(), tenantName: 'Tenant 1', type: 'filing' },
        { id: 2, description: 'Created Invoice #INV-0234', timestamp: Date.now(), tenantName: 'Tenant 2', type: 'invoice' },
      ],
      financialSummary: {
        totalRevenue: 1540000,
      },
    };
  },

  async getGSTFilings(tenantId: string | 'all') {
    // Simulated GST filing data
    return [
      { id: 1, type: 'GSTR-1', period: 'Sep 2025', status: 'Filed', filedOn: '2025-10-11' },
      { id: 2, type: 'GSTR-3B', period: 'Sep 2025', status: 'Pending', filedOn: null },
    ];
  },
};
