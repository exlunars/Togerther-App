import React, { useState } from 'react';
import { Plus, ChevronRight, Wallet, CalendarDays, LayoutList, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMeetings, formatAmount, formatDate, getTotalExpense } from '../store/meetingContext';
import { AddMeetingModal } from './AddMeetingModal';
import { Meeting } from '../store/meetingContext';

export function HomePage() {
  const navigate = useNavigate();
  const { meetings, addMeeting } = useMeetings();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  const handleAdd = (meeting: Meeting) => {
    addMeeting(meeting);
    setShowAddModal(false);
    navigate(`/meeting/${meeting.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">우리의 추억</p>
            <h1 className="text-2xl" style={{ fontWeight: 700, color: '#1A1A1A' }}>Together</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm active:scale-95 transition-transform"
            style={{ backgroundColor: '#0066FF', fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            새 모임
          </button>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-4 py-4">
        {/* Stats banner + View toggle */}
        {meetings.length > 0 && (
          <div className="mb-6 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-2xl px-4 h-[60px] border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#DBEAFE' }}>
                <CalendarDays className="w-5 h-5" style={{ color: '#0066FF' }} />
              </div>
              <p className="text-xs text-gray-400 flex-1">총 모임</p>
              <p className="text-2xl" style={{ fontWeight: 700, color: '#1A1A1A' }}>{meetings.length}</p>
            </div>

            {/* View toggle - single button */}
            <button
              onClick={() => setViewMode(v => v === 'list' ? 'card' : 'list')}
              className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 transition-colors active:bg-gray-50"
            >
              {viewMode === 'list'
                ? <LayoutGrid className="w-5 h-5" style={{ color: '#0066FF' }} />
                : <LayoutList className="w-5 h-5" style={{ color: '#0066FF' }} />
              }
            </button>
          </div>
        )}

        {/* Meeting List */}
        {meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-500 mb-2" style={{ fontWeight: 500 }}>아직 기록된 모임이 없어요</p>
            <p className="text-sm text-gray-400 mb-6">친구들과의 소중한 추억을 기록해보세요!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white"
              style={{ backgroundColor: '#0066FF', fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              첫 모임 만들기
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* ── List View ── */
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {meetings.map((meeting, index) => {
              const total = getTotalExpense(meeting.expenses);
              return (
                <button
                  key={meeting.id}
                  onClick={() => navigate(`/meeting/${meeting.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors text-left ${index !== meetings.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Info - 3 lines */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-1" style={{ fontWeight: 600, color: '#1A1A1A' }}>{meeting.title}</h3>
                    <p className="text-base text-gray-400 mb-1">{formatDate(meeting.date)}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {meeting.participants.slice(0, 4).map(p => (
                          <div
                            key={p.id}
                            className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[10px] text-white"
                            style={{ backgroundColor: p.color }}
                          >
                            {p.name[0]}
                          </div>
                        ))}
                        {meeting.participants.length > 4 && (
                          <div className="w-4 h-4 rounded-full border border-white bg-gray-300 flex items-center justify-center text-[10px] text-white">
                            +{meeting.participants.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-base text-gray-400">{meeting.participants.length}명</span>
                    </div>
                  </div>

                  {/* Price + chevron - vertically centered */}
                  <div className="flex items-center gap-1 shrink-0">
                    {total > 0 && (
                      <span className="text-sm" style={{ fontWeight: 700, color: '#0066FF' }}>
                        {formatAmount(total)}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* ── Card View ── */
          <div className="space-y-4">
            {meetings.map(meeting => {
              const total = getTotalExpense(meeting.expenses);
              return (
                <button
                  key={meeting.id}
                  onClick={() => navigate(`/meeting/${meeting.id}`)}
                  className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform text-left"
                >
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden">
                    {meeting.coverImage.startsWith('#') ? (
                      <div className="w-full h-full" style={{ backgroundColor: meeting.coverImage }} />
                    ) : (
                      <img
                        src={meeting.coverImage}
                        alt={meeting.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-base mb-0.5" style={{ fontWeight: 700 }}>{meeting.title}</h3>
                      <p className="text-white/80 text-xs">{formatDate(meeting.date)}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {meeting.participants.slice(0, 4).map(p => (
                            <div
                              key={p.id}
                              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs text-white"
                              style={{ backgroundColor: p.color }}
                            >
                              {p.name[0]}
                            </div>
                          ))}
                          {meeting.participants.length > 4 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-white">
                              +{meeting.participants.length - 4}
                            </div>
                          )}
                        </div>
                        <span className="ml-2 text-xs text-gray-400">{meeting.participants.length}명</span>
                      </div>
                      {total > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE' }}>
                          <Wallet className="w-3 h-3" style={{ color: '#0066FF' }} />
                          <span className="text-xs" style={{ color: '#0066FF', fontWeight: 500 }}>
                            {formatAmount(total)}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="h-8" />
      </div>

      {showAddModal && (
        <AddMeetingModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
