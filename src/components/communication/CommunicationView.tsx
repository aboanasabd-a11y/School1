import React, { useState } from "react";
import { useSchool } from "../../context/SchoolContext";
import { Announcement, DirectMessage } from "../../types";
import {
  Megaphone,
  MessageSquare,
  Sparkles,
  Plus,
  Heart,
  Send,
  User,
  Paperclip,
  CheckCircle,
  Clock,
  Filter,
  FileText,
  X,
} from "lucide-react";

export const CommunicationView: React.FC = () => {
  const {
    announcements,
    directMessages,
    currentUser,
    userProfiles,
    addAnnouncement,
    toggleLikeAnnouncement,
    sendDirectMessage,
    replyDirectMessage,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<"announcements" | "messages">("announcements");
  const [filterAudience, setFilterAudience] = useState<string>("all");

  // Selected Direct Message Conversation
  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    directMessages[0]?.id || ""
  );
  const [replyText, setReplyText] = useState("");

  // New Announcement Modal
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    targetAudience: "all" as Announcement["targetAudience"],
    isPinned: false,
    hasAttachment: false,
    attachmentName: "تعميم_وزاري_رسمي.pdf",
  });

  // AI Announcement Generator state
  const [aiTopic, setAiTopic] = useState("");
  const [aiTarget, setAiTarget] = useState("all");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New Direct Message Modal
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [newMsgForm, setNewMsgForm] = useState({
    receiverId: userProfiles.find((u) => u.id !== currentUser.id)?.id || "",
    subject: "",
    content: "",
  });

  const selectedConversation = directMessages.find((m) => m.id === selectedMessageId) || directMessages[0];

  const filteredAnnouncements = announcements.filter(
    (a) => filterAudience === "all" || a.targetAudience === filterAudience
  );

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title: annForm.title,
      content: annForm.content,
      targetAudience: annForm.targetAudience,
      authorName: currentUser.fullName,
      authorRole: currentUser.role === "super_admin" ? "مدير المدرسة" : "الكادر الإداري",
      isPinned: annForm.isPinned,
      attachments: annForm.hasAttachment ? [annForm.attachmentName] : [],
    });
    setShowAddAnnModal(false);
    setAnnForm({
      title: "",
      content: "",
      targetAudience: "all",
      isPinned: false,
      hasAttachment: false,
      attachmentName: "تعميم_وزاري_رسمي.pdf",
    });
  };

  const handleAiDraftAnnouncement = async () => {
    if (!aiTopic.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/draft-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          targetAudience: aiTarget,
          tone: "official",
        }),
      });
      const data = await response.json();
      if (data.draft) {
        setAnnForm((prev) => ({
          ...prev,
          title: data.draft.title || aiTopic,
          content: data.draft.content || data.draft,
        }));
      }
    } catch (e) {
      console.error("AI Draft failed:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversation) return;
    replyDirectMessage(selectedConversation.id, replyText);
    setReplyText("");
  };

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendDirectMessage(newMsgForm.receiverId, newMsgForm.subject, newMsgForm.content);
    setShowNewMsgModal(false);
    setNewMsgForm({
      receiverId: userProfiles.find((u) => u.id !== currentUser.id)?.id || "",
      subject: "",
      content: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              مركز التواصل والإعلانات والمراسلات المباشرة
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            نشر التعاميم الرسمية، الإعلانات المدرسية، وقناة المحادثة والتواصل الفوري مع أولياء الأمور والمعلمين.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "announcements"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            التعاميم والإعلانات ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "messages"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الرسائل والمحادثات ({directMessages.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="all">كل الفئات المستهدفة</option>
                <option value="parents">أولياء الأمور فقط</option>
                <option value="teachers">الكادر التعليمي فقط</option>
                <option value="students">الطلاب</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddAnnModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              نشر إعلان / تعميم جديد
            </button>
          </div>

          {/* Announcements Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
                  ann.isPinned ? "border-indigo-300 ring-1 ring-indigo-200 bg-indigo-50/10" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ann.targetAudience === "all"
                        ? "الجميع"
                        : ann.targetAudience === "parents"
                        ? "أولياء الأمور"
                        : "المعلمين"}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2.5 leading-snug">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  {/* Attachments */}
                  {ann.attachments && ann.attachments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      {ann.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span>{att}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ann.authorName} ({ann.authorRole})</span>
                  </div>

                  <button
                    onClick={() => toggleLikeAnnouncement(ann.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                      ann.userLiked
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${ann.userLiked ? "fill-rose-600" : ""}`} />
                    <span>{ann.likesCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Direct Messaging & Parent Chat */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
          {/* Conversation List (1 Col) */}
          <div className="border-l border-slate-200 p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">المحادثات المباشرة</h3>
              <button
                onClick={() => setShowNewMsgModal(true)}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                title="محادثة جديدة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {directMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedConversation?.id === msg.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{msg.senderName}</span>
                        <span className={`text-[10px] ${selectedConversation?.id === msg.id ? "text-indigo-200" : "text-slate-400"}`}>
                          {msg.timestamp.split(" ")[0]}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${selectedConversation?.id === msg.id ? "text-indigo-100" : "text-slate-500"}`}>
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Window (2 Cols) */}
          <div className="md:col-span-2 flex flex-col justify-between p-6">
            {selectedConversation ? (
              <>
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.senderAvatar}
                      alt={selectedConversation.senderName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {selectedConversation.senderName}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        الموضوع: <strong>{selectedConversation.subject}</strong> • {selectedConversation.timestamp}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    محادثة مشفرة آمنة
                  </span>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs">
                  {/* Initial message */}
                  <div className="flex items-start gap-2.5">
                    <img
                      src={selectedConversation.senderAvatar}
                      className="w-7 h-7 rounded-full object-cover"
                      alt=""
                    />
                    <div className="bg-slate-100 p-3.5 rounded-2xl rounded-tr-xs max-w-md space-y-1">
                      <div className="font-bold text-slate-900">{selectedConversation.senderName}</div>
                      <p className="text-slate-700 leading-relaxed">{selectedConversation.content}</p>
                      <div className="text-[10px] text-slate-400 text-left mt-1">{selectedConversation.timestamp}</div>
                    </div>
                  </div>

                  {/* Replies */}
                  {selectedConversation.replies.map((rep) => (
                    <div key={rep.id} className="flex items-start justify-end gap-2.5">
                      <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tl-xs max-w-md space-y-1">
                        <div className="font-bold text-indigo-100">{rep.senderName}</div>
                        <p className="leading-relaxed">{rep.content}</p>
                        <div className="text-[10px] text-indigo-200 text-left mt-1">{rep.timestamp}</div>
                      </div>
                      <img
                        src={currentUser.avatar}
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="اكتب ردك المباشر هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-sm flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <span>اختر محادثة لعرض التفاصيل والرد</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Announcement with Gemini AI Integration */}
      {showAddAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">نشر تعميم / إعلان مدرسي جديد</h3>
              <button onClick={() => setShowAddAnnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Drafter Panel */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3.5 rounded-2xl border border-purple-200/70 mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>المساعد الذكي لكتابة التعاميم (Gemini AI)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="مثال: تعليق الدراسة بسبب الأمطار، حفل تكريم المتفوقين..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-purple-200 bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAiDraftAnnouncement}
                  disabled={isAiLoading || !aiTopic}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-50 whitespace-nowrap"
                >
                  {isAiLoading ? "جارِ الصياغة..." : "صياغة تلقائية"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان التعميم / الإعلان</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الفئة المستهدفة</label>
                <select
                  value={annForm.targetAudience}
                  onChange={(e) => setAnnForm({ ...annForm, targetAudience: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="all">كافة منسوبي المدرسة وأولياء الأمور</option>
                  <option value="parents">أولياء الأمور فقط</option>
                  <option value="teachers">الكادر التعليمي فقط</option>
                  <option value="students">الطلاب</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نص التعميم والبيان</label>
                <textarea
                  rows={4}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={annForm.isPinned}
                    onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>تثبيت في أعلى اللوحة</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={annForm.hasAttachment}
                    onChange={(e) => setAnnForm({ ...annForm, hasAttachment: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>إرفاق ملف PDF رسمي</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAnnModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  اعتماد ونشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Direct Message */}
      {showNewMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">بدء محادثة مباشرة جديدة</h3>
            <form onSubmit={handleSendNewMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">المستلم</label>
                <select
                  value={newMsgForm.receiverId}
                  onChange={(e) => setNewMsgForm({ ...newMsgForm, receiverId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {userProfiles
                    .filter((u) => u.id !== currentUser.id)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.role})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">موضوع الرسالة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استفسار حول مستوى الطالب الأكاديمي..."
                  value={newMsgForm.subject}
                  onChange={(e) => setNewMsgForm({ ...newMsgForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نص الرسالة</label>
                <textarea
                  rows={4}
                  required
                  value={newMsgForm.content}
                  onChange={(e) => setNewMsgForm({ ...newMsgForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewMsgModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
