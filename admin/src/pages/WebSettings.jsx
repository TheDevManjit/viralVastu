import React, { useState, useEffect } from 'react';
import { getWebSettings, updateWebSettings } from '../api/webSettingsApi';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud } from 'lucide-react';

function WebSettings() {
  const [settings, setSettings] = useState({
    heroImage: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const res = await getWebSettings();
      if (res.data.success) {
        setSettings(res.data.settings || {});
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load current settings");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!imageFile) {
      toast.info("Please select a new image to update");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", imageFile); // 'file' matches backend multer field name

    try {
      const res = await updateWebSettings(formData);
      if (res.data.success) {
        toast.success("Hero section updated successfully!");
        setSettings(res.data.settings); // Update local state with response
        setImageFile(null);
        setPreview(null);
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 transition-all duration-500 ease-in-out">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Website Configuration</h1>

      <div className="grid gap-6">
        <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Hero Section Settings
            </CardTitle>
            <CardDescription>
              Customize the main banner image displayed on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Current Hero Image Display */}
            <div className="space-y-2">
              <Label>Current Hero Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 flex justify-center items-center min-h-[200px]">
                {settings.heroImage ? (
                  <img
                    src={settings.heroImage}
                    alt="Current Hero"
                    className="max-h-[300px] w-full object-cover rounded-md shadow-sm"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <p>No custom hero image set.</p>
                    <p className="text-xs">Default site placeholder will be used.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload New Image */}
            <div className="space-y-4">
              <Label htmlFor="hero-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-skybrand-200 hover:border-skybrand-400 rounded-lg p-8 flex flex-col items-center justify-center bg-skybrand-50 hover:bg-skybrand-100 transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-skybrand-500 mb-2" />
                  <span className="text-skybrand-600 font-medium">Click to upload new image</span>
                  <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</span>
                </div>
                <Input
                  id="hero-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Label>

              {/* Preview */}
              {preview && (
                <div className="mt-4 animate-in fade-in zoom-in duration-300">
                  <p className="text-sm font-medium mb-2 text-green-600">New Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[200px] w-full object-cover rounded-md border-2 border-green-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdate}
                disabled={loading || !imageFile}
                className="w-full sm:w-auto bg-skybrand-600 hover:bg-skybrand-700 text-white"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WebSettings
