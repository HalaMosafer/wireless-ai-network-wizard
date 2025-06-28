
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AIExplanation } from "@/components/AIExplanation";

interface WirelessParams {
  sourceBitRate: number;
  samplingRate: number;
  quantizationBits: number;
  sourceEncodingRatio: number;
  channelEncodingRatio: number;
  interleaverDepth: number;
  burstLength: number;
}

interface WirelessResults {
  samplerRate: number;
  quantizerRate: number;
  sourceEncoderRate: number;
  channelEncoderRate: number;
  interleaverRate: number;
  burstFormatterRate: number;
}

export const WirelessCommunication = () => {
  const [params, setParams] = useState<WirelessParams>({
    sourceBitRate: 64000,
    samplingRate: 8000,
    quantizationBits: 8,
    sourceEncodingRatio: 0.5,
    channelEncodingRatio: 0.75,
    interleaverDepth: 4,
    burstLength: 148
  });

  const [results, setResults] = useState<WirelessResults | null>(null);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const calculateRates = () => {
    try {
      // Sampler rate: sampling frequency * quantization bits
      const samplerRate = params.samplingRate * params.quantizationBits;
      
      // Quantizer rate: same as sampler (no compression at quantization stage)
      const quantizerRate = samplerRate;
      
      // Source encoder rate: applies compression ratio
      const sourceEncoderRate = quantizerRate * params.sourceEncodingRatio;
      
      // Channel encoder rate: adds redundancy for error correction
      const channelEncoderRate = sourceEncoderRate / params.channelEncodingRatio;
      
      // Interleaver rate: same rate, just reorders data
      const interleaverRate = channelEncoderRate;
      
      // Burst formatter rate: organizes data into burst format
      const burstFormatterRate = interleaverRate * (params.burstLength / (params.burstLength + 8.25)); // Guard time consideration
      
      const newResults: WirelessResults = {
        samplerRate,
        quantizerRate,
        sourceEncoderRate,
        channelEncoderRate,
        interleaverRate,
        burstFormatterRate
      };

      setResults(newResults);
      toast({
        title: "Calculation Complete",
        description: "Wireless communication system rates calculated successfully!"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input parameters and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof WirelessParams, value: string) => {
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
          <CardTitle>System Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sourceBitRate">Source Bit Rate (bps)</Label>
            <Input
              id="sourceBitRate"
              type="number"
              value={params.sourceBitRate}
              onChange={(e) => handleInputChange('sourceBitRate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="samplingRate">Sampling Rate (Hz)</Label>
            <Input
              id="samplingRate"
              type="number"
              value={params.samplingRate}
              onChange={(e) => handleInputChange('samplingRate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quantizationBits">Quantization Bits</Label>
            <Input
              id="quantizationBits"
              type="number"
              value={params.quantizationBits}
              onChange={(e) => handleInputChange('quantizationBits', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sourceEncodingRatio">Source Encoding Ratio</Label>
            <Input
              id="sourceEncodingRatio"
              type="number"
              step="0.1"
              value={params.sourceEncodingRatio}
              onChange={(e) => handleInputChange('sourceEncodingRatio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="channelEncodingRatio">Channel Encoding Ratio</Label>
            <Input
              id="channelEncodingRatio"
              type="number"
              step="0.1"
              value={params.channelEncodingRatio}
              onChange={(e) => handleInputChange('channelEncodingRatio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="interleaverDepth">Interleaver Depth</Label>
            <Input
              id="interleaverDepth"
              type="number"
              value={params.interleaverDepth}
              onChange={(e) => handleInputChange('interleaverDepth', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="burstLength">Burst Length (bits)</Label>
            <Input
              id="burstLength"
              type="number"
              value={params.burstLength}
              onChange={(e) => handleInputChange('burstLength', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex gap-4">
        <Button onClick={calculateRates} className="flex-1">
          Calculate System Rates
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
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700">Sampler Rate</div>
                <div className="text-2xl font-bold text-blue-900">
                  {results.samplerRate.toLocaleString()} bps
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-700">Quantizer Rate</div>
                <div className="text-2xl font-bold text-green-900">
                  {results.quantizerRate.toLocaleString()} bps
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-700">Source Encoder Rate</div>
                <div className="text-2xl font-bold text-purple-900">
                  {results.sourceEncoderRate.toLocaleString()} bps
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-700">Channel Encoder Rate</div>
                <div className="text-2xl font-bold text-orange-900">
                  {results.channelEncoderRate.toLocaleString()} bps
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm font-medium text-indigo-700">Interleaver Rate</div>
                <div className="text-2xl font-bold text-indigo-900">
                  {results.interleaverRate.toLocaleString()} bps
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm font-medium text-red-700">Burst Formatter Rate</div>
                <div className="text-2xl font-bold text-red-900">
                  {results.burstFormatterRate.toLocaleString()} bps
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Explanation */}
      {showAI && results && (
        <AIExplanation
          scenario="wireless"
          params={params}
          results={results}
        />
      )}
    </div>
  );
};
