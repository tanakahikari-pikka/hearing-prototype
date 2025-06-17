"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, FileAudio, ImagePlus, Loader2, Mic, MicOff, Save, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useIsMobile } from "@/hooks/use-mobile"


// フェーズの定義
const phases = [
  { id: 1, name: "コンセプト", description: "デザインのコンセプトや目的を定義します" },
  { id: 2, name: "素材", description: "使用する素材や色、テクスチャを指定します" },
  { id: 3, name: "形状", description: "基本的な形状やシルエットを定義します" },
  { id: 4, name: "詳細", description: "細部の仕様や装飾について指定します" },
  { id: 5, name: "サイズ", description: "サイズ展開や寸法について指定します" },
  { id: 6, name: "生産", description: "生産方法や注意点について指定します" },
  { id: 7, name: "確認", description: "全体の仕様を確認し、最終調整を行います" },
]

export default function PhasePage({ params }: { params: { id: string; phase: string } }) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const projectId = params.id
  const currentPhase = Number.parseInt(params.phase)
  const phase = phases.find((p) => p.id === currentPhase) || phases[0]

  const [activeTab, setActiveTab] = useState("voice")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // 音声認識のシミュレーション
  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        const phaseExamples: Record<number, string> = {
          1: "このワンピースは20代後半から30代の女性をターゲットにした夏物の新作です。海辺のリゾートでも街中でも着られる、軽やかで涼しげな印象を与えるデザインにしたいです。",
          2: "素材は綿100%の薄手の生地で、肌触りが良く通気性の高いものを使用したいです。色は淡いブルーをベースに、白い小さな花柄のプリントがあるものが理想です。",
          3: "Aラインのシルエットで、ウエストはゴム仕様。丈は膝下くらいで、裾に向かって広がるデザインにしたいです。袖は短めのフレア袖で、首元はVネックが良いと思います。",
          4: "ポケットは両サイドに付けて、裾には小さなフリルをあしらいたいです。ボタンやファスナーは使わず、シンプルなデザインにしたいです。",
          5: "サイズはS、M、Lの3展開で、Mサイズの場合は着丈が100cm、バスト90cm、ウエスト（ゴム伸縮前）70cmくらいを想定しています。",
          6: "縫製は丁寧に、特に袖のフリル部分と裾のフリル部分は生地が波打たないように注意してください。洗濯による縮みも考慮した作りにしてほしいです。",
          7: "全体的に軽やかで涼しげな印象のワンピースで、リゾート感がありながらも街中でも着られるデザインです。素材の風合いを活かした、シンプルながらも女性らしいシルエットを重視しています。",
        }

        setTranscript(phaseExamples[currentPhase] || "")
        setIsRecording(false)

        // 録音停止後、AIによる分析をシミュレート
        setIsProcessing(true)
        setTimeout(() => {
          const suggestions = [
            "色の具体的な指定（カラーコードなど）があるとより正確に再現できます",
            "素材の厚さや重さについての情報を追加するとより適切な素材選定ができます",
            "類似した過去の製品があれば参照として追加すると良いでしょう",
          ]
          setAiSuggestions(suggestions)
          setIsProcessing(false)
        }, 2000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isRecording, currentPhase])

  // 録音の開始/停止
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          // 実際のアプリでは、ここで音声データを処理・送信します
          console.log("録音停止")
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error("マイクへのアクセスが拒否されました:", error)
        alert("マイクへのアクセスを許可してください")
      }
    }
  }

  // 画像アップロード処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: File[]) => {
    // 画像ファイルのみを処理
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    // 画像をBase64エンコードしてステートに保存（実際のアプリではサーバーにアップロード）
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [...prev, e.target!.result as string])

          // 画像アップロード後、AIによる分析をシミュレート
          setIsProcessing(true)
          setTimeout(() => {
            const suggestions = [
              "画像から青色のトーンを検出しました。RGB(120, 180, 210)が近いでしょう",
              "花柄のパターンサイズは約2cm間隔と推測されます",
              "画像の生地は綿素材に見えますが、混紡の可能性もあります",
            ]
            setAiSuggestions((prev) => [...suggestions, ...prev])
            setIsProcessing(false)
          }, 2000)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // ドラッグ&ドロップ処理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // 次のフェーズに進む
  const goToNextPhase = () => {
    if (currentPhase < phases.length) {
      router.push(`/projects/${projectId}/phases/${currentPhase + 1}`)
    } else {
      router.push(`/projects/${projectId}/result`)
    }
  }

  // 前のフェーズに戻る
  const goToPreviousPhase = () => {
    if (currentPhase > 1) {
      router.push(`/projects/${projectId}/phases/${currentPhase - 1}`)
    } else {
      router.push(`/projects/new`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Link href="/projects" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> プロジェクト一覧に戻る
            </Link>
            <h1 className="text-2xl font-bold">夏物新作ワンピース</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              プロジェクトID: {projectId}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1">
              <Save className="h-4 w-4" /> 保存
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              フェーズ {currentPhase}/{phases.length}: {phase.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round((currentPhase / phases.length) * 100)}% 完了
            </div>
          </div>
          <Progress value={(currentPhase / phases.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{phase.name}</CardTitle>
            <CardDescription>{phase.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4" />
                  <span>音声入力</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  <span>画像アップロード</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30">
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="mb-4 h-16 w-16 rounded-full"
                  >
                    {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <div className="text-center">
                    {isRecording ? (
                      <div className="text-destructive font-medium">録音中... タップして停止</div>
                    ) : (
                      <div>ボタンをタップして録音開始</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">音声の文字起こし</div>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="音声を録音すると、ここに文字起こしが表示されます..."
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
                    dragActive ? "border-primary bg-primary/5" : "bg-muted/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg" className="mb-4">
                    <Upload className="h-5 w-5 mr-2" /> 画像を選択
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">または画像をここにドラッグ＆ドロップ</div>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium">アップロードされた画像 ({uploadedImages.length})</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`アップロード画像 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {isProcessing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">AIが分析中...</span>
              </div>
            )}

            {aiSuggestions.length > 0 && (
              <Alert className="mt-6">
                <AlertTitle className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AIからの提案
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousPhase}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 前のフェーズ
            </Button>
            <Button onClick={goToNextPhase}>
              {currentPhase < phases.length ? (
                <>
                  次のフェーズ <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  仕様書を生成 <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
