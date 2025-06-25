import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Globe, BrainCog } from "lucide-react"; // lucide icons
import React from "react";

const steps = [
  {
    step: "1",
    icon: <Upload className="h-6 w-6 text-primary" />,
    title: "Sync your content",
    description:
      "Upload files, link websites, connect Google Drive, Notion, and more.",
  },
  {
    step: "2",
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "We prep your data",
    description:
      "We clean, chunk, and transform your content into AI-ready formats.",
  },
  {
    step: "3",
    icon: <BrainCog className="h-6 w-6 text-primary" />,
    title: "Deploy anywhere",
    description:
      "Access a secure endpoint to power your chatbot, search, or RAG pipeline.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground space-y-8 max-md:py-16">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-primary">
          D<span className="text-gray-500">RAG</span>
        </h1>
        <p className="text-lg">
          Your content. Instantly <span className="font-semibold">RAG</span>ged
        </p>
        {/* <p className="text-muted-foreground">
          Upload files or URLs. We embed and serve your data as a search-ready
          API.
        </p> */}
      </div>

      <Button className="bg-black text-white hover:scale-110 active:scale-110 transition-all duration-150 px-10 py-6 text-lg rounded-md">
        Get Started
      </Button>

      <div className="max-w-2xl w-full px-4 text-center space-y-6">
        <h2 className="text-3xl font-semibold text-center ">
          You're <span className="text-gray-500">three</span> easy steps away
          from launching your RAG API
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          {steps.map(({ step, title, description, icon }) => (
            <Card key={step} className="h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 justify-center">
                  {icon}
                </div>
                <div className="text-lg font-semibold">{title}</div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
