"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Settings, Code2, ExternalLink, Plus, Minus, Square, X } from "lucide-react"

export default function Component() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 text-white rounded-lg overflow-hidden shadow-2xl">
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
            <Minus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
            <Square className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 space-y-6">
        {/* Linux Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Linux</h3>
                <p className="text-gray-400 text-sm">Visit Developer Options to manage Linux</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Set up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SSH Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">SSH</h3>
                <p className="text-gray-400 text-sm">Connections to remote devices will appear here</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add SSH
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-gray-700" />

        {/* Settings Section */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 p-3 h-auto"
          >
            <Settings className="h-4 w-4 mr-3" />
            Terminal Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800 p-3 h-auto"
          >
            <div className="flex items-center">
              <Code2 className="h-4 w-4 mr-3" />
              Developer Settings
            </div>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
