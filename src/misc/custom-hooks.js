import { useCallback, useState, useEffect } from "react"
import { database } from "./firebase";
import { off, onValue, ref } from "firebase/database";
import { useRef } from "react";

export const useModalState = (value = false) => {
    const [isOpen, setIsOpen] = useState(value);
    const open = useCallback(() => setIsOpen(true),[]); 
    const close = useCallback(() => setIsOpen(false),[]); 
    return {isOpen, open, close};
}

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = evt => setMatches(evt.matches);
  
      queryList.addListener(listener);
      return () => queryList.removeListener(listener);
    }, [query]);
  
    return matches;
};

export const usePresence = (uid) => {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
      onValue(ref(database, `status/${uid}`), snap => {
          if (snap.exists()) {
              const data = snap.val()
              setPresence(data);
          }
      })

      return () => {
          off(ref(database, `status/${uid}`));
      }
  }, [uid])
  
  return presence;
}

export const useHover = () => {
  const [value, setValue] = useState(false);

  const ref = useRef(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
      }
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    },
    [ref.current]
  );

  return [ref, value];
}

export const useAudioRecoder = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioBlob, setAudioBlob] = useState();
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' }).then(async (result) => {
      if (result.state === 'granted') {
        setPermission(true)
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
      } else if (result.state === 'denied') {
        setPermission(false);
      }

      result.onchange = async () => {
        if (result.state === 'granted') {
          setPermission(true)
          const streamData = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          setStream(streamData);
        } else if (result.state === 'denied') {
          setPermission(false);
          setStream(null);
        }
      }
    });

    return () => {
      
    }
  },[])

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
        setPermission(false)
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }

  const onStartRecording = async () => {
    if (!permission) {
      getMicrophonePermission()
      return
    }
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { type: "audio/mp3" });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  }

  const onStopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioB = new Blob(audioChunks, { type: "audio/mp3" });
      setAudioChunks([]);
      setAudioBlob(audioB)
      const audioUrl = URL.createObjectURL(audioB);
      setAudioFile(audioUrl); 
    };
  }

  return [recordingStatus, onStartRecording, onStopRecording, audioBlob, audioFile];
}