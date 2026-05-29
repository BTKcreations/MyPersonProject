'use client';

import { useState } from 'react';
import { uploadDocument } from '../../lib/api';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/theme-toggle';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    try {
      await uploadDocument(file);
      setStatus('success');
      setMessage('Document processed and data extracted successfully!');
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage((error as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Failed to upload document.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>
            Upload a document and let the AI extract your profile and project data.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Profile Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-all">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt,.md" />
                  </label>
                  <p className="pl-1 text-muted-foreground">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">{file ? file.name : "PDF, TXT, MD up to 10MB"}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
            className="w-full"
          >
            {status === 'uploading' ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing AI...
              </>
            ) : (
              'Extract & Save Profile Data'
            )}
          </Button>

          {status === 'success' && (
            <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
