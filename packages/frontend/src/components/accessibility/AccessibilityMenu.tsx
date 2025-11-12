import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Accessibility, Contrast, Type, Keyboard, Eye } from 'lucide-react';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 'normal',
    reduceAnimations: false,
    focusIndicator: true,
  });

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Apply settings to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }

    if (key === 'fontSize') {
      document.documentElement.classList.remove('font-small', 'font-normal', 'font-large', 'font-xlarge');
      document.documentElement.classList.add(`font-${value}`);
    }

    if (key === 'reduceAnimations') {
      document.documentElement.classList.toggle('reduce-motion', value);
    }

    if (key === 'focusIndicator') {
      document.documentElement.classList.toggle('focus-indicator', value);
    }

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Accessibility className="mr-2 h-5 w-5" />
          Accessibility Settings
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Contrast className="mr-2 h-4 w-4" />
            <Label htmlFor="high-contrast">High Contrast</Label>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked: boolean) => updateSetting('highContrast', checked)}
          />
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Type className="mr-2 h-4 w-4" />
            <Label htmlFor="font-size">Text Size</Label>
          </div>
          <Select
            value={settings.fontSize}
            onValueChange={(value: string) => updateSetting('fontSize', value)}
          >
            <SelectTrigger id="font-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            <Label htmlFor="reduce-animations">Reduce Animations</Label>
          </div>
          <Switch
            id="reduce-animations"
            checked={settings.reduceAnimations}
            onCheckedChange={(checked: boolean) => updateSetting('reduceAnimations', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Keyboard className="mr-2 h-4 w-4" />
            <Label htmlFor="focus-indicator">Focus Indicator</Label>
          </div>
          <Switch
            id="focus-indicator"
            checked={settings.focusIndicator}
            onCheckedChange={(checked: boolean) => updateSetting('focusIndicator', checked)}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Navigate menus</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd>
          </div>
          <div className="flex justify-between">
            <span>Open accessibility menu</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + A</kbd>
          </div>
          <div className="flex justify-between">
            <span>Skip to main content</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + M</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
