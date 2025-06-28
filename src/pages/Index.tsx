
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WirelessCommunication } from "@/components/scenarios/WirelessCommunication";
import { OFDMSystem } from "@/components/scenarios/OFDMSystem";
import { LinkBudget } from "@/components/scenarios/LinkBudget";
import { CellularDesign } from "@/components/scenarios/CellularDesign";
import { Radio, Wifi, Signal, Tower } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("wireless");

  const scenarios = [
    {
      id: "wireless",
      title: "Wireless Communication System",
      description: "Compute rates for sampler, quantizer, source encoder, channel encoder, interleaver, and burst formatting",
      icon: <Radio className="w-6 h-6" />,
      component: <WirelessCommunication />
    },
    {
      id: "ofdm",
      title: "OFDM Systems",
      description: "Calculate data rates for resource elements, OFDM symbols, resource blocks, and spectral efficiency",
      icon: <Wifi className="w-6 h-6" />,
      component: <OFDMSystem />
    },
    {
      id: "linkbudget",
      title: "Link Budget Calculation",
      description: "Compute transmitted power and received signal strength in flat environment",
      icon: <Signal className="w-6 h-6" />,
      component: <LinkBudget />
    },
    {
      id: "cellular",
      title: "Cellular System Design",
      description: "Design cellular network based on user-specified parameters",
      icon: <Tower className="w-6 h-6" />,
      component: <CellularDesign />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Wireless Network Design AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-Powered Web Application for Wireless and Mobile Network Design
          </p>
          <div className="mt-4 text-sm text-gray-500">
            ENCS5323 - Wireless and Mobile Networks Project
          </div>
        </div>

        {/* Scenario Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {scenarios.map((scenario) => (
            <Card 
              key={scenario.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                activeTab === scenario.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(scenario.id)}
            >
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-2 text-blue-600">
                  {scenario.icon}
                </div>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-center">
                  {scenario.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {scenarios.map((scenario) => (
              <TabsTrigger 
                key={scenario.id} 
                value={scenario.id}
                className="flex items-center gap-2"
              >
                {scenario.icon}
                <span className="hidden sm:inline">{scenario.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id}>
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    {scenario.icon}
                    {scenario.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scenario.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
