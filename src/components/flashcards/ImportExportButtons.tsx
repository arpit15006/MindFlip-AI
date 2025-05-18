"use client";
import React, { useRef } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { AppData } from '@/lib/types';

export function ImportExportButtons() {
  const { data, importData } = useAppData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      console.log("Exporting data:", data);
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mindflip_ai_flashcards_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your flashcard data has been downloaded.",
        className: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ title: "Export Failed", description: "Could not export data.", variant: "destructive" });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Importing file:", file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          console.log("Parsing JSON data...");
          const importedJson = JSON.parse(text) as AppData;
          // Add more robust validation if necessary
          if (importedJson.flashcardSets && importedJson.flashcards && importedJson.stats) {
            console.log("Valid data format, importing...");
            importData(importedJson);
            toast({
              title: "Import Successful",
              description: "Flashcard data has been imported. Please 'Refresh' to view changes.",
              className: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
            });
          } else {
            throw new Error("Invalid file format.");
          }
        }
      } catch (error) {
        console.error("Import failed:", error);
        toast({
          title: "Import Failed",
          description: "Could not import data. Ensure the file is a valid JSON export.",
          variant: "destructive"
        });
      } finally {
        // Reset file input to allow importing the same file again if needed
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="border-primary/20 hover:border-primary/50 transition-colors relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center">
          <Upload className="mr-2 h-4 w-4" /> Import
        </div>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={handleExport}
        className="border-primary/20 hover:border-primary/50 transition-colors relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center">
          <Download className="mr-2 h-4 w-4" /> Export
        </div>
      </Button>
    </div>
  );
}
