
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIExplanationProps {
  scenario: string;
  params: any;
  results: any;
}

export const AIExplanation = ({ scenario, params, results }: AIExplanationProps) => {
  const [apiKey, setApiKey] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getExplanation = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key to get AI explanations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = generatePrompt(scenario, params, results);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            maxOutputTokens: 1000,
          }
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation available.";
      setExplanation(aiResponse);
      
      toast({
        title: "AI Explanation Generated",
        description: "The AI has provided a detailed explanation of your calculations."
      });
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI explanation. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePrompt = (scenario: string, params: any, results: any) => {
    const basePrompt = `As an expert in wireless and mobile networks, explain the following calculation results in detail. Provide a comprehensive explanation that includes:

1. The methodology used for each calculation
2. The significance of each parameter
3. How the results relate to real-world wireless network performance
4. Any assumptions made in the calculations
5. Practical implications of these results

Scenario: ${scenario.toUpperCase()}

Input Parameters:
${Object.entries(params).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Calculation Results:
${Object.entries(results).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please provide a detailed, educational explanation suitable for engineering students studying wireless and mobile networks.`;

    return basePrompt;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Brain className="w-6 h-6" />
          AI-Powered Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!explanation && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="geminiKey">Google Gemini API Key</Label>
              <Input
                id="geminiKey"
                type="password"
                placeholder="Enter your Google Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-gray-600 mt-1">
                Get your free API key from{" "}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            <Button 
              onClick={getExplanation} 
              disabled={isLoading || !apiKey.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Explanation...
                </>
              ) : (
                "Get AI Explanation"
              )}
            </Button>
          </div>
        )}

        {explanation && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="prose prose-sm max-w-none">
                {explanation.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => {
                setExplanation("");
                setApiKey("");
              }} 
              variant="outline"
              className="w-full"
            >
              Generate New Explanation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
