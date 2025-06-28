
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AIExplanation } from "@/components/AIExplanation";

interface CellularParams {
  coverageArea: number;
  trafficDensity: number;
  callDuration: number;
  blockingProbability: number;
  frequency: number;
  baseSationPower: number;
  mobilePower: number;
  pathLossExponent: number;
  shadowingMargin: number;
  interferenceMargin: number;
}

interface CellularResults {
  cellRadius: number;
  numberOfCells: number;
  trafficePerCell: number;
  channelsPerCell: number;
  cellCapacity: number;
  frequencyReuseFactor: number;
  spectrumEfficiency: number;
}

export const CellularDesign = () => {
  const [params, setParams] = useState<CellularParams>({
    coverageArea: 100,
    trafficDensity: 50,
    callDuration: 120,
    blockingProbability: 0.02,
    frequency: 900,
    baseSationPower: 43,
    mobilePower: 33,
    pathLossExponent: 3.5,
    shadowingMargin: 8,
    interferenceMargin: 3
  });

  const [results, setResults] = useState<CellularResults | null>(null);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const calculateCellular = () => {
    try {
      // Cell radius calculation based on coverage and path loss
      const maxPathLoss = params.baseSationPower + params.mobilePower - params.shadowingMargin - params.interferenceMargin;
      const cellRadius = Math.pow(10, (maxPathLoss - 32.44 - 20 * Math.log10(params.frequency)) / (10 * params.pathLossExponent));
      
      // Number of cells needed
      const cellArea = 2.598 * Math.pow(cellRadius, 2); // Hexagonal cell area
      const numberOfCells = Math.ceil(params.coverageArea / cellArea);
      
      // Traffic per cell (Erlangs)
      const totalTraffic = params.trafficDensity * params.callDuration / 3600; // Convert to Erlangs
      const trafficePerCell = totalTraffic / numberOfCells;
      
      // Channels per cell using Erlang B formula approximation
      const channelsPerCell = Math.ceil(trafficePerCell + 3 * Math.sqrt(trafficePerCell) + 2);
      
      // Cell capacity (simultaneous calls)
      const cellCapacity = channelsPerCell * (1 - params.blockingProbability);
      
      // Frequency reuse factor (simplified calculation)
      const frequencyReuseFactor = Math.ceil(Math.pow(3 * channelsPerCell / 30, 2/3)); // Approximation
      
      // Spectrum efficiency
      const spectrumEfficiency = cellCapacity / (channelsPerCell * 0.2); // Assuming 200 kHz per channel
      
      const newResults: CellularResults = {
        cellRadius,
        numberOfCells,
        trafficePerCell,
        channelsPerCell,
        cellCapacity,
        frequencyReuseFactor,
        spectrumEfficiency
      };

      setResults(newResults);
      toast({
        title: "Cellular Design Complete",
        description: "Cellular network design parameters calculated successfully!"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input parameters and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof CellularParams, value: string) => {
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
          <CardTitle>Cellular Network Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coverageArea">Coverage Area (km²)</Label>
            <Input
              id="coverageArea"
              type="number"
              value={params.coverageArea}
              onChange={(e) => handleInputChange('coverageArea', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="trafficDensity">Traffic Density (calls/km²/hour)</Label>
            <Input
              id="trafficDensity"
              type="number"
              value={params.trafficDensity}
              onChange={(e) => handleInputChange('trafficDensity', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="callDuration">Average Call Duration (seconds)</Label>
            <Input
              id="callDuration"
              type="number"
              value={params.callDuration}
              onChange={(e) => handleInputChange('callDuration', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="blockingProbability">Blocking Probability</Label>
            <Input
              id="blockingProbability"
              type="number"
              step="0.01"
              value={params.blockingProbability}
              onChange={(e) => handleInputChange('blockingProbability', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Operating Frequency (MHz)</Label>
            <Input
              id="frequency"
              type="number"
              value={params.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="baseSationPower">Base Station Power (dBm)</Label>
            <Input
              id="baseSationPower"
              type="number"
              value={params.baseSationPower}
              onChange={(e) => handleInputChange('baseSationPower', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mobilePower">Mobile Station Power (dBm)</Label>
            <Input
              id="mobilePower"
              type="number"
              value={params.mobilePower}
              onChange={(e) => handleInputChange('mobilePower', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pathLossExponent">Path Loss Exponent</Label>
            <Input
              id="pathLossExponent"
              type="number"
              step="0.1"
              value={params.pathLossExponent}
              onChange={(e) => handleInputChange('pathLossExponent', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shadowingMargin">Shadowing Margin (dB)</Label>
            <Input
              id="shadowingMargin"
              type="number"
              value={params.shadowingMargin}
              onChange={(e) => handleInputChange('shadowingMargin', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="interferenceMargin">Interference Margin (dB)</Label>
            <Input
              id="interferenceMargin"
              type="number"
              value={params.interferenceMargin}
              onChange={(e) => handleInputChange('interferenceMargin', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex gap-4">
        <Button onClick={calculateCellular} className="flex-1">
          Design Cellular Network
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
            <CardTitle>Cellular Network Design Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700">Cell Radius</div>
                <div className="text-xl font-bold text-blue-900">
                  {results.cellRadius.toFixed(2)} km
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-700">Number of Cells</div>
                <div className="text-xl font-bold text-green-900">
                  {results.numberOfCells}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-700">Traffic per Cell</div>
                <div className="text-xl font-bold text-purple-900">
                  {results.trafficePerCell.toFixed(2)} Erlangs
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-700">Channels per Cell</div>
                <div className="text-xl font-bold text-orange-900">
                  {results.channelsPerCell}
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm font-medium text-indigo-700">Cell Capacity</div>
                <div className="text-xl font-bold text-indigo-900">
                  {results.cellCapacity.toFixed(1)} calls
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm font-medium text-red-700">Frequency Reuse Factor</div>
                <div className="text-xl font-bold text-red-900">
                  {results.frequencyReuseFactor}
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg col-span-full">
                <div className="text-sm font-medium text-emerald-700">Spectrum Efficiency</div>
                <div className="text-xl font-bold text-emerald-900">
                  {results.spectrumEfficiency.toFixed(4)} calls/MHz
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Explanation */}
      {showAI && results && (
        <AIExplanation
          scenario="cellular"
          params={params}
          results={results}
        />
      )}
    </div>
  );
};
