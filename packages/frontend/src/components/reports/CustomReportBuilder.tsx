import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Plus, Trash2, Download, Eye, Save } from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  type: string;
  aggregation?: string;
  isVisible: boolean;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface CustomReportBuilderProps {
  availableFields: Array<{
    id: string;
    name: string;
    type: string;
    aggregations: string[];
  }>;
  onSave: (report: any) => void;
  onPreview: (report: any) => void;
  onExport: (report: any, format: string) => void;
}

export const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({
  availableFields,
  onSave,
  onPreview,
  onExport,
}) => {
  const [reportName, setReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [groupBy, setGroupBy] = useState('');

  const addField = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (!field) return;

    const newField: ReportField = {
      id: fieldId,
      name: field.name,
      type: field.type,
      isVisible: true,
    };

    if (field.aggregations.length > 0) {
      newField.aggregation = field.aggregations[0];
    }

    setSelectedFields([...selectedFields, newField]);
  };

  const removeField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<ReportField>) => {
    setSelectedFields(
      selectedFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: availableFields[0]?.id || '',
      operator: 'equals',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(
      filters.map(filter =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    );
  };

  const buildReport = () => {
    return {
      name: reportName,
      fields: selectedFields,
      filters,
      dateRange,
      groupBy: groupBy || undefined,
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Group By</Label>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No grouping</SelectItem>
                {availableFields
                  .filter(field => field.type === 'string' || field.type === 'date')
                  .map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select onValueChange={addField}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {selectedFields.map(field => (
              <div key={field.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.isVisible}
                  
                    onCheckedChange={(checked: boolean) => updateField(field.id, { isVisible: checked })}

                  />
                  <span className={!field.isVisible ? 'text-gray-500' : ''}>
                    {field.name}
                  </span>
                </div>

                {field.aggregation && (
                  <Select
                    value={field.aggregation}
                    onValueChange={(value: string) => updateField(field.id, { aggregation: value })}

                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields
                        .find(f => f.id === field.id)
                        ?.aggregations.map(agg => (
                          <SelectItem key={agg} value={agg}>
                            {agg}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filters.map(filter => (
            <div key={filter.id} className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Field</Label>
                <Select
                  value={filter.field}
                  onValueChange={(value: string) => updateFilter(filter.id, { field: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map(field => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Operator</Label>
                <Select
                  value={filter.operator}
                 onValueChange={(value: string) => updateFilter(filter.id, { operator: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater">Greater than</SelectItem>
                    <SelectItem value="less">Less than</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Value</Label>
                <Input
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => onPreview(buildReport())}
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button
          variant="outline"
          onClick={() => onExport(buildReport(), 'excel')}
        >
          <Download className="h-4 w-4 mr-1" />
          Export Excel
        </Button>
        <Button
          variant="outline"
          onClick={() => onExport(buildReport(), 'pdf')}
        >
          <Download className="h-4 w-4 mr-1" />
          Export PDF
        </Button>
        <Button onClick={() => onSave(buildReport())}>
          <Save className="h-4 w-4 mr-1" />
          Save Report
        </Button>
      </div>
    </div>
  );
};
