import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Expense, Participant, Activity, CATEGORY_LIST, CATEGORY_EMOJI } from '../store/meetingContext';

interface Props {
  participants: Participant[];
  activities: Activity[];
  onClose: () => void;
  onAdd: (expense: Expense) => void;
}

export function AddExpenseModal({ participants, activities, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paidBy, setPaidBy] = useState(participants[0]?.id ?? '');
  const [splitWith, setSplitWith] = useState<string[]>(participants.map(p => p.id));
  const [category, setCategory] = useState('식사');

  const amount = parseInt(amountStr.replace(/,/g, ''), 10) || 0;
  const perPerson = splitWith.length > 0 ? Math.ceil(amount / splitWith.length) : 0;

  const toggleSplit = (pid: string) => {
    setSplitWith(prev =>
      prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
    );
  };

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    if (!isNaN(num)) {
      setAmountStr(num.toLocaleString('ko-KR'));
    } else {
      setAmountStr('');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || amount <= 0 || !paidBy || splitWith.length === 0) return;

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount,
      paidBy,
      splitWith,
      category,
    };

    onAdd(expense);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="text-lg" style={{ fontWeight: 600 }}>지출 추가</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {/* Amount - big and prominent */}
          <div className="mb-5 bg-[#E8DEF8] rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={e => handleAmountChange(e.target.value)}
                placeholder="0"
                className="text-3xl bg-transparent outline-none text-center w-40"
                style={{ fontWeight: 700, color: '#6750A4' }}
              />
              <span className="text-xl text-gray-400" style={{ fontWeight: 500 }}>원</span>
            </div>
            {splitWith.length > 0 && amount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                1인당 <span style={{ color: '#6750A4', fontWeight: 600 }}>{perPerson.toLocaleString('ko-KR')}원</span>
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">내용 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex. 삼겹살, 택시비"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#6750A4] transition-colors"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LIST.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-all ${category === cat ? 'text-white border-transparent' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
                  style={category === cat ? { backgroundColor: '#6750A4' } : {}}
                >
                  <span>{CATEGORY_EMOJI[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paid By */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">결제한 사람 *</label>
            <div className="grid grid-cols-2 gap-2">
              {participants.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPaidBy(p.id)}
                  className={`px-4 py-3 rounded-xl border transition-all ${paidBy === p.id ? 'border' : 'bg-gray-50 border-gray-100'}`}
                  style={paidBy === p.id ? {
                    borderColor: p.color,
                    backgroundColor: p.color + '15'
                  } : {}}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: p.color }}>
                      {p.name[0]}
                    </div>
                    <span className="text-sm" style={{ fontWeight: paidBy === p.id ? 600 : 400 }}>{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Split With */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-500">나눌 사람 *</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSplitWith(participants.map(p => p.id))}
                  className="text-xs text-[#6750A4]"
                  style={{ fontWeight: 500 }}
                >
                  전체 선택
                </button>
                <span className="text-xs text-gray-400">|</span>
                <button
                  onClick={() => setSplitWith([])}
                  className="text-xs text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  전체 해제
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {participants.map(p => {
                const isSelected = splitWith.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSplit(p.id)}
                    className={`px-4 py-3 rounded-xl border transition-all ${isSelected ? 'border' : 'bg-gray-50 border-gray-100'}`}
                    style={isSelected ? {
                      borderColor: p.color,
                      backgroundColor: p.color + '15'
                    } : {}}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: p.color }}>
                        {p.name[0]}
                      </div>
                      <span className="text-sm" style={{ fontWeight: isSelected ? 600 : 400 }}>{p.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || amount <= 0 || !paidBy || splitWith.length === 0}
            className="w-full py-4 rounded-2xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6750A4', fontWeight: 600 }}
          >
            지출 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}