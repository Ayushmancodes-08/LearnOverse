import { UploadSection } from "@/components/UploadSection";
import { StudyTools } from "@/components/StudyTools";
import { DocumentPreview } from "@/components/DocumentPreview";
import { ApiKeyStatus } from "@/components/ApiKeyStatus";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-blue-accent">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-accent bg-clip-text text-transparent">
                  LearnOverse
                </h1>
                <p className="text-xs text-muted-foreground">Your AI Study Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <ApiKeyStatus />
              </div>
              <div className="px-4 py-2 rounded-full bg-secondary/50 border border-primary/20">
                <span className="text-sm font-medium text-foreground">Study Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Upload Section */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <UploadSection />
            </div>
          </div>

          {/* Center Panel - Study Tools */}
          <div className="lg:col-span-5">
            <StudyTools />
          </div>

          {/* Right Panel - Document Preview */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <DocumentPreview />
            </div>
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-light to-blue-accent opacity-50 pointer-events-none" />
    </div>
  );
};

export default Index;
