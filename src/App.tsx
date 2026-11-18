import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Wallet, Smartphone, Rocket, Clock, RotateCcw, Calendar } from 'lucide-react';

type Tab = 'bkash' | 'nagad' | 'rocket';

interface TransactionData {
  number: string;
  amount: number;
  charge: number;
  total: number;
  trxId: string;
}

const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateBkashTrxId = () => {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pool: string[] = [];

  for (let i = 0; i < 3; i++) {
    pool.push(digits.charAt(Math.floor(Math.random() * digits.length)));
  }

  pool.push('I');

  for (let i = 0; i < 4; i++) {
    pool.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return `DF${pool.join('')}`;
};

const generatePhoneNumber = () => {
  const prefixes = ['017', '018', '019', '015', '016', '013', '014'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const body = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${body}`;
};

const generateAmount = () => {
  const steps = Math.floor(Math.random() * (400 - 40 + 1)) + 40;
  return steps * 5;
};

const getBKashDate = (d: Date) => {
  let hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hStr = hours.toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(2);
  return `${hStr}:${mins}${ampm} ${day}/${month}/${year}`;
};

const getNagadDate = (d: Date) => {
  let hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hStr = hours.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${hStr}:${mins} ${ampm} ${year}-${month}-${day}`;
};

const formatInputDate = (d: Date) => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatInputTime = (d: Date) => {
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const formatClockPreview = (d: Date) => {
  let hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const secs = d.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hStr = hours.toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${hStr}:${mins}:${secs} ${ampm} • ${day}/${month}/${year}`;
};

const TIME_OFFSET_STORAGE_KEY = 'mfs_custom_time_offset_ms';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('bkash');
  const [bkashData, setBkashData] = useState<TransactionData | null>(null);
  const [nagadData, setNagadData] = useState<TransactionData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [timeOffsetMs, setTimeOffsetMs] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TIME_OFFSET_STORAGE_KEY);
      if (saved !== null) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return 0;
  });

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [isTimePanelOpen, setIsTimePanelOpen] = useState<boolean>(false);

  const effectiveDate = new Date(nowMs + timeOffsetMs);
  const [scheduleDate, setScheduleDate] = useState<string>(() =>
    formatInputDate(new Date(Date.now() + timeOffsetMs))
  );
  const [scheduleTime, setScheduleTime] = useState<string>(() =>
    formatInputTime(new Date(Date.now() + timeOffsetMs))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateBkash = () => {
    const amount = generateAmount();
    setBkashData({
      number: generatePhoneNumber(),
      amount,
      charge: 5,
      total: amount + 5,
      trxId: generateBkashTrxId(),
    });
  };

  const generateNagad = () => {
    const amount = generateAmount();
    setNagadData({
      number: generatePhoneNumber(),
      amount,
      charge: 5,
      total: amount + 5,
      trxId: `75${generateRandomString(6)}`,
    });
  };

  useEffect(() => {
    generateBkash();
    generateNagad();
  }, []);

  const handleOpenTimePanel = () => {
    if (!isTimePanelOpen) {
      const current = new Date(Date.now() + timeOffsetMs);
      setScheduleDate(formatInputDate(current));
      setScheduleTime(formatInputTime(current));
    }
    setIsTimePanelOpen((prev) => !prev);
  };

  const handleApplySchedule = () => {
    if (!scheduleDate || !scheduleTime) return;
    const [year, month, day] = scheduleDate.split('-').map(Number);
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    if ([year, month, day, hours, minutes].some((n) => Number.isNaN(n))) return;

    const target = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const currentNow = Date.now();
    const newOffset = target.getTime() - currentNow;

    setTimeOffsetMs(newOffset);
    setNowMs(currentNow);
    try {
      localStorage.setItem(TIME_OFFSET_STORAGE_KEY, String(newOffset));
    } catch {
      // ignore storage errors
    }
    setIsTimePanelOpen(false);
  };

  const handleResetToLive = () => {
    const currentNow = Date.now();
    const live = new Date(currentNow);
    setTimeOffsetMs(0);
    setNowMs(currentNow);
    setScheduleDate(formatInputDate(live));
    setScheduleTime(formatInputTime(live));
    try {
      localStorage.removeItem(TIME_OFFSET_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyButton = ({ text, fieldId }: { text: string; fieldId: string }) => {
    const isCopied = copiedField === fieldId;
    return (
      <button
        onClick={() => handleCopy(text, fieldId)}
        className={`p-1.5 rounded-md transition-colors ${
          isCopied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'
        }`}
        title="Copy"
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    );
  };

  const DataRow = ({ label, value, copyId }: { label: string; value: string | number; copyId?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-medium mb-1 sm:mb-0">{label}</span>
      <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-full sm:w-auto">
        <span className="font-mono text-gray-800 flex-1 sm:flex-none text-left sm:text-right">{value}</span>
        {copyId && <CopyButton text={String(value)} fieldId={copyId} />}
      </div>
    </div>
  );

  const isCustomTime = timeOffsetMs !== 0;
  const bkashFormattedDate = getBKashDate(effectiveDate);
  const nagadFormattedDate = getNagadDate(effectiveDate);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 sm:p-8 flex justify-center items-start pt-8 sm:pt-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <Wallet className="text-indigo-600" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">MFS Generator</h1>
              <p className="text-[11px] font-mono text-gray-500">
                {formatClockPreview(effectiveDate)}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenTimePanel}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
              isCustomTime
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Set Custom Date & Time"
          >
            <Clock size={14} />
            <span>{isCustomTime ? 'Scheduled' : 'Set Time'}</span>
          </button>
        </div>

        {/* Time Set / Schedule Panel */}
        {isTimePanelOpen && (
          <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                <Calendar size={14} />
                <span>Schedule Time &amp; Date</span>
              </div>
              {isCustomTime && (
                <button
                  onClick={handleResetToLive}
                  className="flex items-center space-x-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset Live</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500">
                Minutes tick realistically from set time
              </span>
              <button
                onClick={handleApplySchedule}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Apply Time
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-50 p-1.5 m-4 rounded-xl">
          <button
            onClick={() => setActiveTab('bkash')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'bkash'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Smartphone size={16} />
            <span>bKash</span>
          </button>
          <button
            onClick={() => setActiveTab('nagad')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'nagad'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Smartphone size={16} />
            <span>Nagad</span>
          </button>
          <button
            onClick={() => setActiveTab('rocket')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'rocket'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Rocket size={16} />
            <span>Rocket</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          {activeTab === 'bkash' && bkashData && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-pink-600 uppercase tracking-wider">bKash Details</h2>
                <button
                  onClick={generateBkash}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Generate New</span>
                </button>
              </div>
              <div className="bg-white border border-pink-100 rounded-xl p-1 mb-4 shadow-sm">
                <div className="px-4 py-2">
                  <DataRow label="Number" value={bkashData.number} copyId="bkash-num" />
                  <DataRow label="TrxID" value={bkashData.trxId} copyId="bkash-trx" />
                  <DataRow label="Amount" value={`৳ ${bkashData.amount}`} copyId="bkash-amount" />
                  <DataRow label="Charge" value={`৳ ${bkashData.charge}`} copyId="bkash-charge" />
                  <DataRow label="Total" value={`৳ ${bkashData.total}`} copyId="bkash-total" />
                  <DataRow label="Date" value={bkashFormattedDate} copyId="bkash-date" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nagad' && nagadData && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Nagad Details</h2>
                <button
                  onClick={generateNagad}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Generate New</span>
                </button>
              </div>
              <div className="bg-white border border-orange-100 rounded-xl p-1 mb-4 shadow-sm">
                <div className="px-4 py-2">
                  <DataRow label="Number" value={nagadData.number} copyId="nagad-num" />
                  <DataRow label="TrxID" value={nagadData.trxId} copyId="nagad-trx" />
                  <DataRow label="Amount" value={`৳ ${nagadData.amount}`} copyId="nagad-amount" />
                  <DataRow label="Charge" value={`৳ ${nagadData.charge}`} copyId="nagad-charge" />
                  <DataRow label="Total" value={`৳ ${nagadData.total}`} copyId="nagad-total" />
                  <DataRow label="Date" value={nagadFormattedDate} copyId="nagad-date" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rocket' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Rocket size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Rocket Generator</h3>
              <p className="text-gray-500 font-medium px-8 py-3 bg-gray-50 rounded-lg border border-gray-200">
                🚀 বানাচ্ছি এখনো (Coming Soon)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
