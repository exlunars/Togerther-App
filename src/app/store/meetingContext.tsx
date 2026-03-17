import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  place: string;
  memo: string;
  photo?: string;
  emoji: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
  category: string;
  place?: string;
  time?: string;
  memo?: string;
  activityId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  emoji: string;
  participants: Participant[];
  activities: Activity[];
  expenses: Expense[];
}

export interface SettlementResult {
  fromId: string;
  toId: string;
  amount: number;
}

export const PARTICIPANT_COLORS = [
  '#6750A4', '#625B71', '#7D5260', '#6C5B7B',
  '#B3261E', '#6750A4', '#4A4458', '#8B5A3C',
  '#006A6A', '#7D5260'
];

export const CATEGORY_LIST = ['식사', '카페', '교통', '숙박', '활동', '쇼핑', '식료품', '술', '기타'];

export const CATEGORY_EMOJI: Record<string, string> = {
  식사: '🍽️', 카페: '☕', 교통: '🚌', 숙박: '🏨',
  활동: '🎭', 쇼핑: '🛍️', 식료품: '🛒', 술: '🍻', 기타: '💳',
};

export const CATEGORY_COLOR: Record<string, string> = {
  식사: '#D97706', 카페: '#8B5CF6', 교통: '#2563EB', 숙박: '#7C3AED',
  활동: '#DC2626', 쇼핑: '#EAB308', 식료품: '#16A34A', 술: '#B91C1C', 기타: '#6B7280',
};

const MOCK_MEETINGS: Meeting[] = [
  {
    id: '2',
    title: '홍대 클럽데이',
    date: '2024-01-20',
    coverImage: 'https://images.unsplash.com/photo-1729931597118-e49ddbea68ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    emoji: '🎉',
    participants: [
      { id: 'p5', name: '민준', color: '#007AFF' },
      { id: 'p6', name: '태민', color: '#A8E6CF' },
      { id: 'p7', name: '수지', color: '#FF8B94' },
    ],
    activities: [
      {
        id: 'a5', time: '18:00', title: '삼겹살 저녁',
        place: '홍대 고기집',
        memo: '삼겹살 무한리필! 진짜 맛있었음 🥩 배 터질 것 같음',
        photo: 'https://images.unsplash.com/photo-1709433420612-8cad609df914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '🥩',
      },
      {
        id: 'a6', time: '20:30', title: '코인 노래방',
        place: '홍대 코인노래방',
        memo: '2시간 노래 부름 목 터짐 ㅋㅋ 수지 노래 진짜 잘함',
        photo: 'https://images.unsplash.com/photo-1772380406710-6d9206cb275d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '🎤',
      },
      {
        id: 'a7', time: '23:00', title: '루프탑 바',
        place: '홍대 루프탑바',
        memo: '야경 너무 예쁨 🌃 다음에도 꼭 오고 싶다!',
        photo: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '🍸',
      },
    ],
    expenses: [
      { id: 'e5', title: '삼겹살', amount: 90000, paidBy: 'p5', splitWith: ['p5', 'p6', 'p7'], category: '식사' },
      { id: 'e6', title: '노래방', amount: 30000, paidBy: 'p6', splitWith: ['p5', 'p6', 'p7'], category: '활동' },
      { id: 'e7', title: '루프탑바', amount: 60000, paidBy: 'p7', splitWith: ['p5', 'p6', 'p7'], category: '술' },
    ],
  },
  {
    id: '3',
    title: '제주도 당일치기',
    date: '2024-02-14',
    coverImage: 'https://images.unsplash.com/photo-1616786717075-bf6fd2ad6e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    emoji: '✈️',
    participants: [
      { id: 'p8', name: '서연', color: '#4ECDC4' },
      { id: 'p9', name: '지호', color: '#FFD93D' },
      { id: 'p10', name: '유나', color: '#6C5CE7' },
      { id: 'p11', name: '채원', color: '#96CEB4' },
    ],
    activities: [
      {
        id: 'a8', time: '09:00', title: '성산일출봉',
        place: '성산일출봉',
        memo: '일출은 못봤지만 경치 최고! 올라가는 길이 힘들었음 😅',
        photo: 'https://images.unsplash.com/photo-1763951778440-13af353b122a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '⛰️',
      },
      {
        id: 'a9', time: '12:00', title: '흑돼지 점심',
        place: '제주 흑돼지 맛집',
        memo: '제주 흑돼지 진짜 맛있음 🐷 서울이랑 완전 다른 맛!',
        photo: 'https://images.unsplash.com/photo-1709433420612-8cad609df914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '🐷',
      },
      {
        id: 'a10', time: '15:00', title: '협재해수욕장',
        place: '협재해수욕장',
        memo: '바닷물이 너무 맑고 예쁨 💙 다음엔 여름에 오자!',
        photo: 'https://images.unsplash.com/photo-1758272959533-201492a5d36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        emoji: '🏖️',
      },
      {
        id: 'a11', time: '18:00', title: '동문시장 구경',
        place: '제주 동문시장',
        memo: '귤, 한라봉 잔뜩 사왔음 🍊 각자 집 선물도 구매!',
        emoji: '🍊',
      },
    ],
    expenses: [
      { id: 'e8', title: '왕복 항공권', amount: 320000, paidBy: 'p8', splitWith: ['p8', 'p9', 'p10', 'p11'], category: '교통' },
      { id: 'e9', title: '렌터카', amount: 120000, paidBy: 'p9', splitWith: ['p8', 'p9', 'p10', 'p11'], category: '교통' },
      { id: 'e10', title: '흑돼지 점심', amount: 96000, paidBy: 'p10', splitWith: ['p8', 'p9', 'p10', 'p11'], category: '식사' },
      { id: 'e11', title: '간식&쇼핑', amount: 84000, paidBy: 'p11', splitWith: ['p8', 'p9', 'p10', 'p11'], category: '쇼핑' },
    ],
  },
  {
    id: '4',
    title: '부산 여행',
    date: '2024-04-05',
    coverImage: 'https://images.unsplash.com/photo-1532313432596-0362b492b33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    emoji: '🌊',
    participants: [
      { id: 'p12', name: '민준', color: '#007AFF' },
      { id: 'p13', name: '서연', color: '#4ECDC4' },
      { id: 'p14', name: '태민', color: '#FF8B94' },
      { id: 'p15', name: '지호', color: '#FFD93D' },
      { id: 'p16', name: '채원', color: '#96CEB4' },
    ],
    activities: [
      {
        id: 'a12', time: '10:00', title: 'KTX 이동',
        place: '',
        memo: '부산까지 2시간 반! 기차에서 간식 잔뜩 먹음 🍕',
        emoji: '🚄',
      },
      {
        id: 'a13', time: '13:00', title: '해운대 해수욕장',
        place: '',
        memo: '바다가 너무 예뻐서 다들 사진 찍기 바빴음 📸 파도 진짜 높았음!',
        emoji: '🏖️',
      },
      {
        id: 'a14', time: '17:00', title: '광안리 회&조개구이',
        place: '',
        memo: '신선한 회랑 조개구이 먹으면서 광안대교 야경 감상 🌉 최고였음!',
        emoji: '🦞',
      },
      {
        id: 'a15', time: '20:00', title: '광안대교 야경',
        place: '',
        memo: '야경 진짜 미쳤다... 이런 게 부산이지 ✨',
        emoji: '🌉',
      },
    ],
    expenses: [
      { id: 'e12', title: 'KTX 왕복', amount: 275000, paidBy: 'p12', splitWith: ['p12', 'p13', 'p14', 'p15', 'p16'], category: '교통' },
      { id: 'e13', title: '해운대 카페', amount: 35000, paidBy: 'p13', splitWith: ['p12', 'p13', 'p14', 'p15', 'p16'], category: '카페' },
      { id: 'e14', title: '회&조개구이', amount: 145000, paidBy: 'p14', splitWith: ['p12', 'p13', 'p14', 'p15', 'p16'], category: '식사' },
      { id: 'e15', title: '편의점 야식', amount: 28000, paidBy: 'p15', splitWith: ['p12', 'p13', 'p14', 'p15', 'p16'], category: '식료품' },
    ],
  },
];

export function calculateSettlement(participants: Participant[], expenses: Expense[]): SettlementResult[] {
  const balanceMap = new Map<string, number>();
  participants.forEach(p => balanceMap.set(p.id, 0));

  expenses.forEach(expense => {
    if (expense.splitWith.length === 0) return;
    const perPerson = expense.amount / expense.splitWith.length;
    expense.splitWith.forEach(pid => {
      balanceMap.set(pid, (balanceMap.get(pid) ?? 0) - perPerson);
    });
    balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) ?? 0) + expense.amount);
  });

  const balances = Array.from(balanceMap.entries()).map(([id, balance]) => ({ id, balance }));
  const results: SettlementResult[] = [];

  for (let iter = 0; iter < 100; iter++) {
    const debtors = balances.filter(b => b.balance < -0.5).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(b => b.balance > 0.5).sort((a, b) => b.balance - a.balance);
    if (debtors.length === 0 || creditors.length === 0) break;

    const debtor = debtors[0];
    const creditor = creditors[0];
    const payment = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (payment < 1) break;

    results.push({ fromId: debtor.id, toId: creditor.id, amount: Math.round(payment) });

    const di = balances.findIndex(b => b.id === debtor.id);
    const ci = balances.findIndex(b => b.id === creditor.id);
    balances[di].balance += payment;
    balances[ci].balance -= payment;
  }

  return results;
}

export function getTotalExpense(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

const STORAGE_KEY = 'moim-app-meetings-v8';

function loadMeetings(): Meeting[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return MOCK_MEETINGS;
}

function saveMeetings(meetings: Meeting[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

interface MeetingContextType {
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  deleteMeeting: (id: string) => void;
  addActivity: (meetingId: string, activity: Activity) => void;
  deleteActivity: (meetingId: string, activityId: string) => void;
  addExpense: (meetingId: string, expense: Expense) => void;
  deleteExpense: (meetingId: string, expenseId: string) => void;
  getMeeting: (id: string) => Meeting | undefined;
}

const MeetingContext = createContext<MeetingContextType | null>(null);

export function MeetingProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(loadMeetings);

  useEffect(() => {
    saveMeetings(meetings);
  }, [meetings]);

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const addActivity = (meetingId: string, activity: Activity) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, activities: [...m.activities, activity].sort((a, b) => a.time.localeCompare(b.time)) }
        : m
    ));
  };

  const deleteActivity = (meetingId: string, activityId: string) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, activities: m.activities.filter(a => a.id !== activityId) }
        : m
    ));
  };

  const addExpense = (meetingId: string, expense: Expense) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, expenses: [...m.expenses, expense] }
        : m
    ));
  };

  const deleteExpense = (meetingId: string, expenseId: string) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, expenses: m.expenses.filter(e => e.id !== expenseId) }
        : m
    ));
  };

  const getMeeting = (id: string) => meetings.find(m => m.id === id);

  return (
    <MeetingContext.Provider value={{
      meetings, addMeeting, deleteMeeting, addActivity,
      deleteActivity, addExpense, deleteExpense, getMeeting
    }}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error('useMeetings must be used within MeetingProvider');
  return ctx;
}
