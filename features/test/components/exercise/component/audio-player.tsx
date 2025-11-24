import React, { useState, useRef, useEffect, useCallback } from "react";
import { MdOutlineReplay10, MdOutlineForward10 } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoMdVolumeHigh } from "react-icons/io";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // --- controls ---
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const skip = (sec: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      duration,
      Math.max(0, audioRef.current.currentTime + sec),
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // --- drag seeking ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!audioRef.current) return;
    setWasPlayingBeforeDrag(isPlaying);
    audioRef.current.pause();
    setIsDragging(true);
  };

  const handleDrag = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!barRef.current || duration === 0) return;
      const rect = barRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const percent = x / rect.width;
      const newTime = percent * duration;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleDrag(e);
    },
    [isDragging, handleDrag],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
      if (wasPlayingBeforeDrag) {
        audioRef.current.play();
      }
    }
  }, [isDragging, currentTime, wasPlayingBeforeDrag]);

  // global mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8 rounded-[30px] bg-[#2C2C2C] px-[30px] py-[15px] text-white">
      {/* controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => skip(-10)}
          className="rounded-full border-none bg-[#AAAAAA] p-2"
        >
          <MdOutlineReplay10 size={22} />
        </button>
        <button
          onClick={togglePlay}
          className="rounded-full border-none bg-[#AAAAAA] p-2"
        >
          {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
        </button>
        <button
          onClick={() => skip(10)}
          className="rounded-full border-none bg-[#AAAAAA] p-2"
        >
          <MdOutlineForward10 size={22} />
        </button>
      </div>

      {/* progress bar */}
      <div
        ref={barRef}
        onClick={(e) => {
          if (!barRef.current || !audioRef.current || duration === 0) return;

          const rect = barRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percent = Math.min(Math.max(0, clickX / rect.width), 1);
          const newTime = percent * duration;

          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);

          if (!audioRef.current.paused) {
            const wasPlaying = true;
            audioRef.current.pause();
            audioRef.current.currentTime = newTime;
            if (wasPlaying) {
              setTimeout(() => {
                audioRef.current?.play().catch(() => {});
              }, 10);
            }
          }
        }}
        className="relative flex h-[4px] cursor-pointer rounded-[30px] bg-[#AAAAAA]"
      >
        {/* progress fill */}
        <div
          className="bg-primary absolute h-[4px] rounded-[30px]"
          style={{ width: `${percent}%` }}
        />

        {/* draggable bubble */}
        <div
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
          className="absolute cursor-grab self-center rounded-full bg-red-500 px-3 py-[3px] text-xs font-medium select-none active:cursor-grabbing"
          style={{ left: `calc(${percent}% - 20px)` }}
        >
          {formatTime(currentTime)}
        </div>
      </div>

      {/* volume */}
      <div className="flex items-center gap-2">
        <IoMdVolumeHigh size={22} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
          className="accent-primary h-[4px] w-20 cursor-pointer appearance-none rounded-[30px] bg-[#AAAAAA]"
          style={{
            background: `linear-gradient(to right, var(--primary,#AAAAAA) ${volume * 100}%, #AAAAAA ${volume * 100}%)`,
          }}
        />
      </div>

      <audio
        ref={audioRef}
        src="/audio/bad.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;
