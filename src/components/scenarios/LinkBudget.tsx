
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AIExplanation } from "@/components/AIExplanation";

interface LinkBudgetParams {
  transmitterPower: number;
  transmitterGain: number;
  frequency: number;
  distance: number;
  receiverGain: number;
  systemLoss: number;
  fadeMargin: number;
  receiverSensitivity: number;
}

interface LinkBudgetResults {
  eirp: number;
  freeSpaceLoss: number;
  receivedPower: number;
  linkMargin: number;
  isLinkViable: boolean;
}

export const LinkBudget = () => {
  const [params, setParams] = useState<LinkBudgetParams>({
    transmitterPower: 30,
    transmitterGain: 15,
    frequency: 2400,
    distance: 10,
    receiverGain: 12,
    systemLoss: 3,
    fadeMargin: 10,
    receiverSensitivity: -95
  });

  const [results, setResults] = useState<LinkBudgetResults | null>(null);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const calculateLinkBudget = () => {
    try {
      // EIRP (Effective Isotropic Radiated Power)
      const eirp = params.transmitterPower + params.transmitterGain;
      
      // Free Space Path Loss (dB)
      const freeSpaceLoss = 20 * Math.log10(params.distance) + 20 * Math.log10(params.frequency) + 32.44;
      
      // Received Power (dBm)
      const receivedPower = eirp - freeSpaceLoss + params.receiverGain - params.systemLoss;
      
      // Link Margin (dB)
      const linkMargin = receivedPower - params.receiverSensitivity - params.fadeMargin;
      
      // Link viability
      const isLinkViable = linkMargin > 0;
      
      const newResults: LinkBudgetResults = {
        eirp,
        freeSpaceLoss,
        receivedPower,
        linkMargin,
        isLinkViable
      };

      setResults(newResults);
      toast({
        title: "Link Budget Calculation Complete",
        description: `Link is ${isLinkViable ? 'viable' : 'not viable'} with ${linkMargin.toFixed(1)} dB margin.`
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input parameters and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof LinkBudgetParams, value: string) => {
    setParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Link Budget Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transmitterPower">Transmitter Power (dBm)</Label>
            <Input
              id="transmitterPower"
              type="number"
              value={params.transmitterPower}
              onChange={(e) => handleInputChange('transmitterPower', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="transmitterGain">Transmitter Antenna Gain (dBi)</Label>
            <Input
              id="transmitterGain"
              type="number"
              value={params.transmitterGain}
              onChange={(e) => handleInputChange('transmitterGain', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency (MHz)</Label>
            <Input
              id="frequency"
              type="number"
              value={params.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              value={params.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="receiverGain">Receiver Antenna Gain (dBi)</Label>
            <Input
              id="receiverGain"
              type="number"
              value={params.receiverGain}
              onChange={(e) => handleInputChange('receiverGain', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="systemLoss">System Loss (dB)</Label>
            <Input
              id="systemLoss"
              type="number"
              value={params.systemLoss}
              onChange={(e) => handleInputChange('systemLoss', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fadeMargin">Fade Margin (dB)</Label>
            <Input
              id="fadeMargin"
              type="number"
              value={params.fadeMargin}
              onChange={(e) => handleInputChange('fadeMargin', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="receiverSensitivity">Receiver Sensitivity (dBm)</Label>
            <Input
              id="receiverSensitivity"
              type="number"
              value={params.receiverSensitivity}
              onChange={(e) => handleInputChange('receiverSensitivity', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex gap-4">
        <Button onClick={calculateLinkBudget} className="flex-1">
          Calculate Link Budget
        </Button>
        {results && (
          <Button onClick={() => setShowAI(!showAI)} variant="outline">
            {showAI ? "Hide" : "Show"} AI Explanation
          </Button>
        )}
      </div>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Link Budget Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700">EIRP</div>
                <div className="text-2xl font-bold text-blue-900">
                  {results.eirp.toFixed(1)} dBm
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-700">Free Space Loss</div>
                <div className="text-2xl font-bold text-orange-900">
                  {results.freeSpaceLoss.toFixed(1)} dB
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-700">Received Power</div>
                <div className="text-2xl font-bold text-green-900">
                  {results.receivedPower.toFixed(1)} dBm
                </div>
              </div>
              <div className={`p-4 rounded-lg ${results.isLinkViable ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className={`text-sm font-medium ${results.isLinkViable ? 'text-emerald-700' : 'text-red-700'}`}>
                  Link Margin
                </div>
                <div className={`text-2xl font-bold ${results.isLinkViable ? 'text-emerald-900' : 'text-red-900'}`}>
                  {results.linkMargin.toFixed(1)} dB
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${results.isLinkViable ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-2`}>
              <div className={`text-lg font-bold ${results.isLinkViable ? 'text-green-800' : 'text-red-800'}`}>
                Link Status: {results.isLinkViable ? 'VIABLE' : 'NOT VIABLE'}
              </div>
              <div className={`text-sm ${results.isLinkViable ? 'text-green-600' : 'text-red-600'}`}>
                {results.isLinkViable 
                  ? `Link has sufficient margin of ${results.linkMargin.toFixed(1)} dB`
                  : `Link requires additional ${Math.abs(results.linkMargin).toFixed(1)} dB to be viable`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Explanation */}
      {showAI && results && (
        <AIExplanation
          scenario="linkbudget"
          params={params}
          results={results}
        />
      )}
    </div>
  );
};
