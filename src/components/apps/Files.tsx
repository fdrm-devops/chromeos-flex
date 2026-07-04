import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Grid, 
  List, 
  ArrowUpDown, 
  MoreVertical,
  Clock,
  BookOpen,
  CheckSquare,
  Laptop,
  Download,
  Terminal,
  Play,
  Cloud,
  Folder,
  FileText,
  HelpCircle
} from "lucide-react";

interface FileItem {
  name: string;
  size: string;
  type: string;
  modified: string;
  isFolder: boolean;
}

interface DirData {
  [key: string]: {
    path: string[];
    items: FileItem[];
  };
}

const mockDirectories: DirData = {
  recent: {
    path: ["Recent"],
    items: [
      { name: "boot-logo.svg", size: "12 KB", type: "SVG Image", modified: "Jul 3, 2026, 10:45 PM", isFolder: false },
      { name: "resume.pdf", size: "2.4 MB", type: "PDF Document", modified: "Jun 28, 2026, 3:12 PM", isFolder: false }
    ]
  },
  book: {
    path: ["Book"],
    items: [
      { name: "ChromeOS Flex Manual.pdf", size: "4.8 MB", type: "PDF Document", modified: "Jun 10, 2026, 9:20 AM", isFolder: false },
      { name: "Ebook Reader guide.epub", size: "8.1 MB", type: "EPUB Document", modified: "Jun 1, 2026, 4:15 PM", isFolder: false }
    ]
  },
  todo: {
    path: ["Microsoft OneDrive", "Work", "To-do"],
    items: [
      { name: "Hands-On Windows", size: "--", type: "Folder", modified: "Apr 9, 2026, 12:39 PM", isFolder: true },
      { name: "Markdown", size: "--", type: "Folder", modified: "Apr 5, 2026, 10:11 AM", isFolder: true },
      { name: "Copilot+ PC Field Guide", size: "--", type: "Folder", modified: "Mar 30, 2026, 5:42 PM", isFolder: true },
      { name: "Switcher", size: "--", type: "Folder", modified: "Mar 16, 2026, 7:45 AM", isFolder: true },
      { name: "WinUIpad + Clairvoyance", size: "--", type: "Folder", modified: "Mar 4, 2026, 3:13 PM", isFolder: true },
      { name: "Nostalgia focus", size: "--", type: "Folder", modified: "Feb 24, 2026, 5:29 PM", isFolder: true },
      { name: "De-Enshittify Windows 11", size: "--", type: "Folder", modified: "Feb 5, 2026, 10:43 AM", isFolder: true },
      { name: "2026 Security series", size: "--", type: "Folder", modified: "Jan 21, 2026, 3:46 PM", isFolder: true },
      { name: "Eternal Spring", size: "--", type: "Folder", modified: "Nov 24, 2025, 11:09 AM", isFolder: true },
      { name: "Reviews", size: "--", type: "Folder", modified: "Nov 24, 2025, 11:03 AM", isFolder: true }
    ]
  },
  downloads: {
    path: ["My files", "Downloads"],
    items: [
      { name: "boot-logo.svg", size: "12 KB", type: "SVG Image", modified: "Jul 3, 2026, 10:45 PM", isFolder: false },
      { name: "chrome-os-wallpaper.jpg", size: "1.8 MB", type: "JPEG Image", modified: "Jul 2, 2026, 8:30 AM", isFolder: false }
    ]
  },
  linux: {
    path: ["My files", "Linux files"],
    items: [
      { name: "projects", size: "--", type: "Folder", modified: "Jun 14, 2026, 1:10 PM", isFolder: true },
      { name: "bashrc", size: "4 KB", type: "Configuration", modified: "May 1, 2026, 11:00 AM", isFolder: false }
    ]
  },
  play: {
    path: ["My files", "Play files"],
    items: [
      { name: "Music", size: "--", type: "Folder", modified: "Apr 1, 2026, 8:00 AM", isFolder: true },
      { name: "Movies", size: "--", type: "Folder", modified: "Apr 1, 2026, 8:00 AM", isFolder: true }
    ]
  },
  drive: {
    path: ["Google Drive"],
    items: [
      { name: "My Drive", size: "--", type: "Folder", modified: "Jul 4, 2026, 10:00 AM", isFolder: true },
      { name: "Shared with me", size: "--", type: "Folder", modified: "Jul 1, 2026, 9:00 AM", isFolder: true }
    ]
  },
  onedrive_attachments: {
    path: ["Microsoft OneDrive", "Attachments"],
    items: [
      { name: "invoice_7782.xlsx", size: "45 KB", type: "Excel Sheet", modified: "May 2, 2026, 10:20 AM", isFolder: false }
    ]
  },
  onedrive_documents: {
    path: ["Microsoft OneDrive", "Documents"],
    items: [
      { name: "ChromeOS_Proposal.docx", size: "180 KB", type: "Word Document", modified: "May 4, 2026, 11:33 AM", isFolder: false }
    ]
  }
};

export default function Files() {
  const [activeDirKey, setActiveDirKey] = useState<string>("todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Collapse states for sidebar nodes
  const [myFilesExpanded, setMyFilesExpanded] = useState(true);
  const [oneDriveExpanded, setOneDriveExpanded] = useState(true);

  const activeDir = mockDirectories[activeDirKey] || mockDirectories.todo;
  
  // Filter search
  const filteredItems = activeDir.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.isFolder) {
      const nameKey = item.name.toLowerCase().replace(" ", "");
      if (nameKey === "attachments") {
        setActiveDirKey("onedrive_attachments");
      } else if (nameKey === "documents") {
        setActiveDirKey("onedrive_documents");
      } else {
        alert(`Opening folder: ${item.name}`);
      }
    } else {
      alert(`Opening file: ${item.name}`);
    }
  };

  return (
    <div className="flex size-full bg-[#ffece5] dark:bg-[#1a1a1c] text-zinc-800 dark:text-neutral-200 select-none overflow-hidden h-full rounded-b-lg">
      
      {/* 1. LEFT SIDEBAR - Matches 100% the Screenshot Layout */}
      <div className="w-[280px] shrink-0 bg-[#ffece5] dark:bg-[#202124]/40 border-r border-foreground/5 dark:border-white/5 flex flex-col pt-4 pr-1 overflow-y-auto scrollbar-none text-zinc-800 dark:text-neutral-300">
        
        {/* Recent */}
        <button
          onClick={() => setActiveDirKey("recent")}
          className={cn(
            "flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] text-left text-[13px] font-semibold cursor-pointer transition-colors",
            activeDirKey === "recent"
              ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
              : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
          )}
        >
          <div className="w-4 flex items-center justify-center mr-1" />
          <Clock className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
          <span>Recent</span>
        </button>

        {/* Book */}
        <button
          onClick={() => setActiveDirKey("book")}
          className={cn(
            "flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] text-left text-[13px] font-semibold cursor-pointer transition-colors mt-0.5",
            activeDirKey === "book"
              ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
              : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
          )}
        >
          <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▶</span>
          <Folder className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
          <span>Book</span>
        </button>

        {/* To-do */}
        <button
          onClick={() => setActiveDirKey("todo")}
          className={cn(
            "flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] text-left text-[13px] font-semibold cursor-pointer transition-colors mt-0.5",
            activeDirKey === "todo"
              ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
              : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
          )}
        >
          <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▶</span>
          <Folder className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
          <span>To-do</span>
        </button>

        <div className="h-[1px] bg-zinc-300/40 dark:bg-white/5 my-2 ml-4 mr-2" />

        {/* My Files Group */}
        <div>
          <button 
            onClick={() => setMyFilesExpanded(!myFilesExpanded)}
            className="flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] hover:bg-foreground/5 text-left text-[13px] font-semibold text-zinc-800 dark:text-neutral-200 cursor-pointer"
          >
            {myFilesExpanded ? (
              <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▼</span>
            ) : (
              <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▶</span>
            )}
            <Laptop className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
            <span>My files</span>
          </button>

          {myFilesExpanded && (
            <div className="pl-6 flex flex-col">
              {/* Downloads */}
              <button
                onClick={() => setActiveDirKey("downloads")}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-1.5 w-[calc(100%-1.5rem)] mx-2 rounded-[8px] text-left text-[13px] font-semibold transition-colors cursor-pointer mt-0.5",
                  activeDirKey === "downloads"
                    ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
                )}
              >
                <Download className="size-4.5 shrink-0 mr-0.5 text-zinc-700 dark:text-neutral-300" />
                <span>Downloads</span>
              </button>

              {/* Linux files */}
              <button
                onClick={() => setActiveDirKey("linux")}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-1.5 w-[calc(100%-1.5rem)] mx-2 rounded-[8px] text-left text-[13px] font-semibold transition-colors cursor-pointer mt-0.5",
                  activeDirKey === "linux"
                    ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
                )}
              >
                <Terminal className="size-4.5 shrink-0 mr-0.5 text-zinc-700 dark:text-neutral-300" />
                <span>Linux files</span>
              </button>

              {/* Play files */}
              <button
                onClick={() => setActiveDirKey("play")}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-1.5 w-[calc(100%-1.5rem)] mx-2 rounded-[8px] text-left text-[13px] font-semibold transition-colors cursor-pointer mt-0.5",
                  activeDirKey === "play"
                    ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
                )}
              >
                <Play className="size-4.5 shrink-0 mr-0.5 text-zinc-700 dark:text-neutral-300" />
                <span>Play files</span>
              </button>
            </div>
          )}
        </div>

        {/* Google Drive Group */}
        <div className="mt-1">
          <button 
            onClick={() => setActiveDirKey("drive")}
            className={cn(
              "flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] text-left text-[13px] font-semibold cursor-pointer",
              activeDirKey === "drive"
                ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
            )}
          >
            <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▶</span>
            <Cloud className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
            <span>Google Drive</span>
          </button>
        </div>

        {/* Microsoft OneDrive Group */}
        <div className="mt-1">
          <button 
            onClick={() => setOneDriveExpanded(!oneDriveExpanded)}
            className="flex items-center w-[calc(100%-1rem)] mx-2 px-4 py-1.5 rounded-[8px] hover:bg-foreground/5 text-left text-[13px] font-semibold text-zinc-800 dark:text-neutral-200 cursor-pointer"
          >
            {oneDriveExpanded ? (
              <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▼</span>
            ) : (
              <span className="text-[8px] text-zinc-600 dark:text-neutral-400 shrink-0 w-3.5 mr-1 select-none flex items-center justify-center">▶</span>
            )}
            <Cloud className="size-4.5 shrink-0 mr-2.5 text-zinc-700 dark:text-neutral-300" />
            <span>Microsoft OneDrive</span>
          </button>

          {oneDriveExpanded && (
            <div className="pl-6 flex flex-col">
              {/* Attachments */}
              <button
                onClick={() => setActiveDirKey("onedrive_attachments")}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-1.5 w-[calc(100%-1.5rem)] mx-2 rounded-[8px] text-left text-[13px] font-semibold transition-colors cursor-pointer mt-0.5",
                  activeDirKey === "onedrive_attachments"
                    ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
                )}
              >
                <Folder className="size-4.5 shrink-0 mr-0.5 text-zinc-700 dark:text-neutral-300" />
                <span>Attachments</span>
              </button>

              {/* Documents */}
              <button
                onClick={() => setActiveDirKey("onedrive_documents")}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-1.5 w-[calc(100%-1.5rem)] mx-2 rounded-[8px] text-left text-[13px] font-semibold transition-colors cursor-pointer mt-0.5",
                  activeDirKey === "onedrive_documents"
                    ? "bg-zinc-200/80 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "hover:bg-foreground/5 text-zinc-700 dark:text-neutral-300"
                )}
              >
                <span className="text-[8px] text-zinc-500 shrink-0 w-3 mr-0.5 select-none flex items-center justify-center">▶</span>
                <Folder className="size-4.5 shrink-0 text-zinc-700 dark:text-neutral-300" />
                <span>Documents</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 2. RIGHT WORKSPACE */}
      <div className="flex-1 bg-[#ffece5] dark:bg-[#1a1a1c] p-3 pl-1 pr-3 pb-3 overflow-hidden flex flex-col">
        
        <div className="size-full bg-white dark:bg-[#202124] rounded-[16px] overflow-hidden flex flex-col shadow-sm">
          
          {/* Action Header */}
          <div className="h-12 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#202124] border-b border-foreground/5 dark:border-white/5">
          {/* Breadcrumbs */}
          <div className="flex items-center text-[13.5px] font-semibold text-zinc-800 dark:text-neutral-200 truncate max-w-sm md:max-w-md">
            {activeDir.path.map((folder, index) => (
              <div key={folder} className="flex items-center">
                {index > 0 && <span className="mx-2.5 text-zinc-400 font-bold text-[10px]"> &gt; </span>}
                {index === activeDir.path.length - 2 && activeDir.path.length > 3 ? (
                  <span className="text-zinc-400 font-medium">...</span>
                ) : (
                  <span className={index === activeDir.path.length - 1 ? "text-zinc-950 dark:text-white font-bold" : "text-zinc-600 dark:text-neutral-400"}>
                    {folder}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search Input (Collapsible) */}
            {isSearchOpen ? (
              <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-2.5 py-1 mr-1 transition-all duration-300">
                <span className="icon text-[18px] text-zinc-700 dark:text-neutral-300 mr-1.5">search</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (searchQuery === "") {
                      setIsSearchOpen(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                    }
                  }}
                  className="bg-transparent border-none text-[12px] outline-none w-28 text-zinc-800 dark:text-neutral-200"
                />
                {searchQuery !== "" && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-700 dark:text-neutral-400 dark:hover:text-white ml-1 cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-800 dark:text-neutral-200 cursor-pointer flex items-center justify-center"
              >
                <span className="icon text-[20px]">search</span>
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-800 dark:text-neutral-200 cursor-pointer flex items-center justify-center"
            >
              {viewMode === "list" ? (
                <span className="icon text-[20px]">calendar_view_month</span>
              ) : (
                <span className="icon text-[20px]">view_list</span>
              )}
            </button>

            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-800 dark:text-neutral-200 cursor-pointer flex items-center justify-center">
              <span className="icon text-[20px]">sort_by_alpha</span>
            </button>

            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-800 dark:text-neutral-200 cursor-pointer flex items-center justify-center">
              <span className="icon text-[20px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-none">
          {viewMode === "list" ? (
            /* TABLE LIST VIEW - Matches 100% the Screenshot Layout */
            <table className="w-full text-left border-collapse text-[12.5px] text-zinc-800 dark:text-neutral-200">
              <thead>
                <tr className="border-b border-zinc-200/60 dark:border-white/10 text-zinc-500 dark:text-neutral-400">
                  <th className="py-2.5 font-medium pl-2 text-zinc-800 dark:text-neutral-200">Name</th>
                  <th className="py-2.5 font-medium border-l border-zinc-200/80 dark:border-white/10 pl-4 pr-2 text-zinc-800 dark:text-neutral-200">Size</th>
                  <th className="py-2.5 font-medium border-l border-zinc-200/80 dark:border-white/10 pl-4 pr-2 text-zinc-800 dark:text-neutral-200">Type</th>
                  <th className="py-2.5 font-medium border-l border-zinc-200/80 dark:border-white/10 pl-4 pr-2 text-zinc-800 dark:text-neutral-200">
                    <span className="flex items-center gap-1">
                      Date modified <span className="icon text-[14px] ml-0.5">arrow_downward</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-zinc-400">No files found</td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.name + idx}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className="border-b border-zinc-100/40 dark:border-white/[0.02] hover:bg-[#ffdbc1]/10 dark:hover:bg-[#fbb991]/5 cursor-pointer group transition-colors"
                    >
                      <td className="py-2.5 pl-2 flex items-center gap-3 pr-2 text-zinc-800 dark:text-neutral-200">
                        {item.isFolder ? (
                          <span className="icon text-[20px] text-zinc-700 dark:text-neutral-300">folder</span>
                        ) : (
                          <span className="icon text-[20px] text-zinc-500 dark:text-neutral-400">description</span>
                        )}
                        <span className="truncate group-hover:text-zinc-950 dark:group-hover:text-white font-medium">
                          {item.name}
                        </span>
                      </td>
                      <td className="py-2.5 pl-4 pr-2 text-zinc-500 dark:text-neutral-400">{item.size}</td>
                      <td className="py-2.5 pl-4 pr-2 text-zinc-500 dark:text-neutral-400">{item.type}</td>
                      <td className="py-2.5 pl-4 pr-2 text-zinc-500 dark:text-neutral-400">{item.modified}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
              {filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-8 text-zinc-400">No files found</div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-foreground/5 dark:border-white/5 hover:bg-[#ffdbc1]/15 dark:hover:bg-[#fbb991]/5 hover:border-[#fbb991]/30 transition-all cursor-pointer group text-center"
                  >
                    {item.isFolder ? (
                      <Folder className="size-9 text-zinc-600 dark:text-neutral-400 mb-2 group-hover:scale-105 transition-transform" />
                    ) : (
                      <FileText className="size-9 text-zinc-400 dark:text-neutral-500 mb-2 group-hover:scale-105 transition-transform" />
                    )}
                    <span className="text-[11px] font-medium text-zinc-700 dark:text-neutral-300 line-clamp-2 w-full break-all">
                      {item.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
      
    </div>
  </div>
  );
}
