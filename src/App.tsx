import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Wallet, Smartphone, Rocket } from 'lucide-react';

type Tab = 'bkash' | 'nagad' | 'rocket';

interface TransactionData {
  number: string;
  amount: number;
  charge: number;
  total: number;
  date: string;
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

const getBKashDate = () => {
  const d = new Date();
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

const getNagadDate = () => {
  const d = new Date();
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

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('bkash');
  const [bkashData, setBkashData] = useState<TransactionData | null>(null);
  const [nagadData, setNagadData] = useState<TransactionData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateBkash = () => {
    const amount = generateAmount();
    setBkashData({
      number: generatePhoneNumber(),
      amount,
      charge: 5,
      total: amount + 5,
      date: getBKashDate(),
      trxId: `DF${generateRandomString(8)}`,
    });
  };

  const generateNagad = () => {
    const amount = generateAmount();
    setNagadData({
      number: generatePhoneNumber(),
      amount,
      charge: 5,
      total: amount + 5,
      date: getNagadDate(),
      trxId: `75${generateRandomString(6)}`,
    });
  };

  useEffect(() => {
    generateBkash();
    generateNagad();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 sm:p-8 flex justify-center items-start pt-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Wallet className="text-indigo-600" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">MFS Generator</h1>
          </div>
        </div>

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
                  <DataRow label="Date" value={bkashData.date} copyId="bkash-date" />
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
                  <DataRow label="Date" value={nagadData.date} copyId="nagad-date" />
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
