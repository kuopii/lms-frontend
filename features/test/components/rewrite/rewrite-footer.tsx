"use client";

import { useState } from "react";
import NextButton from "../exercise/component/next-button";
import RecordingButton from "../exercise/component/recording-button";
import RecordingTimer from "../exercise/component/recording-timer";
import SubmitButton from "../exercise/component/submit-button";
import PassageProgress from "../progress/passage";
import AudioPlayer from "../exercise/component/audio-player";

interface Props {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const RewriteFooter = ({ testData }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleRecordingToggle = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setIsPaused(false);
    } else {
      // Pause/Resume
      setIsPaused(!isPaused);
    }
  };

  const renderFooterContent = () => {
    const type = testData?.type_test?.toLowerCase();

    switch (type) {
      case "reading":
        return (
          <div className="container mx-auto flex items-center justify-between gap-[10px]">
            <PassageProgress />
            <SubmitButton />
          </div>
        );
      case "listening":
        return (
          <div className="container mx-auto grid grid-cols-[1fr_auto] items-center gap-12">
            <AudioPlayer />
            <SubmitButton />
          </div>
        );
      case "writing":
        return <div></div>;
      case "speaking":
        return (
          <div className="container mx-auto grid grid-cols-2 items-center justify-between gap-[10px] sm:grid-cols-3">
            <RecordingButton
              isRecording={isRecording}
              isPaused={isPaused}
              onClick={handleRecordingToggle}
            />
            {isRecording ? (
              <RecordingTimer isPaused={isPaused} />
            ) : (
              <div className="w-[140px]" />
            )}
            <NextButton />
          </div>
        );
      default:
        return <div>Unknown test type</div>;
    }
  };

  return <footer className="p-4 pb-10">{renderFooterContent()}</footer>;
};

export default RewriteFooter;
