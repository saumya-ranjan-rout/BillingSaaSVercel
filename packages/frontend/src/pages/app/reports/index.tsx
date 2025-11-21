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
      <div className="reports-container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="reports-page-title">Compliance Reports</h1>
          <p className="reports-subtitle">
            Generate GST, Income Tax, and other compliance reports
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`reports-tab-btn ${
                activeTab === 'generate'
                  ? 'reports-tab-active'
                  : 'reports-tab-inactive'
              }`}
            >
              Generate Report
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`reports-tab-btn ${
                activeTab === 'history'
                  ? 'reports-tab-active'
                  : 'reports-tab-inactive'
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
