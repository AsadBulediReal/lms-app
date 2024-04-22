"use client";

import { useState } from "react";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";

import { toast } from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  chapterId: string;
  courseId: string;
  title: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  courseId,
  title,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();

  setTimeout(() => {
    setIsReady(true);
  }, 30000);

  return (
    <div className="flex relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col rounded-md gap-y-2">
          <Lock className="h-10 w-10 text-secondary" />
          <p className="text-sm text-secondary font-medium">
            This chapter is locked.
          </p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          autoPlay={true}
          onCanPlay={() => {
            setIsReady(true);
          }}
          onEnded={() => {
            if (nextChapterId !== undefined) {
              router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
