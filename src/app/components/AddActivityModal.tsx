import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Activity } from '../store/meetingContext';

const EMOJIS = ['📍', '🍽️', '☕', '🎉', '🏃', '🎬', '🛒', '🎤', '🏖️', '⛰️', '🎮', '🌸', '🚴', '🍻', '🛍️', '🎭'];

const PHOTO_PRESETS = [
  { label: '없음', url: '' },
  { label: '식사', url: 'https://images.unsplash.com/photo-1674076442296-2e2f3fcb0897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  { label: '카페', url: 'https://images.unsplash.com/photo-1710880694444-970aaf7e7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  { label: '야외', url: 'https://images.unsplash.com/photo-1758272959533-201492a5d36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  { label: '파티', url: 'https://images.unsplash.com/photo-1763951778440-13af353b122a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  { label: '바/술', url: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
];

interface Props {
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

export function AddActivityModal({ onClose, onAdd }: Props) {
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [memo, setMemo] = useState('');
  const [emoji, setEmoji] = useState('📍');
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const activity: Activity = {
      id: `act-${Date.now()}`,
      time,
      title: title.trim(),
      place: place.trim(),
      memo: memo.trim(),
      emoji,
      photo: PHOTO_PRESETS[selectedPhoto].url || undefined,
    };
    onAdd(activity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="text-lg" style={{ fontWeight: 600 }}>활동 추가</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {/* Emoji */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">아이콘</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 text-xl rounded-xl border-2 transition-all ${emoji === e ? 'border-[#6750A4] bg-[#E8DEF8]' : 'border-gray-100 bg-gray-50'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Time + Title row */}
          <div className="flex gap-3 mb-4">
            <div className="w-28 flex-shrink-0">
              <label className="text-sm text-gray-500 mb-2 block">시간 *</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-2 block">활동 이름 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ex. 점심 식사, 카페"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
              />
            </div>
          </div>

          {/* Place */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">장소</label>
            <input
              type="text"
              value={place}
              onChange={e => setPlace(e.target.value)}
              placeholder="ex. 여의도 한강공원"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
            />
          </div>

          {/* Memo */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">메모</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="오늘의 소감이나 기억하고 싶은 것을 적어보세요"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors resize-none text-sm"
            />
          </div>

          {/* Photo preset */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 mb-2 block">대표 사진</label>
            <div className="grid grid-cols-3 gap-2">
              {PHOTO_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(i)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedPhoto === i ? 'border-[#6750A4]' : 'border-gray-100'}`}
                >
                  {preset.url ? (
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-400">없음</span>
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 py-0.5 text-center text-xs ${selectedPhoto === i ? 'bg-[#6750A4] text-white' : 'bg-black/30 text-white'}`}>
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-4 rounded-2xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6750A4', fontWeight: 600 }}
          >
            활동 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}