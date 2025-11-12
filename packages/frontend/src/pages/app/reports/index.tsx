import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ReportGenerator from '../../../components/reports/ReportGenerator';
import ReportHistory from '../../../components/reports/ReportHistory';
import ReportViewer from '../../../components/reports/ReportViewer';
// import Modal from '../../../components/common/Modal';
import { Modal } from '@/components/ui/Modal';
import { Report } from '../../../types/report';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleReportGenerated = (reportId: string) => {
    setActiveTab('history');
  };

  const handleViewReport = (report: Report) => {
    setViewingReport(report);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewingReport(null);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Compliance Reports</h1>
          <p className="text-gray-600">Generate GST, Income Tax, and other compliance reports</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generate Report
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Report History
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'generate' && (
          <ReportGenerator onReportGenerated={handleReportGenerated} />
        )}

        {activeTab === 'history' && (
          <ReportHistory onViewReport={handleViewReport} />
        )}

        {/* Report Viewer Modal */}
        <Modal
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          title={viewingReport?.name || 'Report Viewer'}
          size="xl"
        >
          {viewingReport && (
            <ReportViewer
              report={viewingReport}
              onClose={handleCloseViewer}
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
