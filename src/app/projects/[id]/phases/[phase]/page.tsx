"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, FileAudio, ImagePlus, Loader2, Mic, MicOff, Save, Upload, Check, Ruler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// スライダーコンポーネント
const Slider = ({ value, onValueChange, min = 0, max = 100, step = 1, unit = "", label = "" }: { value: number, onValueChange: (value: number) => void, min?: number, max?: number, step?: number, unit?: string, label?: string }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{min}{unit}</span>
          <span className="font-medium text-primary">{value}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

// 数値入力コンポーネント
const NumericInput = ({ value, onValueChange, min = 0, max = 100, step = 1, unit = "", label = "", placeholder = "" }: { value: number, onValueChange: (value: number) => void, min?: number, max?: number, step?: number, unit?: string, label?: string, placeholder?: string }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ""}
          onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className="flex-1"
        />
        {unit && (
          <span className="text-sm text-muted-foreground font-medium">{unit}</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        範囲: {min}{unit} ～ {max}{unit}
      </div>
    </div>
  )
}

// フェーズの定義（数値入力対応版）
const phases = [
  {
    id: 1,
    name: "コンセプト",
    description: "デザインのコンセプトや目的を定義します",
    selections: [
      {
        id: "usage_scene",
        label: "着用シーン",
        type: "single_choice",
        options: [
          { value: "casual", label: "普段着・カジュアル", description: "日常生活での着用" },
          { value: "sport", label: "スポーツ・アクティブ", description: "運動や外遊び用" },
          { value: "work", label: "仕事・オフィス", description: "職場での着用" },
          { value: "formal", label: "フォーマル・特別な日", description: "きちんとした場面" }
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
        type: "single_choice",
        options: [
          { value: "cotton_100", label: "綿100%", description: "肌触り良く、吸湿性に優れる" },
          { value: "polyester", label: "ポリエステル", description: "速乾性があり、型崩れしにくい" },
          { value: "cotton_poly", label: "綿ポリ混紡", description: "両方の良さを兼ね備える" },
          { value: "organic", label: "オーガニック綿", description: "環境に優しい天然素材" }
        ]
      },
      {
        id: "fabric_thickness",
        label: "生地の厚さ",
        type: "slider",
        min: 100,
        max: 400,
        step: 10,
        unit: "g/m²",
        defaultValue: 180,
        description: "生地の重量（厚さ）を指定します"
      },
      {
        id: "stretch_percentage",
        label: "ストレッチ性",
        type: "slider",
        min: 0,
        max: 30,
        step: 1,
        unit: "%",
        defaultValue: 5,
        description: "生地の伸縮性を指定します（0%=伸びない、30%=よく伸びる）"
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
        type: "single_choice",
        options: [
          { value: "crew", label: "クルーネック", description: "定番の丸首" },
          { value: "v_neck", label: "Vネック", description: "V字型の首元" },
          { value: "u_neck", label: "Uネック", description: "U字型の首元" },
          { value: "henley", label: "ヘンリーネック", description: "ボタン付きの首元" }
        ]
      },
      {
        id: "v_neck_depth",
        label: "Vネックの深さ",
        type: "slider",
        min: 3,
        max: 12,
        step: 0.5,
        unit: "cm",
        defaultValue: 7,
        description: "Vネックの場合の深さを調整",
        condition: { field: "neckline", value: "v_neck" }
      },
      {
        id: "sleeve_length",
        label: "袖の長さ",
        type: "single_choice",
        options: [
          { value: "short", label: "半袖", description: "標準的な半袖" },
          { value: "long", label: "長袖", description: "手首まで覆う" },
          { value: "three_quarter", label: "七分袖", description: "肘と手首の間まで" },
          { value: "sleeveless", label: "ノースリーブ", description: "袖なし" }
        ]
      },
      {
        id: "sleeve_cuff_width",
        label: "袖口の折り返し幅",
        type: "numeric",
        min: 0,
        max: 8,
        step: 0.5,
        unit: "cm",
        defaultValue: 2,
        description: "袖口の折り返し部分の幅",
        condition: { field: "sleeve_length", value: ["short", "long", "three_quarter"] }
      },
      {
        id: "body_length",
        label: "着丈",
        type: "slider",
        min: 50,
        max: 80,
        step: 1,
        unit: "cm",
        defaultValue: 65,
        description: "首元から裾までの長さ（Mサイズ基準）"
      },
      {
        id: "body_width_adjustment",
        label: "身幅調整",
        type: "slider",
        min: -5,
        max: 10,
        step: 0.5,
        unit: "cm",
        defaultValue: 0,
        description: "標準サイズからの身幅調整（±で調整）"
      }
    ]
  },
  {
    id: 4,
    name: "詳細",
    description: "細部の仕様や装飾について指定します",
    selections: [
      {
        id: "pocket_style",
        label: "ポケット",
        type: "single_choice",
        options: [
          { value: "none", label: "なし", description: "シンプルなデザイン" },
          { value: "chest_left", label: "左胸ポケット", description: "定番の胸ポケット" },
          { value: "chest_both", label: "両胸ポケット", description: "左右両方にポケット" }
        ]
      },
      {
        id: "pocket_size",
        label: "ポケットサイズ",
        type: "numeric",
        min: 8,
        max: 15,
        step: 0.5,
        unit: "cm",
        defaultValue: 11,
        description: "ポケットの幅",
        condition: { field: "pocket_style", value: ["chest_left", "chest_both"] }
      },
      {
        id: "hem_curve",
        label: "裾のカーブ",
        type: "slider",
        min: 0,
        max: 5,
        step: 0.2,
        unit: "cm",
        defaultValue: 2,
        description: "裾の丸みの強さ（0=ストレート、5=大きなカーブ）"
      },
      {
        id: "side_seam_curve",
        label: "サイドシームのカーブ",
        type: "slider",
        min: 0,
        max: 3,
        step: 0.1,
        unit: "cm",
        defaultValue: 1,
        description: "脇線のカーブの強さ（ウエストシェイプ）"
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
        type: "multiple_choice",
        options: [
          { value: "xs", label: "XS", description: "エクストラスモール" },
          { value: "s", label: "S", description: "スモール" },
          { value: "m", label: "M", description: "ミディアム" },
          { value: "l", label: "L", description: "ラージ" },
          { value: "xl", label: "XL", description: "エクストララージ" }
        ]
      },
      {
        id: "size_grading",
        label: "サイズ間隔",
        type: "slider",
        min: 3,
        max: 8,
        step: 0.5,
        unit: "cm",
        defaultValue: 5,
        description: "各サイズ間の身幅差"
      }
    ]
  },
  {
    id: 6,
    name: "生産",
    description: "生産方法や品質基準について指定します",
    selections: [
      {
        id: "seam_allowance",
        label: "縫い代",
        type: "numeric",
        min: 0.5,
        max: 2,
        step: 0.1,
        unit: "cm",
        defaultValue: 1,
        description: "縫い代の幅"
      },
      {
        id: "stitch_density",
        label: "縫い目密度",
        type: "slider",
        min: 10,
        max: 16,
        step: 1,
        unit: "針/cm",
        defaultValue: 12,
        description: "1cmあたりの縫い目数（品質に関わる）"
      }
    ]
  },
  {
    id: 7,
    name: "確認",
    description: "全体の仕様を確認し、最終調整を行います",
    selections: [
      {
        id: "fitting_tolerance",
        label: "フィット許容範囲",
        type: "slider",
        min: 1,
        max: 5,
        step: 0.5,
        unit: "cm",
        defaultValue: 2,
        description: "着用時の余裕度"
      }
    ]
  }
]

export default function NumericInputPhasePage() {
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

  // 選択肢・数値の変更ハンドラー
  const handleValueChange = (selectionId: string, value: any, type: string) => {
    setSelections(prev => {
      const phaseKey = `phase_${currentPhase}`
      const phaseSelections = prev[phaseKey] || {}
      
      if (type === "multiple_choice") {
        const currentValues = phaseSelections[selectionId] || []
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v: string) => v !== value)
          : [...currentValues, value]
        
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
            [selectionId]: value
          }
        }
      }
    })
  }

  // 選択済み・入力済みかチェック
  const getValue = (selectionId: string, defaultValue?: any) => {
    const phaseKey = `phase_${currentPhase}`
    const phaseSelections = selections[phaseKey] || {}
    return phaseSelections[selectionId] ?? defaultValue
  }

  const isSelected = (selectionId: string, optionValue: string, isMultiple = false) => {
    const value = getValue(selectionId, isMultiple ? [] : null)
    
    if (isMultiple) {
      return Array.isArray(value) && value.includes(optionValue)
    } else {
      return value === optionValue
    }
  }

  // 条件付き表示のチェック
  const shouldShowField = (selection: any) => {
    if (!selection.condition) return true
    
    const conditionField = selection.condition.field
    const conditionValue = selection.condition.value
    const currentValue = getValue(conditionField)
    
    if (Array.isArray(conditionValue)) {
      return conditionValue.includes(currentValue)
    } else {
      return currentValue === conditionValue
    }
  }

  // 音声録音シミュレーション
  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        const phaseExamples = {
          1: "このTシャツは20代後半から30代の女性をターゲットにした夏物の新作です。",
          2: "素材は綿100%で、200g/m²程度の中厚、ストレッチ性は10%くらいがいいです。",
          3: "Vネックで深さは8cm、半袖で袖口の折り返しは3cm、着丈は70cmでお願いします。",
          4: "左胸ポケットで12cm幅、裾は軽くカーブさせて、サイドシームも少しカーブを付けたいです。",
          5: "S、M、Lの3展開で、サイズ間隔は5cmでお願いします。",
          6: "縫い代は1.2cm、縫い目密度は14針/cmで品質重視でお願いします。",
          7: "フィット許容範囲は2.5cmで、少しゆとりのある着心地にしたいです。",
        }

        setTranscript(phaseExamples[currentPhase as keyof typeof phaseExamples] || "")
        setIsRecording(false)

        setIsProcessing(true)
        setTimeout(() => {
          const suggestions = [
            "音声入力から数値情報を抽出し、スライダーに自動反映しました",
            "過去のプロジェクトと比較して、最適な数値範囲を提案します",
            "技術的制約をチェックし、実現可能な仕様に調整しました"
          ]
          setAiSuggestions(suggestions as never[])
          setIsProcessing(false)
        }, 2000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isRecording, currentPhase])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

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
          setUploadedImages(prev => [...prev, result] as never[])
          
          setIsProcessing(true)
          setTimeout(() => {
            const suggestions = [
              "画像から寸法情報を検出し、数値入力フィールドに反映しました",
              "デザイン要素を認識し、適切な数値範囲を提案します",
              "類似デザインのデータベースから最適な数値を検索中"
            ]
            setAiSuggestions(suggestions as never[])
            setIsProcessing(false)
          }, 2000)
        }
      }
      reader.readAsDataURL(file)
    })
  }

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

  const getPhaseCompletionRate = () => {
    const phaseKey = `phase_${currentPhase}`
    const phaseSelections = selections[phaseKey] || {}
    const requiredSelections = phase.selections?.filter(s => 
      s.type !== "multiple_choice" && shouldShowField(s)
    ) || []
    const completedSelections = requiredSelections.filter(s => {
      const value = phaseSelections[s.id]
      return value !== undefined && value !== null && value !== ""
    })
    
    return requiredSelections.length > 0 ? 
      Math.round((completedSelections.length / requiredSelections.length) * 100) : 100
  }

  // 入力フィールドのレンダリング
  const renderInputField = (selection: any) => {
    const currentValue = getValue(selection.id, selection.defaultValue)

    switch (selection.type) {
      case "single_choice":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selection.options.map((option: any) => (
              <div
                key={option.value}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                  isSelected(selection.id, option.value)
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
                onClick={() => handleValueChange(selection.id, option.value, "single_choice")}
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
        )

      case "multiple_choice":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selection.options.map((option: any) => (
              <div
                key={option.value}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                  isSelected(selection.id, option.value, true)
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
                onClick={() => handleValueChange(selection.id, option.value, "multiple_choice")}
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
        )

      case "slider":
        return (
          <div className="max-w-md">
            <Slider
              value={currentValue}
              onValueChange={(value) => handleValueChange(selection.id, value, "slider")}
              min={selection.min}
              max={selection.max}
              step={selection.step}
              unit={selection.unit}
              label=""
            />
            {selection.description && (
              <p className="text-sm text-muted-foreground mt-2">{selection.description}</p>
            )}
          </div>
        )

      case "numeric":
        return (
          <div className="max-w-md">
            <NumericInput
              value={currentValue}
              onValueChange={(value) => handleValueChange(selection.id, value, "numeric")}
              min={selection.min}
              max={selection.max}
              step={selection.step}
              unit={selection.unit}
              label=""
              placeholder={`${selection.min} ～ ${selection.max}`}
            />
            {selection.description && (
              <p className="text-sm text-muted-foreground mt-2">{selection.description}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">夏物新作Tシャツ</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              <Ruler className="h-3 w-3 mr-1" />
              数値入力対応版
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
              入力完了率: {getPhaseCompletionRate()}%
            </div>
          </div>
          <Progress value={(currentPhase / phases.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {phase.name}
              <Ruler className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>{phase.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="selections" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>入力</span>
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
                {phase.selections?.filter(shouldShowField).map((selection) => (
                  <div key={selection.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{selection.label}</h3>
                      {(selection.type === "slider" || selection.type === "numeric") && (
                        <Badge variant="secondary" className="text-xs">
                          {selection.type === "slider" ? "スライダー" : "数値入力"}
                        </Badge>
                      )}
                    </div>
                    {renderInputField(selection)}
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
                  <p className="text-sm text-muted-foreground">
                    💡 数値を含む音声（例：「袖口は3cm」「着丈70cm」）は自動的に数値入力欄に反映されます
                  </p>
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
                  <div className="text-center text-sm text-muted-foreground">
                    または画像をここにドラッグ＆ドロップ<br/>
                    <span className="text-xs">💡 寸法図や設計図から数値を自動抽出します</span>
                  </div>
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
                <span className="ml-3 text-lg">AIが数値を解析中...</span>
              </div>
            )}

            {aiSuggestions.length > 0 && (
              <Alert className="mt-6">
                <AlertTitle className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  AIからの数値提案
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

            {/* 数値入力のサマリー表示 */}
            {Object.keys(selections).length > 0 && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  現在の数値設定
                </h4>
                <div className="text-sm space-y-1">
                  {Object.entries(selections).map(([phaseKey, phaseSelections]) => {
                    const phaseNum = parseInt(phaseKey.split('_')[1])
                    const phaseName = phases.find(p => p.id === phaseNum)?.name
                    const phaseData = phases.find(p => p.id === phaseNum)
                    
                    return (
                      <div key={phaseKey}>
                        <strong className="text-primary">{phaseName}:</strong>{' '}
                        {Object.entries(phaseSelections).map(([selectionId, value]) => {
                          const selection = phaseData?.selections?.find(s => s.id === selectionId)
                          
                          if (!selection) return null
                          
                          if (selection.type === "slider" || selection.type === "numeric") {
                            return (
                              <span key={selectionId} className="inline-flex items-center gap-1 mr-3">
                                <Badge variant="outline" className="text-xs">
                                  {selection.label}: {value as number}{selection.unit}
                                </Badge>
                              </span>
                            )
                          } else if (Array.isArray(value)) {
                            return `${selection.label}: ${value.length}項目選択`
                          } else {
                            const option = selection.options?.find((o: any) => o.value === value)
                            return `${selection.label}: ${option?.label}`
                          }
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
              const requiredSelections = p.selections?.filter(s => s.type !== "multiple_choice") || []
              const completedSelections = requiredSelections.filter(s => {
                const value = phaseSelections[s.id]
                return value !== undefined && value !== null && value !== ""
              })
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

        {/* 技術仕様書プレビュー */}
        {Object.keys(selections).length > 0 && (
          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              技術仕様書プレビュー
            </h3>
            <div className="space-y-4 text-sm">
              {Object.entries(selections).map(([phaseKey, phaseSelections]) => {
                const phaseNum = parseInt(phaseKey.split('_')[1])
                const phaseData = phases.find(p => p.id === phaseNum)
                
                return (
                  <div key={phaseKey} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-primary mb-2">{phaseData?.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(phaseSelections).map(([selectionId, value]) => {
                        const selection = phaseData?.selections?.find(s => s.id === selectionId)
                        if (!selection) return null
                        
                        return (
                          <div key={selectionId} className="mb-2">
                            <span className="font-medium">{selection.label}:</span>{' '}
                            {selection.type === "slider" || selection.type === "numeric" ? (
                              <Badge variant="outline" className="ml-1">
                                {value as number}{selection.unit}
                              </Badge>
                            ) : Array.isArray(value) ? (
                              <span>
                                {value.map(v => {
                                  const option = selection.options?.find((o: any) => o.value === v)
                                  return option?.label
                                }).join(', ')}
                              </span>
                            ) : (
                              <span>
                                {selection.options?.find((o: any) => o.value === value)?.label}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 数値設定のサマリー */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                重要な寸法データ
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {Object.entries(selections).flatMap(([phaseKey, phaseSelections]) => {
                  const phaseNum = parseInt(phaseKey.split('_')[1])
                  const phaseData = phases.find(p => p.id === phaseNum)
                  
                  return Object.entries(phaseSelections)
                    .map(([selectionId, value]) => {
                      const selection = phaseData?.selections?.find(s => s.id === selectionId)
                      if (!selection || (selection.type !== "slider" && selection.type !== "numeric")) return null
                      
                      return (
                        <div key={`${phaseKey}-${selectionId}`} className="text-center">
                          <div className="text-xs text-muted-foreground">{selection.label}</div>
                          <div className="text-lg font-bold text-primary">
                            {value as number}{selection.unit}
                          </div>
                        </div>
                      )
                    })
                    .filter(Boolean)
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}