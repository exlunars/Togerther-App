import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Trash2,
  ChevronDown, ArrowRight, MapPin, Users
} from 'lucide-react';
import {
  useMeetings, formatAmount, formatDate, getTotalExpense,
  calculateSettlement, CATEGORY_EMOJI, CATEGORY_COLOR
} from '../store/meetingContext';
import { AddActivityModal } from './AddActivityModal';
import { AddExpenseModal } from './AddExpenseModal';

export function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMeeting, deleteMeeting, addActivity, deleteActivity, addExpense, deleteExpense } = useMeetings();

  const meeting = getMeeting(id ?? '');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEF7FF' }}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">모임을 찾을 수 없습니다</p>
          <button onClick={() => navigate('/')} className="text-[#B3261E]" style={{ fontWeight: 600 }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const totalExpense = getTotalExpense(meeting.expenses);
  const settlements = calculateSettlement(meeting.participants, meeting.expenses);

  const handleDeleteMeeting = () => {
    if (confirm(`"${meeting.title}" 모임을 삭제하시겠어요?`)) {
      deleteMeeting(meeting.id);
      navigate('/');
    }
  };

  const getParticipantById = (id: string) => meeting.participants.find(p => p.id === id);

  const sortedExpenses = [...meeting.expenses].sort((a, b) => {
    const timeA = a.time || '';
    const timeB = b.time || '';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7FF' }}>
      {/* Hero Cover */}
      <div className="relative h-64 overflow-hidden">
        <img src={meeting.coverImage} alt={meeting.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Delete button */}
        <button
          onClick={handleDeleteMeeting}
          className="absolute top-12 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="max-w-[430px] mx-auto">
            <div className="flex items-end gap-3">
              <div className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                {meeting.emoji}
              </div>
              <div>
                <h1 className="text-white text-xl mb-0.5" style={{ fontWeight: 700 }}>{meeting.title}</h1>
                <p className="text-white/80 text-sm">{formatDate(meeting.date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants - full width like image */}
      <div className="bg-white px-5 py-4 shadow-sm">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{meeting.participants.length}명 참여</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {meeting.participants.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                style={{ backgroundColor: p.color + '20' }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: p.color }}>
                  {p.name[0]}
                </div>
                <span style={{ color: p.color, fontWeight: 500 }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto">
        {/* Main Content */}
        <div className="px-4 py-5 pb-28 space-y-4">
          {/* Combined Activities & Expenses List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#6750A4' }} />
                <p className="text-sm text-gray-500" style={{ fontWeight: 600 }}>
                  장소별 지출
                </p>
              </div>
              <button
                onClick={() => setShowAddExpense(true)}
                className="text-xs px-2.5 py-1 rounded-full" 
                style={{ backgroundColor: '#E8DEF8', color: '#6750A4', fontWeight: 500 }}
              >
                + 지출
              </button>
            </div>
            
            {(meeting.expenses.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-3xl mb-2">📍</div>
                <p className="text-sm text-gray-400">아직 기록이 없어요</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {sortedExpenses.map(expense => {
                  const payer = getParticipantById(expense.paidBy);
                  const isExpanded = expandedExpense === expense.id;
                  return (
                    <div key={expense.id} className="border-b border-gray-50 last:border-0">
                      <button
                        className="w-full px-4 py-3 flex items-center gap-3 text-left"
                        onClick={() => setExpandedExpense(isExpanded ? null : expense.id)}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ backgroundColor: (CATEGORY_COLOR[expense.category] ?? '#999') + '22' }}
                        >
                          {CATEGORY_EMOJI[expense.category] ?? '💳'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm" style={{ fontWeight: 600 }}>{expense.title}</h3>
                            <span className="text-sm ml-2 flex-shrink-0" style={{ fontWeight: 700, color: '#6750A4' }}>
                              {formatAmount(expense.amount)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {payer && (
                              <div className="flex items-center gap-1">
                                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: payer.color }} />
                                <span className="text-xs text-gray-400">{payer.name} 결제</span>
                              </div>
                            )}
                            <span className="text-xs" style={{
                              color: CATEGORY_COLOR[expense.category] ?? '#999',
                              backgroundColor: (CATEGORY_COLOR[expense.category] ?? '#999') + '15',
                              padding: '1px 6px',
                              borderRadius: '999px'
                            }}>
                              {expense.category}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3 bg-gray-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">나눈 인원 ({expense.splitWith.length}명)</p>
                              <div className="flex flex-wrap gap-1">
                                {expense.splitWith.map(pid => {
                                  const p = getParticipantById(pid);
                                  if (!p) return null;
                                  return (
                                    <span
                                      key={pid}
                                      className="text-xs px-2 py-0.5 rounded-full"
                                      style={{ backgroundColor: p.color + '22', color: p.color, fontWeight: 500 }}
                                    >
                                      {p.name} ({formatAmount(Math.ceil(expense.amount / expense.splitWith.length))})
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm('이 지출을 삭제하시겠어요?')) {
                                  deleteExpense(meeting.id, expense.id);
                                }
                              }}
                              className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total Expense Summary */}
          {totalExpense > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-400 mb-1">총 지출</p>
              <p className="text-3xl mb-3" style={{ fontWeight: 700, color: '#1D1B20' }}>
                {formatAmount(totalExpense)}
              </p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>{meeting.participants.length}명</span>
                <span>·</span>
                <span>1인당 약 <strong style={{ color: '#6750A4' }}>{formatAmount(Math.ceil(totalExpense / meeting.participants.length))}</strong></span>
              </div>
            </div>
          )}

          {/* Settlement Results */}
          {totalExpense > 0 && settlements.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-3" style={{ fontWeight: 600 }}>정산 결과 🎯</p>
              <div className="space-y-3">
                {settlements.map((s, i) => {
                  const from = getParticipantById(s.fromId);
                  const to = getParticipantById(s.toId);
                  if (!from || !to) return null;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F6EDFF' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0" style={{ backgroundColor: from.color }}>
                        {from.name[0]}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0" style={{ backgroundColor: to.color }}>
                        {to.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontWeight: 500 }}>
                          <span style={{ color: from.color }}>{from.name}</span>
                          <span className="text-gray-400"> → </span>
                          <span style={{ color: to.color }}>{to.name}</span>
                        </p>
                      </div>
                      <span className="text-sm" style={{ fontWeight: 700, color: '#6750A4' }}>
                        {formatAmount(s.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddActivity && (
        <AddActivityModal
          onClose={() => setShowAddActivity(false)}
          onAdd={activity => {
            addActivity(meeting.id, activity);
            setShowAddActivity(false);
          }}
        />
      )}

      {showAddExpense && (
        <AddExpenseModal
          participants={meeting.participants}
          activities={meeting.activities}
          onClose={() => setShowAddExpense(false)}
          onAdd={(expense) => {
            addExpense(meeting.id, expense);
            setShowAddExpense(false);
          }}
        />
      )}
    </div>
  );
}