import React from 'react';
import { LotterySet, LotteryType } from '../types';
import { Ball } from './Ball';
import { Trash2, Calendar, Sparkles, User, Database } from 'lucide-react';
import { getLotteryName } from '../services/lotteryLogic';

interface SavedListProps {
  items: LotterySet[];
  onDelete: (id: string) => void;
}

export const SavedList: React.FC<SavedListProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">
        <Database className="w-12 h-12 mb-3 opacity-20" />
        <p>暂无保存的号码</p>
        <p className="text-sm">生成的号码将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type === LotteryType.SSQ ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                {getLotteryName(item.type)}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 ml-2">
                 {item.source === 'AI_LUCKY' ? <Sparkles className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3" />}
                 {item.source === 'AI_LUCKY' ? 'AI推荐' : item.source === 'MANUAL' ? '自选' : '随机'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {item.redBalls.map((n) => <Ball key={`r-${n}`} num={n} color="red" size="sm" />)}
              {item.blueBalls.map((n) => <Ball key={`b-${n}`} num={n} color="blue" size="sm" />)}
            </div>
          </div>

          <button 
            onClick={() => onDelete(item.id)}
            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors self-end md:self-center"
            title="删除"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};