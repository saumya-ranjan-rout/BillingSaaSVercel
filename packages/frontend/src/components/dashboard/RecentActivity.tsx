import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, User, FileText, DollarSign, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'invoice' | 'payment' | 'user' | 'system';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-3 mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  By {activity.user}
                  {activity.details && ` • ${activity.details}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
