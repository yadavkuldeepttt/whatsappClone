import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();

  const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0);
  const [totalDuration, settotalDuration] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [audioMessage, setaudioMessage] = useState(null);

  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.stop();
      waveForm.current.play();
      audioMessage.play();
      setisPlaying(true);
    }
  };
  const handlePauseAudio = () => {
    waveForm.current.stop();
    audioMessage.pause();
    setisPlaying(false);
  };

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setcurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      waveForm.current.on("finish", () => {
        setisPlaying(false);
      });
    }

    return () => {
      waveForm.current.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setaudioMessage(audio);
    waveForm.current.load(audioURL);
    waveForm.current.on("ready", () => {
      settotalDuration(waveForm.current.getDuration());
    });
  }, [message.message]);

  return (
    <div
      className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md  ${
        message.senderId === currentChatUser?.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}>
      <div className="">
        <Avatar type="lg" image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full ">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
