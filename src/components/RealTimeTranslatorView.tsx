import React, { useRef, useState, useEffect } from "react";
import { 
  Camera, 
  Languages, 
  HelpCircle, 
  Volume2, 
  RefreshCw, 
  Check, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Globe2,
  AlertCircle,
  Upload
} from "lucide-react";

interface GrammarFeature {
  element: string;
  explanation: string;
}

interface SentenceBreakdown {
  japanese: string;
  reading: string;
  translation: string;
  grammarFeatures: GrammarFeature[];
}

interface TranslationResult {
  recognizedText: string;
  sourceLanguage: "japanese" | "sinhala" | "english";
  targetLanguage: "japanese" | "sinhala" | "english";
  fullTranslation: string;
  sentences: SentenceBreakdown[];
}

// Interactive translator helper
export default function RealTimeTranslatorView() {
  const [langMode, setLangMode] = useState<"sinhala" | "english">("sinhala");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCapturedImage(reader.result);
        setInputText(""); // Clear text when photo is uploaded
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processSelectedFile(file);
    }
  };

  // Turn on device camera
  const startCamera = async () => {
    setCameraError("");
    setCameraActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error("Camera Access Error:", err);
      // Give helpful, detailed notice about sandbox constraints + offer preloaded sample simulation
      setCameraError(
        "කැමරා ප්‍රවේශය අසාර්ථකයි (Camera Access Blocked or Not Found). " +
        "සෑන්ඩ්බොක්ස් (iFrame) ආරක්ෂණ සීමා නිසා ඔබේ වෙබ් කැමරාව මෙතැනින් කෙලින්ම ක්‍රියාත්මක කිරීමට අවසර නැති විය හැක. " +
        "පහත ඇති ආදාන කොටුවෙහි ඕනෑම ඡේදයක් ලියා translate කර බලන්න!"
      );
    }
  };

  // Turn off device camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture Base64 image snapshot from live video stream
  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      setInputText(""); // Clear text when photo is captured
      stopCamera();
    }
  };

  // Speak Japanese sentences using Speech Synthesis API
  const speakJapanese = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Run the translation request on our real-time /api/translate-photo server endpoint
  const handleTranslate = async (simulateTextPayload?: string) => {
    setErrorMessage("");
    setIsTranslating(true);
    try {
      const payloadText = simulateTextPayload !== undefined ? simulateTextPayload : inputText;
      const response = await fetch("/api/translate-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: capturedImage,
          simulateText: payloadText,
          mode: langMode
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process translation.");
      }

      const data = await response.json();
      setTranslationResult(data);
    } catch (err: any) {
      console.error("Translation Client Error:", err);
      setErrorMessage(err.message || "පරිවර්තනය කිරීමේදී දෝෂයක් සිදුවුණා. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setInputText("");
    setTranslationResult(null);
    setErrorMessage("");
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] border border-[#e9e2d7] p-6 md:p-8 shadow-sm space-y-8 text-left animate-fade-in" id="real-time-translator-view">
      
      {/* Title & Banner Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 border-dashed border-[#e9e2d7] gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 uppercase tracking-wider border border-teal-100">
            <Languages className="w-3.5 h-3.5 text-teal-600" /> Real-Time Smart AI Translator • සජීවී AI පරිවර්තකය
          </span>
          <h2 className="text-3xl font-black text-slate-800 font-display tracking-tight">
            කැමරා හෝ ලේඛන AI පරිවර්තකය
          </h2>
          <p className="text-sm text-slate-500 font-semibold">
            Point your camera, write text, or take a capture to instantly translate Japanese, English, and Sinhala with particle breakdown and grammar explanations!
          </p>
        </div>

        {/* Global Explanation Language selector */}
        <div className="flex items-center gap-2 bg-[#f0ede6] p-1.5 rounded-full border border-[#e9e2d7] shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => setLangMode("sinhala")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              langMode === "sinhala"
                ? "bg-white text-teal-700 shadow-xs"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            සිංහල පැහැදිලි කිරීම්
          </button>
          <button
            type="button"
            onClick={() => setLangMode("english")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              langMode === "english"
                ? "bg-white text-slate-700 shadow-xs"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            English Explanations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: SOURCE DATA (CAMERA OR INPUT TEXT) */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider block border-l-4 border-teal-600 pl-2.5">
            1. Source input (ආදානය)
          </h3>

          {/* Camera View Box */}
          <div className="bg-[#fcfaf2] border-2 border-dashed border-[#e9e2d7] rounded-3xl overflow-hidden relative aspect-video flex flex-col items-center justify-center p-4 min-h-[220px]">
            {cameraActive ? (
              <div className="absolute inset-0 w-full h-full bg-black">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> capture Photo (ඡායාරූපය ගන්න)
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="absolute inset-0 w-full h-full bg-slate-100 flex items-center justify-center relative">
                <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  title="Remove captured photo"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div 
                className={`w-full h-full flex flex-col items-center justify-center p-4 transition-all duration-200 ${isDragging ? "bg-teal-50/50 border-teal-500 scale-[0.98]" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="text-center space-y-4">
                  <div className="mx-auto flex gap-3 justify-center items-center">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-300">OR</span>
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <Upload className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">ඡායාරූපයක් එකතු කරන්න / කැමරාව ක්‍රියාත්මක කරන්න</p>
                    <p className="text-[10px] text-slate-400 font-extrabold px-6 max-w-sm">
                      Drag & Drop here, click to browse file, or start your camera stream.
                    </p>
                  </div>
                  <div className="flex gap-2.5 justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="px-4 py-2 bg-teal-605 hover:bg-teal-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                      style={{ backgroundColor: "#0f766e" }}
                    >
                      📷 Start Camera (කැමරාව)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      📁 Upload Photo (ඡාරූපය)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 text-[11px] font-semibold text-amber-900 flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Text Input Block */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-teal-800 block uppercase">
              හෝ පරිවර්තනය කිරීමට අවශ්‍ය ලිපිය ලියන්න (Or write text):
            </label>
            <textarea
              className="w-full h-32 p-4 rounded-2xl border border-[#e9e2d7] bg-white focus:ring-1 focus:ring-teal-600 focus:outline-hidden text-sm font-semibold placeholder:text-slate-300 shadow-inner"
              placeholder="e.g. 私はビールを毎日飲みます。 (or Type Sinhala/English text to translate to Japanese)"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (capturedImage) setCapturedImage(null); // Clear photo if writing manual text instead
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isTranslating || (!inputText && !capturedImage)}
              onClick={() => handleTranslate()}
              className="flex-1 py-3.5 px-6 bg-teal-650 hover:bg-teal-750 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              style={{ backgroundColor: "#0f766e" }}
            >
              <Sparkles className="w-4 h-4" />
              {isTranslating ? "Translating with Gemini AI..." : "පරිවර්තනය කරන්න (Translate Passages)"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              title="Reset Form"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED TRANSLATION & ANALYSIS */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider block border-l-4 border-teal-600 pl-2.5">
            2. Translation & Grammar Analysis
          </h3>

          {isTranslating ? (
            <div className="p-12 text-center bg-[#fdfbf7] rounded-[32px] border border-[#e9e2d7] flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-3 border-t-teal-700 border-[#ece2d0] animate-spin"></div>
              <p className="text-xs font-black text-slate-500">Gemini AI is reading text, translating, analyzing particles & structures...</p>
              <p className="text-[10px] text-slate-400">Please stand by. (Sinhala and English formatting takes about 5-8 seconds)</p>
            </div>
          ) : translationResult ? (
            <div className="space-y-5 animate-fade-in">
              
              {/* Captured source text summary */}
              <div className="p-4 bg.slate-50 border rounded-2xl flex flex-col gap-1.5 shadow-2xs">
                <span className="text-[10px] font-black text-slate-400 block uppercase">
                  RECOGNIZED ORIGINAL (හඳුනාගත් පෙළ):
                </span>
                <p className="text-base text-slate-700 font-extrabold select-all leading-relaxed whitespace-pre-wrap">
                  {translationResult.recognizedText}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                    From: {translationResult.sourceLanguage}
                  </span>
                  <span className="text-[9px] font-black bg-slate-100 text-teal-700 px-2 py-0.5 rounded-md uppercase">
                    To: {translationResult.targetLanguage}
                  </span>
                </div>
              </div>

              {/* Full general translation package */}
              <div className="p-5 bg-teal-50 border border-teal-100 rounded-3xl space-y-1.5 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/3 rounded-full blur-3xl opacity-30"></div>
                <span className="text-[10px] font-black text-teal-700 block uppercase tracking-wider">
                  🎯 COMPLETE TRANSLATION (සම්පූර්ණ පරිවර්තනය):
                </span>
                <p className="text-lg font-black text-slate-800 leading-relaxed relative">
                  {translationResult.fullTranslation}
                </p>
              </div>

              {/* Sentense-by-Sentence detailed segment sequence */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  🛡️ SENTENCE BREAKDOWN & PARTICLE GRAMMAR EXPLAINED (වක්‍යයෙන් වාක්‍යය විග්‍රහය):
                </span>
                
                {translationResult.sentences.map((sent, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-white border border-[#e9e2d7] rounded-3xl space-y-4 shadow-2xs relative hover:shadow-xs transition duration-200"
                  >
                    {/* Sentence number bubble */}
                    <div className="inline-flex items-center gap-1.5 bg-teal-50/50 px-2.5 py-0.5 rounded-lg text-xs font-black text-teal-900 border border-teal-100">
                      Sentence #{idx + 1}
                    </div>

                    {/* Japanese text rendering */}
                    <div className="space-y-1">
                      <p className="text-xl font-black text-slate-800 select-all leading-normal flex items-start gap-2 justify-between">
                        <span>{sent.japanese}</span>
                        {sent.japanese && (
                          <button
                            type="button"
                            onClick={() => speakJapanese(sent.japanese)}
                            className="p-1.5 text-slate-400 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
                            title="හඬ සවන් දෙන්න"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </p>
                      {sent.reading && (
                        <p className="text-xs text-slate-400 font-extrabold font-mono leading-relaxed">{sent.reading}</p>
                      )}
                    </div>

                    {/* Direct Translation detail */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-teal-700 uppercase block">
                        🇱🇰 {langMode === "sinhala" ? "පරිවර්තනය" : "Sentence Translation"}:
                      </span>
                      <p className="text-sm font-black text-teal-800 leading-normal">{sent.translation}</p>
                    </div>

                    {/* Particles and grammar highlights */}
                    {sent.grammarFeatures && sent.grammarFeatures.length > 0 && (
                      <div className="space-y-2 border-t border-dashed border-[#e9e2d7] pt-3 bg-[#fdfbf7]/50 rounded-2xl p-3">
                        <span className="text-[9px] font-black text-teal-800 uppercase block tracking-wider">
                          📚 particles / grammar points (නිපාත සහ ව්‍යාකරණ භාවිතය):
                        </span>
                        
                        <div className="space-y-2.5">
                          {sent.grammarFeatures.map((gf, gfIdx) => (
                            <div key={gfIdx} className="text-xs flex gap-2 items-start bg-white p-2.5 rounded-xl border border-[#e9e2d7]">
                              <span className="flex items-center justify-center bg-teal-700 text-white px-2 py-0.5 font-bold rounded-lg shrink-0 text-xs shadow-inner">
                                {gf.element}
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-slate-700 font-semibold leading-relaxed">{gf.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200/80 rounded-[32px] text-slate-400 space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500">පරිවර්තන ප්‍රතිඵල මෙතැනින් බලන්න</p>
                <p className="text-[10px] leading-relaxed max-w-xs mx-auto">
                  Scan text using camera or write custom text in the input field to instantly examine sentences and particles!
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

