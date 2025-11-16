"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  apiSource?: "nasa" | "gemini"
  imageUrl?: string
  videoUrl?: string
  userImage?: string // Added for user uploaded images
  expandedData?: {
    title?: string
    details?: string
  }
  translatedContent?: string
  translatedLanguage?: "nepali" | "hindi" | null
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm AstroBot, your cosmic companion powered by NASA's data and Gemini AI. I can show you stunning space imagery, Mars rover photos, track near-Earth asteroids, and chat about the mysteries of the universe. You can also send me photos or use voice commands! What cosmic wonder shall we explore together?",
      timestamp: new Date(),
      apiSource: "gemini",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [translatingId, setTranslatingId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const suggestedQuestions = [
    "Show me today's astronomy picture",
    "Tell me about near-Earth asteroids",
    "What's new from Mars rovers?",
    "Explain black holes to me",
  ]

  const handleTranslate = async (messageId: string, language: "nepali" | "hindi") => {
    const message = messages.find((m) => m.id === messageId)
    if (!message || message.type !== "assistant") return

    setTranslatingId(messageId)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message.content,
          language,
        }),
      })

      if (!response.ok) throw new Error("Translation failed")

      const data = await response.json()

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                translatedContent: data.translatedText,
                translatedLanguage: language,
              }
            : m,
        ),
      )
    } catch (error) {
      console.error("Translation error:", error)
    } finally {
      setTranslatingId(null)
    }
  }

  const resetTranslation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              translatedContent: undefined,
              translatedLanguage: null,
            }
          : m,
      ),
    )
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Unable to access microphone. Please check your permissions.")
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1]

        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64Audio }),
        })

        if (!response.ok) throw new Error("Transcription failed")

        const data = await response.json()
        setInput(data.text)
      }
    } catch (error) {
      console.error("Transcription error:", error)
      alert("Failed to transcribe audio. Please try again.")
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim() || "(Image uploaded)",
      timestamp: new Date(),
      userImage: imagePreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    const currentImage = selectedImage
    setInput("")
    clearSelectedImage()
    setIsLoading(true)

    try {
      let response
      if (currentImage) {
        const formData = new FormData()
        formData.append("message", currentInput)
        formData.append("image", currentImage)
        formData.append(
          "conversationHistory",
          JSON.stringify(
            messages.map((m) => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content,
            })),
          ),
        )

        response = await fetch("/api/astrobot", {
          method: "POST",
          body: formData,
        })
      } else {
        response = await fetch("/api/astrobot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: messages.map((m) => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content,
            })),
          }),
        })
      }

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        apiSource: data.apiSource || "gemini",
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        expandedData: data.expandedData,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content:
          "I apologize, but I encountered an error reaching the cosmos database. Please ensure your NASA_API_KEY and GEMINI_API_KEY are configured in your environment variables.",
        timestamp: new Date(),
        apiSource: "gemini",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const toggleCardExpansion = (messageId: string) => {
    setExpandedCard(expandedCard === messageId ? null : messageId)
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 py-3 px-4 text-center relative border-b border-cyan-500/20 bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="relative animate-float">
            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <div className="absolute inset-0 bg-cyan-400/40 blur-xl rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            AstroBot
          </h1>
        </div>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Powered by NASA API & Gemini AI
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent hover:scrollbar-thumb-cyan-500/50">
        <div className="max-w-6xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              style={{
                animation: "messageSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                animationDelay: `${index * 0.03}s`,
                animationFillMode: "both",
              }}
            >
              {message.type === "assistant" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400/30 animate-float">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              )}

              <div className="max-w-[80%] flex flex-col gap-2">
                <div
                  className={`rounded-2xl px-4 py-3 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-blue-500/40 hover:shadow-blue-500/60"
                      : "bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/95 backdrop-blur-md text-white border border-cyan-500/30 shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:border-cyan-400/50"
                  }`}
                >
                  {message.userImage && (
                    <div className="mb-3 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={message.userImage || "/placeholder.svg"}
                        alt="User uploaded"
                        className="w-full h-auto max-h-60 object-cover"
                      />
                    </div>
                  )}

                  {message.type === "assistant" && message.apiSource && (
                    <div className="flex items-center gap-1 mb-2.5">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
                          message.apiSource === "nasa"
                            ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-sm shadow-cyan-500/30"
                            : "bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-sm shadow-purple-500/30"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping absolute" />
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {message.apiSource === "nasa" ? "NASA Data" : "Gemini AI"}
                      </span>
                    </div>
                  )}

                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.translatedContent || message.content}
                  </p>

                  {message.type === "assistant" && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-cyan-500/20">
                      {message.translatedLanguage ? (
                        <button
                          onClick={() => resetTranslation(message.id)}
                          className="text-xs px-2 py-1 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                          </svg>
                          Show Original
                        </button>
                      ) : (
                        <>
                          <span className="text-xs text-muted-foreground">Translate:</span>
                          <button
                            onClick={() => handleTranslate(message.id, "nepali")}
                            disabled={translatingId === message.id}
                            className="text-xs px-2 py-1 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 transition-colors disabled:opacity-50"
                          >
                            {translatingId === message.id ? "..." : "नेपाली"}
                          </button>
                          <button
                            onClick={() => handleTranslate(message.id, "hindi")}
                            disabled={translatingId === message.id}
                            className="text-xs px-2 py-1 rounded-md bg-slate-700/50 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 transition-colors disabled:opacity-50"
                          >
                            {translatingId === message.id ? "..." : "हिन्दी"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {message.imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-500">
                      <img
                        src={message.imageUrl || "/placeholder.svg"}
                        alt="Space imagery"
                        className="w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {message.videoUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-500">
                      <video
                        src={message.videoUrl}
                        controls
                        className="w-full h-auto max-h-80 object-cover"
                        preload="metadata"
                      />
                    </div>
                  )}

                  {message.expandedData && (
                    <button
                      onClick={() => toggleCardExpansion(message.id)}
                      className="mt-3 w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-cyan-300">
                          {message.expandedData.title || "View Details"}
                        </span>
                        <svg
                          className={`w-4 h-4 text-cyan-300 transition-transform duration-300 ${
                            expandedCard === message.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {expandedCard === message.id && message.expandedData.details && (
                        <div className="mt-2 pt-2 border-t border-cyan-500/20 text-sm text-slate-300 animate-in slide-in-from-top-2 fade-in duration-300">
                          {message.expandedData.details}
                        </div>
                      )}
                    </button>
                  )}

                  <span className="text-[11px] opacity-60 mt-2.5 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {message.type === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400/30 animate-float">
                <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-5 py-4 shadow-xl shadow-cyan-500/20">
                <div className="flex gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce shadow-lg shadow-cyan-400/50"
                    style={{ animationDelay: "0ms", animationDuration: "0.6s" }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce shadow-lg shadow-blue-400/50"
                    style={{ animationDelay: "150ms", animationDuration: "0.6s" }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce shadow-lg shadow-purple-400/50"
                    style={{ animationDelay: "300ms", animationDuration: "0.6s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-3 max-w-6xl mx-auto w-full">
        {messages.length === 1 && !isLoading && (
          <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                className="text-left text-sm px-4 py-3 bg-gradient-to-br from-slate-800/70 to-slate-900/70 hover:from-slate-700/80 hover:to-slate-800/80 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 backdrop-blur-md group"
              >
                <span className="text-foreground/90 group-hover:text-cyan-300 transition-colors">{question}</span>
              </button>
            ))}
          </div>
        )}

        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="max-h-32 rounded-lg border-2 border-cyan-500/50"
            />
            <button
              onClick={clearSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            >
              ×
            </button>
          </div>
        )}

        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-cyan-500/40 hover:border-cyan-400/60 backdrop-blur-md shadow-2xl shadow-cyan-500/20 transition-all duration-300">
          <form onSubmit={handleSendMessage} className="flex gap-2 p-3">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              size="icon"
              className="bg-slate-700/50 hover:bg-slate-700 text-cyan-300 rounded-full shadow-lg disabled:opacity-50 h-11 w-11 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Button>

            <Button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              disabled={isLoading}
              size="icon"
              className={`${
                isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-slate-700/50 hover:bg-slate-700"
              } text-white rounded-full shadow-lg disabled:opacity-50 h-11 w-11 transition-all duration-300 hover:scale-110`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </Button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about cosmos, upload image, or use voice..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 resize-none outline-none py-2 px-3 max-h-32 overflow-y-auto text-[15px]"
                style={{ minHeight: "40px" }}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedImage)}
              size="icon"
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-xs text-center text-muted-foreground/50 mt-1.5">
          Press Enter to send • Shift+Enter for new line • Upload images • Use voice
        </p>
      </div>

      <style jsx>{`
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
