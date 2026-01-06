import React, { useState, useEffect } from 'react';
import { fetchDailyLuckyNumbers } from '../services/geminiService';
import { LotteryType, LuckyDailyResponse, LotterySet } from '../types';
import { Ball } from './Ball';
import { Sparkles, Loader2, Compass, Flame, AlertCircle } from 'lucide-react';

const LOADING_TIPS = [
  "正在测算今日五行能量...",
  "正在查阅老黄历宜忌...",
  "正在定位今日财神方位...",
  "正在分析天干地支...",
  "正在推演紫微星象...",
  "正在捕捉时空灵感..."
];

interface LuckyGeneratorProps {
  onSave: (data: LotterySet) => void;
}

export const LuckyGenerator: React.FC<LuckyGeneratorProps> = ({ onSave }) => {
  const [selectedType, setSelectedType] = useState<LotteryType>(LotteryType.SSQ);
  const [loading, setLoading] = useState(false);
  const [luckyData, setLuckyData] = useState<LuckyDailyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle through loading tips
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      setTipIndex(0);
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setLuckyData(null);
    try {
      const data = await fetchDailyLuckyNumbers(selectedType);
      setLuckyData(data);
    } catch (e) {
      setError("AI 连接失败。请稍后再试或检查网络设置。");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDb = () => {
    if (!luckyData) return;
    const newSet: LotterySet = {
      id: crypto.randomUUID(),
      type: selectedType,
      redBalls: luckyData.suggestedNumbers.redBalls,
      blueBalls: luckyData.suggestedNumbers.blueBalls,
      createdAt: Date.now(),
      source: 'AI_LUCKY',
      note: luckyData.reasoning
    };
    onSave(newSet);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-400 w-6 h-6" />
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
            AI 黄历运势 & 幸运号码
          </h2>
        </div>

        {/* Introduction Text - Hide when loading to keep UI clean */}
        {!luckyData && !loading && (
          <p className="text-indigo-200 text-sm mb-6">
            结合今日黄历、五行运势，为您计算今日专属财运组合。
          </p>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedType(LotteryType.SSQ)}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedType === LotteryType.SSQ 
                ? 'bg-white text-indigo-900 shadow-lg' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            双色球
          </button>
          <button
            onClick={() => setSelectedType(LotteryType.DLT)}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedType === LotteryType.DLT 
                ? 'bg-white text-indigo-900 shadow-lg' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            大乐透
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 flex items-center gap-2 mb-4 animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!luckyData && !loading && (
          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 rounded-xl font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98]"
          >
            开启今日运势
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 min-h-[200px]">
            {/* Custom Spinner */}
            <div className="relative mb-6">
               <div className="absolute inset-0 border-4 border-indigo-400/30 border-t-yellow-400 rounded-full w-16 h-16 animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-yellow-200 animate-pulse" />
               </div>
               <div className="w-16 h-16"></div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 text-center h-16">
               <p className="text-lg font-medium text-yellow-100 animate-fade-in transition-opacity duration-300">
                 {LOADING_TIPS[tipIndex]}
               </p>
               <p className="text-xs text-indigo-300">
                 Gemini AI 正在解读天机
               </p>
            </div>
          </div>
        )}

        {luckyData && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs mb-1">
                  <Flame className="w-3 h-3" /> 五行
                </div>
                <div className="font-bold text-lg">{luckyData.element}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs mb-1">
                  <Compass className="w-3 h-3" /> 吉位
                </div>
                <div className="font-bold text-lg">{luckyData.auspiciousDirection}</div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-6">
              <p className="text-sm italic text-indigo-100 mb-2">"{luckyData.advice}"</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                 <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${luckyData.luckyIndex}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-indigo-300 mt-1">
                <span>运势指数</span>
                <span>{luckyData.luckyIndex}/100</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 text-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500">推荐号码</span>
                <span className="text-xs text-slate-400">理由: {luckyData.suggestedNumbers.reasoning}</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {luckyData.suggestedNumbers.redBalls.map((n) => (
                  <Ball key={`lucky-r-${n}`} num={n} color="red" />
                ))}
                {luckyData.suggestedNumbers.blueBalls.map((n) => (
                  <Ball key={`lucky-b-${n}`} num={n} color="blue" />
                ))}
              </div>
              <button
                onClick={handleSaveToDb}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                保存到库
              </button>
            </div>
            
            <button 
              onClick={handleGenerate}
              className="mt-4 w-full text-center text-indigo-300 text-sm hover:text-white transition-colors"
            >
              重新计算
            </button>
          </div>
        )}
      </div>
    </div>
  );
};