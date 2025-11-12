import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { CreditCard, Wallet, Landmark, Zap } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  isEnabled: boolean;
  credentials: Record<string, string>;
  supportedCurrencies: string[];
  transactionFees: number;
}

interface PaymentGatewaySetupProps {
  gateways: PaymentGateway[];
  onUpdate: (gatewayId: string, updates: Partial<PaymentGateway>) => void;
  onTest: (gatewayId: string) => void;
}

export const PaymentGatewaySetup: React.FC<PaymentGatewaySetupProps> = ({
  gateways,
  onUpdate,
  onTest,
}) => {
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

const getGatewayIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'stripe':
      return <CreditCard className="h-6 w-6" />;
    case 'razorpay':
      return <Wallet className="h-6 w-6" />;
    case 'paypal':
      return <Landmark className="h-6 w-6" />; // replaced Bank with Landmark
    default:
      return <Zap className="h-6 w-6" />;
  }
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className={gateway.isEnabled ? 'border-green-200' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {getGatewayIcon(gateway.name)}
                <span className="ml-2">{gateway.name}</span>
              </CardTitle>
              <Switch
                checked={gateway.isEnabled}
                onCheckedChange={(checked : boolean) => onUpdate(gateway.id, { isEnabled: checked })}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Transaction fees: {gateway.transactionFees}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: {gateway.supportedCurrencies.join(', ')}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setActiveGateway(
                    activeGateway === gateway.id ? null : gateway.id
                  )}
                >
                  {activeGateway === gateway.id ? 'Hide Settings' : 'Configure'}
                </Button>
              </div>

              {activeGateway === gateway.id && (
                <div className="mt-4 space-y-3">
                  {Object.entries(gateway.credentials).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={`${gateway.id}-${key}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Label>
                      <Input
                        id={`${gateway.id}-${key}`}
                        type={key.toLowerCase().includes('key') ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => onUpdate(gateway.id, {
                          credentials: { ...gateway.credentials, [key]: e.target.value }
                        })}
                        className="mt-1"
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => onTest(gateway.id)}
                  >
                    Test Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
