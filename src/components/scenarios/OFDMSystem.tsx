
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AIExplanation } from "@/components/AIExplanation";

interface OFDMParams {
  subcarrierSpacing: number;
  symbolDuration: number;
  cyclicPrefixRatio: number;
  resourceElementsPerSymbol: number;
  symbolsPerResourceBlock: number;
  resourceBlocksParallel: number;
  modulationOrder: number;
  codingRate: number;
  bandwidth: number;
}

interface OFDMResults {
  resourceElementRate: number;
  ofdmSymbolRate: number;
  resourceBlockRate: number;
  maxTransmissionCapacity: number;
  spectralEfficiency: number;
}

export const OFDMSystem = () => {
  const [params, setParams] = useState<OFDMParams>({
    subcarrierSpacing: 15000,
    symbolDuration: 66.67,
    cyclicPrefixRatio: 0.07,
    resourceElementsPerSymbol: 12,
    symbolsPerResourceBlock: 14,
    resourceBlocksParallel: 100,
    modulationOrder: 4,
    codingRate: 0.5,
    bandwidth: 20000000
  });

  const [results, setResults] = useState<OFDMResults | null>(null);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const calculateOFDM = () => {
    try {
      // Resource element rate: bits per resource element per second
      const bitsPerResourceElement = Math.log2(params.modulationOrder) * params.codingRate;
      const resourceElementRate = bitsPerResourceElement * (1000 / (params.symbolDuration * (1 + params.cyclicPrefixRatio)));
      
      // OFDM symbol rate: data rate per OFDM symbol
      const ofdmSymbolRate = resourceElementRate * params.resourceElementsPerSymbol;
      
      // Resource block rate: data rate per resource block
      const resourceBlockRate = ofdmSymbolRate * params.symbolsPerResourceBlock;
      
      // Maximum transmission capacity using parallel resource blocks
      const maxTransmissionCapacity = resourceBlockRate * params.resourceBlocksParallel;
      
      // Spectral efficiency: bits per second per Hz
      const spectralEfficiency = maxTransmissionCapacity / params.bandwidth;
      
      const newResults: OFDMResults = {
        resourceElementRate,
        ofdmSymbolRate,
        resourceBlockRate,
        maxTransmissionCapacity,
        spectralEfficiency
      };

      setResults(newResults);
      toast({
        title: "OFDM Calculation Complete",
        description: "OFDM system parameters calculated successfully!"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input parameters and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof OFDMParams, value: string) => {
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
          <CardTitle>OFDM System Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subcarrierSpacing">Subcarrier Spacing (Hz)</Label>
            <Input
              id="subcarrierSpacing"
              type="number"
              value={params.subcarrierSpacing}
              onChange={(e) => handleInputChange('subcarrierSpacing', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="symbolDuration">Symbol Duration (μs)</Label>
            <Input
              id="symbolDuration"
              type="number"
              step="0.01"
              value={params.symbolDuration}
              onChange={(e) => handleInputChange('symbolDuration', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cyclicPrefixRatio">Cyclic Prefix Ratio</Label>
            <Input
              id="cyclicPrefixRatio"
              type="number"
              step="0.01"
              value={params.cyclicPrefixRatio}
              onChange={(e) => handleInputChange('cyclicPrefixRatio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="resourceElementsPerSymbol">Resource Elements per Symbol</Label>
            <Input
              id="resourceElementsPerSymbol"
              type="number"
              value={params.resourceElementsPerSymbol}
              onChange={(e) => handleInputChange('resourceElementsPerSymbol', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="symbolsPerResourceBlock">Symbols per Resource Block</Label>
            <Input
              id="symbolsPerResourceBlock"
              type="number"
              value={params.symbolsPerResourceBlock}
              onChange={(e) => handleInputChange('symbolsPerResourceBlock', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="resourceBlocksParallel">Parallel Resource Blocks</Label>
            <Input
              id="resourceBlocksParallel"
              type="number"
              value={params.resourceBlocksParallel}
              onChange={(e) => handleInputChange('resourceBlocksParallel', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="modulationOrder">Modulation Order</Label>
            <Input
              id="modulationOrder"
              type="number"
              value={params.modulationOrder}
              onChange={(e) => handleInputChange('modulationOrder', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="codingRate">Coding Rate</Label>
            <Input
              id="codingRate"
              type="number"
              step="0.1"
              value={params.codingRate}
              onChange={(e) => handleInputChange('codingRate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bandwidth">System Bandwidth (Hz)</Label>
            <Input
              id="bandwidth"
              type="number"
              value={params.bandwidth}
              onChange={(e) => handleInputChange('bandwidth', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex gap-4">
        <Button onClick={calculateOFDM} className="flex-1">
          Calculate OFDM Parameters
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
            <CardTitle>OFDM Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700">Resource Element Rate</div>
                <div className="text-xl font-bold text-blue-900">
                  {results.resourceElementRate.toFixed(2)} bps
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-700">OFDM Symbol Rate</div>
                <div className="text-xl font-bold text-green-900">
                  {(results.ofdmSymbolRate / 1000).toFixed(2)} kbps
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-700">Resource Block Rate</div>
                <div className="text-xl font-bold text-purple-900">
                  {(results.resourceBlockRate / 1000).toFixed(2)} kbps
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-700">Max Transmission Capacity</div>
                <div className="text-xl font-bold text-orange-900">
                  {(results.maxTransmissionCapacity / 1000000).toFixed(2)} Mbps
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm font-medium text-indigo-700">Spectral Efficiency</div>
                <div className="text-xl font-bold text-indigo-900">
                  {results.spectralEfficiency.toFixed(4)} bps/Hz
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Explanation */}
      {showAI && results && (
        <AIExplanation
          scenario="ofdm"
          params={params}
          results={results}
        />
      )}
    </div>
  );
};
