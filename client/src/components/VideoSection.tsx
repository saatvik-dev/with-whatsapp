import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoSectionProps {
  videoId: string;
  title: string;
  description: string;
}

const VideoSection = ({
  videoId = "ZZrv5OXqIIE", // Default video ID if none provided
  title = "Watch Our Kitchen in Action",
  description = "See how our aluminum kitchen cabinets transform modern spaces with their innovative design and unmatched durability."
}: Partial<VideoSectionProps>) => {
  return (
    <section id="video" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-slate-600 text-lg">{description}</p>
        </div>
        
        <Card className="overflow-hidden border-none shadow-lg max-w-4xl mx-auto">
          <CardContent className="p-0 aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VideoSection;