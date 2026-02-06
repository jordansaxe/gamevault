import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileUp, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface ImportFormat {
  id: string;
  name: string;
  description: string;
}

interface ImportResultGame {
  name: string;
  status: "imported" | "duplicate" | "not_found" | "error";
  message?: string;
  igdbId?: number;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  games: ImportResultGame[];
}

export default function Import() {
  const [selectedFormat, setSelectedFormat] = useState<string>("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: formats } = useQuery<ImportFormat[]>({
    queryKey: ["/api/import/formats"],
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", selectedFormat);

      const res = await fetch("/api/import/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || "Import failed");
      }

      return res.json() as Promise<ImportResult>;
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const getStatusIcon = (status: ImportResultGame["status"]) => {
    switch (status) {
      case "imported":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "duplicate":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "not_found":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ImportResultGame["status"]) => {
    switch (status) {
      case "imported":
        return "Imported";
      case "duplicate":
        return "Skipped (duplicate)";
      case "not_found":
        return "Not found";
      case "error":
        return "Error";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Import Games</h1>
        <p className="text-muted-foreground mt-2">
          Import your game library from GameTrack, Gamery, or other apps
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload SQLite File</CardTitle>
          <CardDescription>
            Export your game library from your tracking app and upload the .sqlite file here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Import Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formats?.map((format) => (
                  <SelectItem key={format.id} value={format.id}>
                    <div className="flex flex-col">
                      <span>{format.name}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".sqlite,.db,.sqlite3"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Drop your SQLite file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
              )}
            </label>
          </div>

          {/* Import Button */}
          <Button
            onClick={handleImport}
            disabled={!selectedFile || importMutation.isPending}
            className="w-full"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import Games
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {importMutation.isSuccess && importMutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Import Complete</CardTitle>
            <CardDescription>
              Processed {importMutation.data.total} games
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-2xl font-bold text-green-500">
                  {importMutation.data.imported}
                </p>
                <p className="text-sm text-muted-foreground">Imported</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <p className="text-2xl font-bold text-yellow-500">
                  {importMutation.data.skipped}
                </p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <p className="text-2xl font-bold text-red-500">
                  {importMutation.data.failed}
                </p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span>
                  {Math.round(
                    (importMutation.data.imported / importMutation.data.total) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (importMutation.data.imported / importMutation.data.total) * 100
                }
              />
            </div>

            {/* Game List */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {importMutation.data.games.map((game, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                >
                  {getStatusIcon(game.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{game.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getStatusText(game.status)}
                      {game.message && ` - ${game.message}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {importMutation.isError && (
        <Card className="border-red-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-500">
              <XCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Import Failed</p>
                <p className="text-sm">
                  {importMutation.error instanceof Error
                    ? importMutation.error.message
                    : "An unknown error occurred"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">GameTrack (iOS)</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Open GameTrack on your iPhone/iPad</li>
              <li>Go to Settings</li>
              <li>Tap "Export Data" or "Backup"</li>
              <li>Save the .sqlite file to Files or your computer</li>
            </ol>
          </div>
          <div>
            <h3 className="font-medium mb-2">Gamery (iOS)</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Open Gamery on your iPhone/iPad</li>
              <li>Go to Settings &gt; Export</li>
              <li>Choose "SQLite" format</li>
              <li>Save the exported file</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
