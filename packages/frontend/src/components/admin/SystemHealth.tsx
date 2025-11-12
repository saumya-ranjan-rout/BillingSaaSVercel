import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Database, Server, Cpu, HardDrive, Network, AlertCircle, CheckCircle } from 'lucide-react';

interface SystemHealthProps {
  healthData: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Array<{
      name: string;
      status: 'up' | 'down' | 'degraded';
      responseTime: number;
      lastChecked: string;
    }>;
    resources: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    incidents: Array<{
      id: string;
      service: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      timestamp: string;
      resolved: boolean;
    }>;
  };
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ healthData }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'up':
      return 'success';
    case 'down':
      return 'danger'; // ✅ changed from 'destructive'
    case 'degraded':
      return 'warning';
    default:
      return 'outline';
  }
};

  const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'danger'; // ✅ changed from 'destructive'
    case 'warning':
      return 'warning';
    case 'info':
      return 'outline'; // ✅ changed from 'secondary'
    default:
      return 'default';
  }
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.resources.cpu}%</div>
            <Progress value={healthData.resources.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.resources.memory}%</div>
            <Progress value={healthData.resources.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.resources.disk}%</div>
            <Progress value={healthData.resources.disk} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.resources.network}%</div>
            <Progress value={healthData.resources.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Services Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(service.status)}
                    <span className="ml-2 font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {service.responseTime}ms
                    </span>
                    <Badge variant={getStatusVariant(service.status)}>
                      {service.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {healthData.incidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-2">No incidents reported</p>
              </div>
            ) : (
              <div className="space-y-4">
                {healthData.incidents.map((incident) => (
                  <div key={incident.id} className="flex items-start">
                    <div className="mr-3 mt-1">
                      {incident.severity === 'critical' ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : incident.severity === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">{incident.service}</p>
                        <Badge variant={getSeverityVariant(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {incident.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(incident.timestamp).toLocaleString()}
                        {incident.resolved && ' • Resolved'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
