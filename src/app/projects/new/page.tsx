"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"

export default function NewProject() {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      router.push("/projects/1/phases/1")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> ホームに戻る
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">新しいプロジェクトを作成</CardTitle>
            <CardDescription>プロジェクトの基本情報を入力してください。後で編集することもできます。</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">プロジェクト名</Label>
                <Input
                  id="project-name"
                  placeholder="例: 夏物新作ワンピース"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">プロジェクト概要（任意）</Label>
                <Textarea
                  id="project-description"
                  placeholder="プロジェクトの目的や背景などを簡単に記述してください"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>テンプレート（任意）</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="font-medium">アパレル - 新作</div>
                    <div className="text-sm text-muted-foreground">新しい衣料品のデザイン仕様</div>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="font-medium">アパレル - 改良</div>
                    <div className="text-sm text-muted-foreground">既存商品の改良・修正</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="gap-2">
                次へ進む <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
