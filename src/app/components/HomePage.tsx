import React, { useState } from 'react';
import { Plus, Users, ChevronRight, Wallet, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMeetings, formatAmount, formatDate, getTotalExpense } from '../store/meetingContext';
import { AddMeetingModal } from './AddMeetingModal';
import { Meeting } from '../store/meetingContext';

export function HomePage() {
  const navigate = useNavigate();
  const { meetings, addMeeting } = useMeetings();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (meeting: Meeting) => {
    addMeeting(meeting);
    setShowAddModal(false);
    navigate(`/meeting/${meeting.id}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7FF' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-12 pb-4 bg-white shadow-sm">
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">우리의 추억</p>
            <h1 className="text-xl" style={{ fontWeight: 700, color: '#1D1B20' }}>Together</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: '#6750A4', fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            새 모임
          </button>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-4 py-4">
        {/* Stats banner */}
        {meetings.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: '#E8DEF8' }}>
                <CalendarDays className="w-5 h-5" style={{ color: '#6750A4' }} />
              </div>
              <p className="text-2xl" style={{ fontWeight: 700, color: '#1D1B20' }}>{meetings.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">총 모임</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: '#D5E8D4' }}>
                <Wallet className="w-5 h-5" style={{ color: '#006A6A' }} />
              </div>
              <p className="text-lg" style={{ fontWeight: 700, color: '#1D1B20' }}>
                {formatAmount(meetings.reduce((sum, m) => sum + getTotalExpense(m.expenses), 0))}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">총 지출</p>
            </div>
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
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-md"
              style={{ backgroundColor: '#6750A4', fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              첫 모임 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map(meeting => {
              const total = getTotalExpense(meeting.expenses);
              return (
                <button
                  key={meeting.id}
                  onClick={() => navigate(`/meeting/${meeting.id}`)}
                  className="w-full bg-white rounded-3xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform text-left"
                >
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={meeting.coverImage}
                      alt={meeting.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Emoji badge */}
                    <div className="absolute top-3 left-3 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center text-xl shadow-sm">
                      {meeting.emoji}
                    </div>
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-base mb-0.5" style={{ fontWeight: 700 }}>{meeting.title}</h3>
                      <p className="text-white/80 text-xs">{formatDate(meeting.date)}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Participants */}
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

                      {/* Expense */}
                      {total > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8DEF8' }}>
                          <Wallet className="w-3 h-3" style={{ color: '#6750A4' }} />
                          <span className="text-xs" style={{ color: '#6750A4', fontWeight: 500 }}>
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