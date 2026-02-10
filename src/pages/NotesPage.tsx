import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parts } from '../data/parts';
import { materials } from '../data/materials';

interface Note {
  id: string;
  partId?: string;
  materialId?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<{ type: 'part' | 'material'; id: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'notes' | 'favorites'>('notes');
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedFavorites = localStorage.getItem('favorites');

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const createNote = () => {
    if (!newNoteContent.trim()) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNoteContent,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: newNoteTags.split(',').map((t) => t.trim()).filter((t) => t),
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    setNewNoteContent('');
    setNewNoteTags('');
    setIsCreating(false);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFavoriteItem = (fav: { type: 'part' | 'material'; id: string }) => {
    if (fav.type === 'part') {
      return parts.find((p) => p.id === fav.id);
    } else {
      return materials.find((m) => m.id === fav.id);
    }
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">学习笔记与收藏</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'notes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            我的笔记 ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'favorites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            我的收藏 ({favorites.length})
          </button>
        </div>

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="p-6">
            {/* Create Note Button */}
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full mb-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + 创建新笔记
              </button>
            )}

            {/* Create Note Form */}
            {isCreating && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="输入笔记内容..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <input
                  type="text"
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                  placeholder="标签（用逗号分隔）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewNoteContent('');
                      setNewNoteTags('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                还没有笔记，开始创建你的第一条学习笔记吧！
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(note.createdAt)}</span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="p-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                还没有收藏，在浏览零部件和材料时点击收藏按钮！
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav, index) => {
                  const item = getFavoriteItem(fav);
                  if (!item) return null;

                  return (
                    <Link
                      key={index}
                      to={`/${fav.type === 'part' ? 'parts' : 'materials'}/${fav.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {fav.type === 'part' ? '零部件' : '材料'}
                            </span>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <span className="ml-4 text-blue-600">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
