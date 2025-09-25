"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary"; // ✅ use your helper

export default function UploadPortfolio() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [caption, setCaption] = useState("");
  const [clientName, setClientName] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !category || !images || !clientName) {
      alert("Please fill in all fields including client name and images.");
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const result = await uploadToCloudinary(file, "brain-works-studio");
        uploadedImageUrls.push(result.secure_url);
      }

      await addDoc(collection(db, "portfolio"), {
        title,
        category,
        tags: tags.split(",").map((t) => t.trim()),
        caption,
        clientName,
        imageUrls: uploadedImageUrls, // ✅ now Cloudinary URLs
        featured: false,
        createdAt: new Date(),
      });

      alert("Portfolio uploaded successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Admin
      </button>

      <h2 className="text-xl font-bold mb-4">Upload Portfolio</h2>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div>
          <Label>Tags (comma separated)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        <div>
          <Label>Caption</Label>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>

        <div>
          <Label>Client Name</Label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Type client’s name"
          />
        </div>

        <div>
          <Label>Upload Images</Label>
          <Input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
        </div>

        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
