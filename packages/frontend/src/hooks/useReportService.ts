import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { Report, ReportType, ReportFormat, ReportFilters, ReportGenerationRequest, GSTR1ReportData, GSTR3BReportData, SalesRegisterReportData } from '../types/report';
import { toast } from 'sonner';

interface UseReportServiceReturn {
  generateReport: (request: ReportGenerationRequest) => Promise<Report>;
  downloadReport: (reportId: string, reportName: string, format?: string) => Promise<void>; // ✅ updated
  getReportHistory: (page?: number, limit?: number) => Promise<{
    data: Report[];
    pagination: any;
  }>;
  getReportData: (reportId: string) => Promise<any>;
  loading: boolean;
  error: string | null;
}


export const useReportService = (): UseReportServiceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post, get, getBlob } = useApi<any>();


  const generateReport = useCallback(async (request: ReportGenerationRequest): Promise<Report> => {
    setLoading(true);
    setError(null);

    try {
      const response = await post('/api/reports/generate', request);
      toast.success('Report generation started successfully');
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate report';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [post]);

 

const downloadReport = useCallback(
  async (reportId: string, reportName: string, format: string = "pdf"): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const blob: Blob = await getBlob(`/api/reports/${reportId}/download`);

      // Detect type from blob or fallback to requested format
      let mimeType = "application/pdf";
      let extension = "pdf";

      if (format === "xlsx" || blob.type.includes("spreadsheetml")) {
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = "xlsx";
      } else if (format === "csv" || blob.type.includes("csv")) {
        mimeType = "text/csv";
        extension = "csv";
      } else if (format === "json" || blob.type.includes("json")) {
        mimeType = "application/json";
        extension = "json";
      }

      // Create download
      const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportName}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report downloaded successfully as ${extension.toUpperCase()}`);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to download report";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  []
);





const getReportHistory = useCallback(async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: Report[]; pagination: any }> => {
  setLoading(true);
  setError(null);

  try {
    const response = await get(`/api/reports/history?page=${page}&limit=${limit}`);
    return response as { data: Report[]; pagination: any }; // ✅ type assertion instead of generic
  } catch (err: any) {
    const errorMessage = err.message || "Failed to fetch report history";
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, [get]);


  const getReportData = useCallback(async (reportId: string): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await get(`/api/reports/${reportId}/data`);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch report data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [get]);

  return {
    generateReport,
    downloadReport,
    getReportHistory,
    getReportData,
    loading,
    error
  };
};
