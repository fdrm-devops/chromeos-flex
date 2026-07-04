"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Menu, Search, Minus, Square, X, FileText, FolderOpen, Save, SaveAll, Settings } from "lucide-react"

export default function Component() {
  const [content, setContent] = useState("de")
  const [searchQuery, setSearchQuery] = useState("")
  const [fileName, _] = useState("Untitled 1")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true)

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasUnsavedChanges(true)
  }

  const menuItems = [
    { icon: FileText, label: "New", action: () => {} },
    { icon: FolderOpen, label: "Open", action: () => {} },
    { icon: Save, label: "Save", action: () => setHasUnsavedChanges(false) },
    { icon: SaveAll, label: "Save as", action: () => {} },
  ]

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">Text</span>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 bg-white border-gray-300 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{fileName}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200">
              <Square className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Menu Items */}
          <div className="p-2 space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-8 px-3 text-sm font-normal text-gray-700 hover:bg-gray-200"
                onClick={item.action}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          <Separator className="mx-2" />

          {/* File List */}
          <div className="p-2 flex-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-8 px-3 text-sm font-normal bg-gray-200 text-gray-900"
            >
              {fileName} {hasUnsavedChanges && "*"}
            </Button>
          </div>

          {/* Settings */}
          <div className="p-2 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start h-8 px-3 text-sm font-normal text-gray-700 hover:bg-gray-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex">
          {/* Line Numbers */}
          <div className="w-12 bg-gray-50 border-r border-gray-200 p-2 text-right text-sm text-gray-500 font-mono">
            <div className="leading-6">1.</div>
          </div>

          {/* Text Editor */}
          <div className="flex-1 p-4">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full resize-none border-none shadow-none focus-visible:ring-0 font-mono text-sm leading-6 p-0"
              placeholder="Start typing..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
