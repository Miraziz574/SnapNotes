
import { useNavigate } from 'react-router-dom';
import { StickyNote, TrendingUp, Calendar, Plus, Camera, Search, Star, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNotesStore } from '../store/notesStore';
import { Header } from '../components/Layout/Header';
import { NoteCard } from '../components/Notes/NoteCard';

interface DashboardProps {
  onMenuClick: () => void;
}

export function Dashboard({ onMenuClick }: DashboardProps) {
  const navigate = useNavigate();
  const { getStats, notes, addNote } = useNotesStore();
  const stats = getStats();

  const recentNotes = [...notes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const starredNotes = notes.filter((n) => n.isStarred).slice(0, 3);

  const topSubjects = Object.entries(stats.subjects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handleNewNote = () => {
    const note = addNote({
      title: '', content: '', subject: '', folder: 'default',
      tags: [], isPinned: false, isStarred: false, images: [], color: 'default',
    });
    navigate(`/notes/${note.id}`);
  };

  const subjectColors: Record<string, string> = {
    Mathematics: '#3B82F6', History: '#F59E0B', Biology: '#10B981',
    Chemistry: '#EF4444', Physics: '#8B5CF6', Literature: '#EC4899',
    Personal: '#6B7280', Computer: '#14B8A6',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" onMenuClick={onMenuClick} />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up">
          <div className="card-elevated p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <StickyNote size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{stats.total}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Notes</div>
          </div>

          <div className="card-elevated p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Plus size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{stats.today}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Added Today</div>
          </div>

          <div className="card-elevated p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{stats.week}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>This Week</div>
          </div>

          <div className="card-elevated p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Star size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{notes.filter(n => n.isStarred).length}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Starred</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up">
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Plus, label: 'New Note', color: 'bg-blue-500', action: handleNewNote },
              { icon: Camera, label: 'Capture', color: 'bg-purple-500', action: () => navigate('/camera') },
              { icon: Search, label: 'Search', color: 'bg-green-500', action: () => navigate('/search') },
            ].map(({ icon: Icon, label, color, action }) => (
              <button
                key={label}
                onClick={action}
                className={`${color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-sm`}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent notes */}
          <div className="md:col-span-2 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Recent Notes</h3>
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-primary)' }}
              >
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {recentNotes.length === 0 ? (
                <div className="card-flat rounded-2xl p-8 text-center">
                  <StickyNote size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No notes yet. Create your first note!</p>
                  <button onClick={handleNewNote} className="mt-3 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Create Note
                  </button>
                </div>
              ) : (
                recentNotes.map((note) => (
                  <NoteCard key={note.id} note={note} viewMode="list" />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-slide-up">
            {/* Top subjects */}
            {topSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Top Subjects</h3>
                </div>
                <div className="space-y-2">
                  {topSubjects.map(([subject, count]) => (
                    <div key={subject} className="card-flat rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{subject}</span>
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: subjectColors[subject] + '20', color: subjectColors[subject] }}>
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(count / stats.total) * 100}%`, backgroundColor: subjectColors[subject] || 'var(--color-primary)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Starred notes */}
            {starredNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-yellow-500" />
                  <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Starred</h3>
                </div>
                <div className="space-y-2">
                  {starredNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className="w-full text-left card-flat rounded-xl p-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {note.title || 'Untitled'}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {format(new Date(note.updatedAt), 'MMM d')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
