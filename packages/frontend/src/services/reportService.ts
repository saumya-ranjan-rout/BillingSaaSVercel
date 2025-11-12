import  apiClient  from './apiClient';

export const reportService = {
  async generateReport(reportType: string, period: string): Promise<any> {
    try {
      const response = await apiClient.get(`/reports/${reportType}?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  },

  async getGSTR1Report(period: string): Promise<any> {
    try {
      const response = await apiClient.get(`/reports/gstr1?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch GSTR-1 report:', error);
      throw error;
    }
  },

  async downloadGSTR1Report(period: string, format: 'pdf' | 'excel'): Promise<void> {
    try {
      const response = await apiClient.get(`/reports/gstr1/download?period=${period}&format=${format}`, {
        responseType: 'blob',
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `GSTR1-Report-${period}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      throw error;
    }
  },
};
