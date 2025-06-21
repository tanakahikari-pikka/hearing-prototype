"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, FileAudio, ImagePlus, Loader2, Mic, MicOff, Save, Upload, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// フェーズの定義（選択肢付き）
const phases = [
  {
    id: 1,
    name: "コンセプト",
    description: "デザインのコンセプトや目的を定義します",
    selections: [
      {
        id: "usage_scene",
        label: "着用シーン",
        options: [
          { value: "casual", label: "普段着・カジュアル", description: "日常生活での着用" },
          { value: "sport", label: "スポーツ・アクティブ", description: "運動や外遊び用" },
          { value: "work", label: "仕事・オフィス", description: "職場での着用" },
          { value: "formal", label: "フォーマル・特別な日", description: "きちんとした場面" }
        ]
      },
      {
        id: "target_season",
        label: "着用季節",
        options: [
          { value: "spring_summer", label: "春夏", description: "暖かい季節向け" },
          { value: "autumn_winter", label: "秋冬", description: "涼しい季節向け" },
          { value: "all_season", label: "オールシーズン", description: "年中着用可能" }
        ]
      },
      {
        id: "brand_image",
        label: "ブランドイメージ",
        options: [
          { value: "natural", label: "ナチュラル・親しみやすい", description: "自然体で温かみのある" },
          { value: "modern", label: "モダン・都会的", description: "洗練されたスタイリッシュ" },
          { value: "classic", label: "クラシック・上品", description: "伝統的で品のある" },
          { value: "trendy", label: "トレンディ・個性的", description: "流行を取り入れた" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "素材",
    description: "使用する素材や色、テクスチャを指定します",
    selections: [
      {
        id: "material_type",
        label: "素材タイプ",
        options: [
          { value: "cotton_100", label: "綿100%", description: "肌触り良く、吸湿性に優れる" },
          { value: "polyester", label: "ポリエステル", description: "速乾性があり、型崩れしにくい" },
          { value: "cotton_poly", label: "綿ポリ混紡", description: "両方の良さを兼ね備える" },
          { value: "organic", label: "オーガニック綿", description: "環境に優しい天然素材" }
        ]
      },
      {
        id: "fabric_weight",
        label: "生地の厚さ",
        options: [
          { value: "light", label: "薄手", description: "軽やかで涼しい（夏向け）" },
          { value: "medium", label: "中厚", description: "程よい厚みで年中使える" },
          { value: "heavy", label: "厚手", description: "しっかりした生地（秋冬向け）" }
        ]
      },
      {
        id: "functional_features",
        label: "機能性",
        multiple: true,
        options: [
          { value: "quick_dry", label: "速乾性", description: "汗をかいてもすぐ乾く" },
          { value: "anti_bacterial", label: "抗菌防臭", description: "ニオイを抑える" },
          { value: "uv_protection", label: "UV カット", description: "紫外線から肌を守る" },
          { value: "stretch", label: "ストレッチ", description: "伸縮性があり動きやすい" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "形状",
    description: "基本的な形状やシルエットを定義します",
    selections: [
      {
        id: "neckline",
        label: "ネックライン",
        options: [
          { value: "crew", label: "クルーネック", description: "定番の丸首" },
          { value: "v_neck", label: "Vネック", description: "V字型の首元" },
          { value: "u_neck", label: "Uネック", description: "U字型の首元" },
          { value: "henley", label: "ヘンリーネック", description: "ボタン付きの首元" }
        ]
      },
      {
        id: "sleeve_length",
        label: "袖の長さ",
        options: [
          { value: "short", label: "半袖", description: "標準的な半袖" },
          { value: "long", label: "長袖", description: "手首まで覆う" },
          { value: "three_quarter", label: "七分袖", description: "肘と手首の間まで" },
          { value: "sleeveless", label: "ノースリーブ", description: "袖なし" }
        ]
      },
      {
        id: "body_fit",
        label: "フィット感",
        options: [
          { value: "slim", label: "スリムフィット", description: "体にフィットするタイト" },
          { value: "regular", label: "レギュラーフィット", description: "程よいゆとりの標準的" },
          { value: "loose", label: "ルーズフィット", description: "ゆったりとした着心地" },
          { value: "oversized", label: "オーバーサイズ", description: "大きめでトレンディ" }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "詳細",
    description: "細部の仕様や装飾について指定します",
    selections: [
      {
        id: "color_preference",
        label: "色の系統",
        options: [
          { value: "bright", label: "明るい色", description: "ビビッドで元気な印象" },
          { value: "pastel", label: "パステルカラー", description: "優しく上品な印象" },
          { value: "dark", label: "ダークカラー", description: "落ち着いた大人の印象" },
          { value: "neutral", label: "ニュートラルカラー", description: "どんな場面でも合わせやすい" }
        ]
      },
      {
        id: "pocket_style",
        label: "ポケット",
        options: [
          { value: "none", label: "なし", description: "シンプルなデザイン" },
          { value: "chest_left", label: "左胸ポケット", description: "定番の胸ポケット" },
          { value: "chest_both", label: "両胸ポケット", description: "左右両方にポケット" },
          { value: "side", label: "サイドポケット", description: "腰部分のポケット" }
        ]
      },
      {
        id: "hem_style",
        label: "裾のスタイル",
        options: [
          { value: "straight", label: "ストレート", description: "まっすぐなカット" },
          { value: "curved", label: "カーブ", description: "丸みを帯びたカット" },
          { value: "split", label: "スリット", description: "両サイドに切れ込み" }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "サイズ",
    description: "サイズ展開や寸法について指定します",
    selections: [
      {
        id: "size_range",
        label: "サイズ展開",
        multiple: true,
        options: [
          { value: "xs", label: "XS", description: "エクストラスモール" },
          { value: "s", label: "S", description: "スモール" },
          { value: "m", label: "M", description: "ミディアム" },
          { value: "l", label: "L", description: "ラージ" },
          { value: "xl", label: "XL", description: "エクストララージ" },
          { value: "xxl", label: "XXL", description: "ダブルエクストララージ" }
        ]
      },
      {
        id: "length_preference",
        label: "着丈の長さ",
        options: [
          { value: "short", label: "短め", description: "ウエストライン程度" },
          { value: "regular", label: "標準", description: "腰骨あたり" },
          { value: "long", label: "長め", description: "ヒップライン程度" }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "生産",
    description: "生産方法や注意点について指定します",
    selections: [
      {
        id: "production_method",
        label: "生産方法",
        options: [
          { value: "mass", label: "大量生産", description: "コストを抑えた標準的な製法" },
          { value: "small_batch", label: "小ロット生産", description: "品質重視の少量製法" },
          { value: "custom", label: "オーダーメイド", description: "個別対応の特別製法" }
        ]
      },
      {
        id: "quality_focus",
        label: "品質重視点",
        multiple: true,
        options: [
          { value: "durability", label: "耐久性", description: "長持ちする作り" },
          { value: "comfort", label: "着心地", description: "肌触りと快適性" },
          { value: "appearance", label: "見た目", description: "美しい仕上がり" },
          { value: "sustainability", label: "持続可能性", description: "環境への配慮" }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "確認",
    description: "全体の仕様を確認し、最終調整を行います",
    selections: [
      {
        id: "priority_check",
        label: "最重要ポイント",
        options: [
          { value: "comfort", label: "着心地", description: "何より快適性を重視" },
          { value: "design", label: "デザイン", description: "見た目の美しさを重視" },
          { value: "functionality", label: "機能性", description: "実用性を重視" },
          { value: "cost", label: "コスト", description: "価格を抑えることを重視" }
        ]
      }
    ]
  }
]

export default function PhasePage() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [activeTab, setActiveTab] = useState("selections")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [selections, setSelections] = useState<Record<string, any>>({})

  const fileInputRef = useRef(null)
  const phase = phases.find(p => p.id === currentPhase) || phases[0]

  // 選択肢の変更ハンドラー
  const handleSelectionChange = (selectionId: any, optionValue: any, isMultiple = false) => {
    setSelections(prev => {
      const phaseKey = `phase_${currentPhase}`
      const phaseSelections = prev[phaseKey] || {}
      
      if (isMultiple) {
        const currentValues = phaseSelections[selectionId] || []
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v: string) => v !== optionValue)
          : [...currentValues, optionValue]
        
        return {
          ...prev,
          [phaseKey]: {
            ...phaseSelections,
            [selectionId]: newValues
          }
        }
      } else {
        return {
          ...prev,
          [phaseKey]: {
            ...phaseSelections,
            [selectionId]: optionValue
          }
        }
      }
    })
  }

  // 選択済みかチェック
  const isSelected = (selectionId: string, optionValue: string, isMultiple = false) => {
    const phaseKey = `phase_${currentPhase}`
    const phaseSelections = selections[phaseKey] || {}
    
    if (isMultiple) {
      const currentValues = phaseSelections[selectionId] || []
      return currentValues.includes(optionValue)
    } else {
      return phaseSelections[selectionId] === optionValue
    }
  }

  // 音声録音シミュレーション
  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        const phaseExamples = {
          1: "このTシャツは20代後半から30代の女性をターゲットにした夏物の新作です。海辺のリゾートでも街中でも着られる、軽やかで涼しげな印象を与えるデザインにしたいです。",
          2: "素材は綿100%の薄手の生地で、肌触りが良く通気性の高いものを使用したいです。速乾性もあると嬉しいです。",
          3: "Vネックで半袖、ゆったりめのフィット感が良いと思います。",
          4: "色は明るい青系で、ポケットは左胸に一つ、裾はカーブを付けたいです。",
          5: "サイズはS、M、Lの3展開で、着丈は標準的な長さでお願いします。",
          6: "品質重視で、特に着心地と耐久性を大切にしたいです。",
          7: "全体的に着心地を最重要視してください。"
        }

        setTranscript(phaseExamples[currentPhase as keyof typeof phaseExamples] || "")
        setIsRecording(false)

        // AI分析シミュレーション
        setIsProcessing(true)
        setTimeout(() => {
          const suggestions = [
            "音声入力の内容から、適切な選択肢を自動選択しました",
            "追加の提案: より詳細な仕様調整が可能です",
            "類似した過去のプロジェクトと比較して最適化しました"
          ]
          setAiSuggestions(suggestions as never[])
          setIsProcessing(false)
        }, 2000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isRecording, currentPhase])

  // 録音開始/停止
  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  // 画像アップロード
  const handleFileChange = (e: { target: { files: any } }) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: any[]) => {
    const imageFiles = files.filter((file: { type: string }) => file.type.startsWith("image/"))
    
    imageFiles.forEach((file: Blob) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (result && typeof result === 'string') {
          
          // 画像分析シミュレーション
          setIsProcessing(true)
          setTimeout(() => {
            const suggestions = [
              "画像から色合いを検出し、カラーパレットに反映しました",
              "デザイン要素を認識し、適切な選択肢を提案します",
              "類似デザインのデータベースから参考例を検索中"
            ]
            setAiSuggestions(suggestions as never[])
            setIsProcessing(false)
          }, 2000)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // ドラッグ&ドロップ
  const handleDrag = (e: { preventDefault: () => void; stopPropagation: () => void; type: string }) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: string | any[] | Iterable<unknown> | ArrayLike<unknown> } }) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && Array.from(e.dataTransfer.files).length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // フェーズ移動
  const goToNextPhase = () => {
    if (currentPhase < phases.length) {
      setCurrentPhase(currentPhase + 1)
    }
  }

  const goToPreviousPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1)
    }
  }

  // 選択肢の完了度チェック
  const getPhaseCompletionRate = () => {
    const phaseKey = `phase_${currentPhase}`
    const phaseSelections = selections[phaseKey] || {}
    const requiredSelections = phase.selections?.filter(s => !s.multiple) || []
    const completedSelections = requiredSelections.filter(s => phaseSelections[s.id])
    
    return requiredSelections.length > 0 ? 
      Math.round((completedSelections.length / requiredSelections.length) * 100) : 100
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">夏物新作ワンピース</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              選択肢機能拡張版
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
              {Math.round((currentPhase / phases.length) * 100)}% 完了 | 
              選択肢完了率: {getPhaseCompletionRate()}%
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
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="selections" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>選択肢</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4" />
                  <span>音声入力</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  <span>画像アップロード</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="selections" className="space-y-6">
                {phase.selections?.map((selection) => (
                  <div key={selection.id} className="space-y-3">
                    <h3 className="font-medium text-lg">{selection.label}</h3>
                    
                    {selection.multiple ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selection.options.map((option) => (
                          <div
                            key={option.value}
                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                              isSelected(selection.id, option.value, true)
                                ? 'border-primary bg-primary/5'
                                : ''
                            }`}
                            onClick={() => handleSelectionChange(selection.id, option.value, true)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {option.description}
                                </div>
                              </div>
                              {isSelected(selection.id, option.value, true) && (
                                <Check className="h-5 w-5 text-primary mt-0.5" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selection.options.map((option) => (
                          <div
                            key={option.value}
                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                              isSelected(selection.id, option.value)
                                ? 'border-primary bg-primary/5'
                                : ''
                            }`}
                            onClick={() => handleSelectionChange(selection.id, option.value)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {option.description}
                                </div>
                              </div>
                              {isSelected(selection.id, option.value) && (
                                <Check className="h-5 w-5 text-primary mt-0.5" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

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
                  <Button onClick={() => (fileInputRef.current as unknown as HTMLInputElement)?.click()} variant="outline" size="lg" className="mb-4">
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
                            src={src}
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

            {/* 現在の選択状況表示 */}
            {Object.keys(selections).length > 0 && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">現在の選択状況</h4>
                <div className="text-sm space-y-1">
                  {Object.entries(selections).map(([phaseKey, phaseSelections]) => {
                    const phaseNum = parseInt(phaseKey.split('_')[1])
                    const phaseName = phases.find(p => p.id === phaseNum)?.name
                    return (
                      <div key={phaseKey}>
                        <strong>{phaseName}:</strong>{' '}
                        {Object.entries(phaseSelections).map(([selectionId, value]) => {
                          const selection = phases.find(p => p.id === phaseNum)?.selections?.find(s => s.id === selectionId)
                          if (Array.isArray(value)) {
                            return `${selection?.label}: ${value.length}項目選択`
                          }
                          const option = selection?.options?.find(o => o.value === value)
                          return `${selection?.label}: ${option?.label}`
                        }).join(', ')}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousPhase} disabled={currentPhase === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 前のフェーズ
            </Button>
            <Button onClick={goToNextPhase} disabled={currentPhase === phases.length}>
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

        {/* 全体の進捗状況表示 */}
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-4">プロジェクト全体の進捗</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((p) => {
              const phaseKey = `phase_${p.id}`
              const phaseSelections = selections[phaseKey] || {}
              const requiredSelections = p.selections?.filter(s => !s.multiple) || []
              const completedSelections = requiredSelections.filter(s => phaseSelections[s.id])
              const completionRate = requiredSelections.length > 0 ? 
                Math.round((completedSelections.length / requiredSelections.length) * 100) : 100
              
              return (
                <div 
                  key={p.id} 
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                    p.id === currentPhase ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setCurrentPhase(p.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{p.name}</div>
                    <Badge variant={completionRate === 100 ? "default" : "secondary"} className="text-xs">
                      {completionRate}%
                    </Badge>
                  </div>
                  <Progress value={completionRate} className="h-1" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {completedSelections.length} / {requiredSelections.length} 完了
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 仕様書プレビュー */}
        {Object.keys(selections).length > 0 && (
          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-4">仕様書プレビュー</h3>
            <div className="space-y-4 text-sm">
              {Object.entries(selections).map(([phaseKey, phaseSelections]) => {
                const phaseNum = parseInt(phaseKey.split('_')[1])
                const phaseData = phases.find(p => p.id === phaseNum)
                
                return (
                  <div key={phaseKey} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-primary mb-2">{phaseData?.name}</h4>
                    {Object.entries(phaseSelections).map(([selectionId, value]) => {
                      const selection = phaseData?.selections?.find(s => s.id === selectionId)
                      
                      return (
                        <div key={selectionId} className="mb-2">
                          <span className="font-medium">{selection?.label}:</span>{' '}
                          {Array.isArray(value) ? (
                            <span>
                              {value.map(v => {
                                const option = selection?.options?.find(o => o.value === v)
                                return option?.label
                              }).join(', ')}
                            </span>
                          ) : (
                            <span>
                              {selection?.options?.find(o => o.value === value)?.label}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}