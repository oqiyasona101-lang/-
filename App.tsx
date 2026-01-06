import React, { useState, useEffect } from 'react';
import { LotteryType, LotterySet } from './types';
import { generateLotterySet, isDrawDay, getLotteryName } from './services/lotteryLogic';
import { Ball } from './components/Ball';
import { SavedList } from './components/SavedList';
import { LuckyGenerator } from './components/LuckyGenerator';
import { Wallet, Info, Shuffle, Save, Plus, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'lotto_genius_db';

const App: React.FC = () => {
  const [savedSets, setSavedSets] = useState<LotterySet[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'saved' | 'lucky'>('lucky');
  const [genType, setGenType] = useState<LotteryType>(LotteryType.SSQ);
  const [generatedSet, setGeneratedSet] = useState<LotterySet | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedSets(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored lottery data");
      }
    }
    // Set initial generated set
    setGeneratedSet(generateLotterySet(LotteryType.SSQ));
  }, []);

  // Save to local storage whenever sets change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSets));
  }, [savedSets]);

  const handleSaveSet = (set: LotterySet) => {
    setSavedSets(prev => [set, ...prev]);
    // Optional: Switch to saved tab or show toast
    if (activeTab === 'generate') {
      setGeneratedSet(generateLotterySet(genType)); // Refresh generator
    }
  };

  const handleDeleteSet = (id: string) => {
    setSavedSets(prev => prev.filter(s => s.id !== id));
  };

  const handleGenerateRandom = () => {
    setGeneratedSet(generateLotterySet(genType, 'RANDOM'));
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-6 max-w-2xl mx-auto">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-30 shadow-sm md:rounded-2xl md:mx-4 md:mb-6 border-b md:border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <h1 className="text-xl font-bold text-slate-800">彩票智囊</h1>
        </div>
        <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-500">
           {new Date().toLocaleDateString()} {['周日','周一','周二','周三','周四','周五','周六'][new Date().getDay()]}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 space-y-6">
        
        {/* Draw Day Notification */}
        {(isDrawDay(LotteryType.SSQ) || isDrawDay(LotteryType.DLT)) && (
          <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-800">今日开奖日!</p>
              <p className="text-xs text-orange-600 mt-1">
                {isDrawDay(LotteryType.SSQ) && '双色球 '}
                {isDrawDay(LotteryType.DLT) && '大乐透 '}
                今晚开奖，祝您好运。
              </p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'lucky' && (
          <div className="animate-fade-in">
             <LuckyGenerator onSave={(set) => {
               handleSaveSet(set);
               setActiveTab('saved');
             }} />
             <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-700 mb-2">关于AI运势</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 我们使用 Google Gemini 模型分析传统黄历数据、五行生克和当日天干地支。
                 虽然科学无法证明彩票规律，但顺应时运或许能为您带来一份好心情。
                 请理性购彩，量力而行。
               </p>
             </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold text-slate-800">随机生成器</h2>
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                   <button 
                     onClick={() => { setGenType(LotteryType.SSQ); setGeneratedSet(generateLotterySet(LotteryType.SSQ)); }}
                     className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${genType === LotteryType.SSQ ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                   >
                     双色球
                   </button>
                   <button 
                     onClick={() => { setGenType(LotteryType.DLT); setGeneratedSet(generateLotterySet(LotteryType.DLT)); }}
                     className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${genType === LotteryType.DLT ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                   >
                     大乐透
                   </button>
                 </div>
              </div>

              {generatedSet && (
                <div className="flex flex-col items-center gap-6 py-6">
                  <div className="flex flex-wrap justify-center gap-3">
                    {generatedSet.redBalls.map(n => <Ball key={`g-r-${n}`} num={n} color="red" size="lg" />)}
                    {generatedSet.blueBalls.map(n => <Ball key={`g-b-${n}`} num={n} color="blue" size="lg" />)}
                  </div>
                  
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={handleGenerateRandom}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium active:scale-95 transition-transform"
                    >
                      <Shuffle className="w-4 h-4" /> 换一组
                    </button>
                    <button 
                      onClick={() => handleSaveSet(generatedSet)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-md shadow-red-200 active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" /> 保存
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 text-blue-800 text-xs leading-relaxed border border-blue-100">
              <strong>全排列说明：</strong> 双色球共有约1772万种组合，大乐透约2142万种组合。
              受限于浏览器性能，我们无法一次性生成并展示所有组合。此处提供单次随机生成功能。
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-4 px-1">
               <h2 className="text-lg font-bold text-slate-800">号码库 ({savedSets.length})</h2>
               <span className="text-xs text-slate-400">本地存储</span>
             </div>
             <SavedList items={savedSets} onDelete={handleDeleteSet} />
          </div>
        )}

      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 md:hidden">
        <button 
          onClick={() => setActiveTab('lucky')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'lucky' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-medium">运势</span>
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'generate' ? 'text-red-600' : 'text-slate-400'}`}
        >
          <Shuffle className="w-6 h-6" />
          <span className="text-[10px] font-medium">生成</span>
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'saved' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-medium">号码库</span>
        </button>
      </nav>

      {/* Desktop Navigation Helper (Visible only on lg screens usually, but here keeping simple layout) */}
      <div className="hidden md:flex justify-center gap-4 mb-8">
        <button 
           onClick={() => setActiveTab('lucky')}
           className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'lucky' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          AI 运势
        </button>
        <button 
           onClick={() => setActiveTab('generate')}
           className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'generate' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          随机生成
        </button>
        <button 
           onClick={() => setActiveTab('saved')}
           className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'saved' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          号码库
        </button>
      </div>

    </div>
  );
};

export default App;