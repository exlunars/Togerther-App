import React, { useState, useRef } from 'react';
import { X, Plus, ImagePlus, Check } from 'lucide-react';
import { Meeting, PARTICIPANT_COLORS } from '../store/meetingContext';

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1729931597118-e49ddbea68ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1616786717075-bf6fd2ad6e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1532313432596-0362b492b33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
];

interface Props {
  onClose: () => void;
  onAdd: (meeting: Meeting) => void;
}

export function AddMeetingModal({ onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCover, setSelectedCover] = useState<number | null>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [participants, setParticipants] = useState<{ name: string; color: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addParticipant = () => {
    if (!participantName.trim()) return;
    const color = PARTICIPANT_COLORS[participants.length % PARTICIPANT_COLORS.length];
    setParticipants(prev => [...prev, { name: participantName.trim(), color }]);
    setParticipantName('');
  };

  const removeParticipant = (idx: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadedImage(result);
      setSelectedCover(null); // 업로드 이미지 선택 시 프리셋 해제
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (i: number) => {
    setSelectedCover(i);
    setUploadedImage(null); // 프리셋 선택 시 업로드 이미지 해제
  };

  const coverImageUrl = uploadedImage ?? (selectedCover !== null ? COVER_IMAGES[selectedCover] : COVER_IMAGES[0]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (participants.length < 1) return;

    const meeting: Meeting = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      date,
      coverImage: coverImageUrl,
      emoji: '',
      participants: participants.map((p, i) => ({
        id: `p-${Date.now()}-${i}`,
        name: p.name,
        color: p.color,
      })),
      activities: [],
      expenses: [],
    };
    onAdd(meeting);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="text-lg" style={{ fontWeight: 600 }}>새 모임 만들기</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {/* Title */}
          <div className="mb-5">
            <label className="text-sm text-gray-500 mb-2 block">모임 이름 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex. 한강 피크닉, 제주도 여행"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
            />
          </div>

          {/* Cover Image Selection */}
          <div className="mb-5">
            <label className="text-sm text-gray-500 mb-2 block">커버 이미지</label>

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 mb-3 transition-all ${
                uploadedImage
                  ? 'border-[#6750A4] bg-[#E8DEF8]'
                  : 'border-gray-200 bg-gray-50 active:bg-gray-100'
              }`}
            >
              {uploadedImage ? (
                <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                  <img src={uploadedImage} alt="업로드한 커버" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#6750A4]/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full px-3 py-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#6750A4]" />
                      <span className="text-xs text-[#6750A4]" style={{ fontWeight: 600 }}>내 사진 선택됨</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">직접 사진 올리기</span>
                </>
              )}
            </button>

            {/* Preset grid */}
            <div className="grid grid-cols-3 gap-2">
              {COVER_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(i)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedCover === i ? 'border-[#6750A4] scale-95' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {selectedCover === i && (
                    <div className="absolute inset-0 bg-[#6750A4]/30 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#6750A4] rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className="text-sm text-gray-500 mb-2 block">날짜 *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
            />
          </div>

          {/* Participants */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 mb-2 block">참여자 *</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={participantName}
                onChange={e => setParticipantName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addParticipant()}
                placeholder="이름 입력"
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
              />
              <button
                onClick={addParticipant}
                className="w-12 h-12 bg-[#6750A4] rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: p.color + '22' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: p.color }}>
                      {p.name[0]}
                    </div>
                    <span className="text-sm" style={{ color: p.color, fontWeight: 500 }}>{p.name}</span>
                    <button onClick={() => removeParticipant(i)}>
                      <X className="w-3.5 h-3.5" style={{ color: p.color }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {participants.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">참여자를 1명 이상 추해주세요</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || participants.length === 0}
            className="w-full py-4 rounded-2xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6750A4', fontWeight: 600 }}
          >
            모임 만들기
          </button>
        </div>
      </div>
    </div>
  );
}