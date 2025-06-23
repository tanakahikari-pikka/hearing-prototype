"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Copy, Download, FileText, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ResultPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("preview")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(specificationText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const specificationText = `# 夏物新作ワンピース 仕様書

## 基本情報
- プロジェクト名: 夏物新作ワンピース
- 作成日: 2025年6月13日
- 担当デザイナー: 山田花子

## コンセプト
このワンピースは20代後半から30代の女性をターゲットにした夏物の新作です。海辺のリゾートでも街中でも着られる、軽やかで涼しげな印象を与えるデザインです。

## 素材
- 素材: 綿100%の薄手の生地
- 特性: 肌触りが良く通気性の高いもの
- 色: 淡いブルー (RGB: 120, 180, 210)
- 柄: 白い小さな花柄のプリント (約2cm間隔)

## 形状
- シルエット: Aライン
- ウエスト: ゴム仕様
- 丈: 膝下 (Mサイズで100cm)
- 袖: 短めのフレア袖
- 首元: Vネック

## 詳細
- ポケット: 両サイドに配置
- 裾: 小さなフリル付き
- 留め具: ボタンやファスナーなし、シンプルなデザイン

## サイズ展開
- サイズ: S, M, L の3展開
- Mサイズ基準:
  - 着丈: 100cm
  - バスト: 90cm
  - ウエスト(ゴム伸縮前): 70cm

## 生産上の注意点
- 縫製: 袖のフリル部分と裾のフリル部分は生地が波打たないように注意
- 洗濯: 縮みを考慮した作り
- 品質管理: 色ムラがないように注意

## 備考
全体的に軽やかで涼しげな印象のワンピースで、リゾート感がありながらも街中でも着られるデザインです。素材の風合いを活かした、シンプルながらも女性らしいシルエットを重視しています。`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Link
              href={`/forms/${params.id}/phases/7`}
              className="flex items-center text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> 編集に戻る
            </Link>
            <h1 className="text-2xl font-bold">夏物新作ワンピース</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              プロジェクトID: {params.id}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              完了
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>仕様書</CardTitle>
            <CardDescription>AIによって生成された仕様書です。必要に応じて編集できます。</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="preview">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>プレビュー</span>
                </TabsTrigger>
                <TabsTrigger value="text">
                  <span>テキスト</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-6">
                <div className="prose max-w-none">
                  <h1>夏物新作ワンピース 仕様書</h1>

                  <h2>基本情報</h2>
                  <ul>
                    <li>プロジェクト名: 夏物新作ワンピース</li>
                    <li>作成日: 2025年6月13日</li>
                    <li>担当デザイナー: 山田花子</li>
                  </ul>

                  <h2>コンセプト</h2>
                  <p>
                    このワンピースは20代後半から30代の女性をターゲットにした夏物の新作です。
                    海辺のリゾートでも街中でも着られる、軽やかで涼しげな印象を与えるデザインです。
                  </p>

                  <h2>素材</h2>
                  <ul>
                    <li>素材: 綿100%の薄手の生地</li>
                    <li>特性: 肌触りが良く通気性の高いもの</li>
                    <li>色: 淡いブルー (RGB: 120, 180, 210)</li>
                    <li>柄: 白い小さな花柄のプリント (約2cm間隔)</li>
                  </ul>

                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="border rounded-md p-2">
                      <img
                        src="/placeholder.svg?height=200&width=300"
                        alt="素材イメージ"
                        className="w-full h-auto object-cover rounded"
                      />
                      <div className="text-xs text-center mt-1">素材イメージ</div>
                    </div>
                    <div className="border rounded-md p-2">
                      <img
                        src="/placeholder.svg?height=200&width=300"
                        alt="柄イメージ"
                        className="w-full h-auto object-cover rounded"
                      />
                      <div className="text-xs text-center mt-1">柄イメージ</div>
                    </div>
                  </div>

                  <h2>形状</h2>
                  <ul>
                    <li>シルエット: Aライン</li>
                    <li>ウエスト: ゴム仕様</li>
                    <li>丈: 膝下 (Mサイズで100cm)</li>
                    <li>袖: 短めのフレア袖</li>
                    <li>首元: Vネック</li>
                  </ul>

                  <div className="border rounded-md p-2 my-4">
                    <img
                      src="/placeholder.svg?height=400&width=300"
                      alt="デザインスケッチ"
                      className="w-full h-auto object-cover rounded"
                    />
                    <div className="text-xs text-center mt-1">デザインスケッチ</div>
                  </div>

                  <h2>詳細</h2>
                  <ul>
                    <li>ポケット: 両サイドに配置</li>
                    <li>裾: 小さなフリル付き</li>
                    <li>留め具: ボタンやファスナーなし、シンプルなデザイン</li>
                  </ul>

                  <h2>サイズ展開</h2>
                  <ul>
                    <li>サイズ: S, M, L の3展開</li>
                    <li>
                      Mサイズ基準:
                      <ul>
                        <li>着丈: 100cm</li>
                        <li>バスト: 90cm</li>
                        <li>ウエスト(ゴム伸縮前): 70cm</li>
                      </ul>
                    </li>
                  </ul>

                  <h2>生産上の注意点</h2>
                  <ul>
                    <li>縫製: 袖のフリル部分と裾のフリル部分は生地が波打たないように注意</li>
                    <li>洗濯: 縮みを考慮した作り</li>
                    <li>品質管理: 色ムラがないように注意</li>
                  </ul>

                  <h2>備考</h2>
                  <p>
                    全体的に軽やかで涼しげな印象のワンピースで、リゾート感がありながらも街中でも着られるデザインです。
                    素材の風合いを活かした、シンプルながらも女性らしいシルエットを重視しています。
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="text">
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-muted overflow-auto text-sm whitespace-pre-wrap">
                    {specificationText}
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> PDFでダウンロード
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> パタンナーと共有
            </Button>
            <Button className="ml-auto">新しいプロジェクトを開始</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
