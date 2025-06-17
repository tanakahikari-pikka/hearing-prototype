import Link from "next/link"


export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">デザイン仕様作成支援ツール</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            音声入力と画像アップロードで、直感的にデザイン仕様を作成・推敲できます
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <FileAudio className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>音声入力</CardTitle>
              <CardDescription>自然言語での仕様伝達を録音するだけ。専門用語を知らなくても大丈夫です。</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <ImagePlus className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>画像アップロード</CardTitle>
              <CardDescription>スケッチや参考画像をドラッグ＆ドロップするだけで、AIが自動解析します。</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <Zap className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>AI推敲</CardTitle>
              <CardDescription>入力内容をAIが自動分析し、不足情報や矛盾点を指摘・提案します。</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader>
              <Layers className="h-8 w-8 text-amber-500 mb-2" />
              <CardTitle>段階的プロセス</CardTitle>
              <CardDescription>7つのフェーズに分けて入力を進め、いつでも前後のステップに戻れます。</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-rose-500 mb-2" />
              <CardTitle>自動仕様書生成</CardTitle>
              <CardDescription>入力内容から最終的な仕様書を自動生成。パタンナーとの共有も簡単です。</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-teal-500 mb-2" />
              <CardTitle>提案機能</CardTitle>
              <CardDescription>過去のプロジェクトやトレンドに基づいた提案で、創造性をサポートします。</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-center mb-16">
          <Link href="/projects/new">
            <Button size="lg" className="gap-2">
              新しいプロジェクトを開始 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="border rounded-lg p-6 bg-muted/30">
          <h2 className="text-2xl font-semibold mb-4">使い方</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>「新しいプロジェクトを開始」ボタンをクリックしてプロジェクトを作成</li>
            <li>7つのフェーズに沿って、音声または画像で仕様を入力</li>
            <li>AIによる分析結果を確認し、必要に応じて修正</li>
            <li>最終的な仕様書を生成し、パタンナーと共有</li>
            <li>フィードバックを受け取り、必要に応じて仕様を更新</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
