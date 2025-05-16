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
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'synapsespark_flashcards_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Export Successful", description: "Your flashcard data has been downloaded." });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ title: "Export Failed", description: "Could not export data.", variant: "destructive" });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedJson = JSON.parse(text) as AppData;
          // Add more robust validation if necessary
          if (importedJson.flashcardSets && importedJson.flashcards && importedJson.stats) {
            importData(importedJson);
            toast({ title: "Import Successful", description: "Flashcard data has been imported." });
          } else {
            throw new Error("Invalid file format.");
          }
        }
      } catch (error) {
        console.error("Import failed:", error);
        toast({ title: "Import Failed", description: "Could not import data. Ensure the file is a valid JSON export.", variant: "destructive" });
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
    <>
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" /> Import
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </>
  );
}
