import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Plus, Trash2, TestTube, Save } from 'lucide-react';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  createdAt: string;
}

interface WebhookConfigurationProps {
  webhooks: Webhook[];
  availableEvents: string[];
  onSave: (webhook: Partial<Webhook>) => void;
  onUpdate: (webhookId: string, updates: Partial<Webhook>) => void;
  onDelete: (webhookId: string) => void;
  onTest: (webhookId: string) => void;
}

export const WebhookConfiguration: React.FC<WebhookConfigurationProps> = ({
  webhooks,
  availableEvents,
  onSave,
  onUpdate,
  onDelete,
  onTest,
}) => {
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
    secret: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const toggleEvent = (webhookId: string, event: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    const updatedEvents = webhook.events.includes(event)
      ? webhook.events.filter(e => e !== event)
      : [...webhook.events, event];

    onUpdate(webhookId, { events: updatedEvents });
  };

  const toggleNewEvent = (event: string) => {
    const updatedEvents = newWebhook.events.includes(event)
      ? newWebhook.events.filter(e => e !== event)
      : [...newWebhook.events, event];

    setNewWebhook({ ...newWebhook, events: updatedEvents });
  };

  const handleCreate = () => {
    onSave(newWebhook);
    setNewWebhook({ url: '', events: [], secret: '' });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Webhook Configuration</CardTitle>
            <Button
              onClick={() => setIsCreating(!isCreating)}
              variant={isCreating ? 'outline' : 'primary'}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isCreating ? 'Cancel' : 'New Webhook'}
            </Button>
          </div>
        </CardHeader>
        
        {isCreating && (
          <CardContent className="space-y-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-url">URL</Label>
                <Input
                  id="webhook-url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://example.com/webhook"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="webhook-secret">Secret Key</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={newWebhook.secret}
                  onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                  placeholder="Enter secret key"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Events</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableEvents.map(event => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`new-${event}`}
                      checked={newWebhook.events.includes(event)}
                      onChange={() => toggleNewEvent(event)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`new-${event}`} className="text-sm text-gray-700">
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreate}>
              <Save className="h-4 w-4 mr-1" />
              Create Webhook
            </Button>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {webhooks.map(webhook => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{webhook.url}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={webhook.isActive}
                    onCheckedChange={(checked : boolean) => onUpdate(webhook.id, { isActive: checked })}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTest(webhook.id)}
                  >
                    <TestTube className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(webhook.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div>
                  <Label>Events</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableEvents.map(event => (
                      <div key={event} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${webhook.id}-${event}`}
                          checked={webhook.events.includes(event)}
                          onChange={() => toggleEvent(webhook.id, event)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${webhook.id}-${event}`} className="text-sm text-gray-700">
                          {event}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
