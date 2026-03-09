import React, { useState } from 'react';
import { interviewData } from './data';
import { Menu, X, BookOpen, Lightbulb, Target, Shield, Users, Award, CheckCircle, HelpCircle, MessageSquare, Trash2, Copy, Check } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const navItems = [
    { id: 'intro', title: 'المشهد الافتتاحي', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'path1', title: 'المسار الأول: التعلم التقليدي', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'path2Intro', title: 'المسار الثاني: مقدمة', icon: <Lightbulb className="w-5 h-5" /> },
    ...interviewData.path2Stages.map((stage, index) => ({
      id: stage.id,
      title: `المرحلة ${index + 1}: ${stage.title.split(':')[1]?.trim() || stage.title}`,
      icon: getIconForStage(index)
    })),
    { id: 'conclusion', title: 'ختام المقابلة', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  function getIconForStage(index: number) {
    const icons = [
      <Users className="w-5 h-5" />,
      <Target className="w-5 h-5" />,
      <BookOpen className="w-5 h-5" />,
      <Award className="w-5 h-5" />,
      <Shield className="w-5 h-5" />,
      <Lightbulb className="w-5 h-5" />,
      <CheckCircle className="w-5 h-5" />
    ];
    return icons[index % icons.length];
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearNotes = (sectionId: string) => {
    setNotes(prev => ({ ...prev, [sectionId]: '' }));
  };

  const handleNoteChange = (sectionId: string, value: string) => {
    setNotes(prev => ({ ...prev, [sectionId]: value }));
  };

  const renderContent = () => {
    if (activeSection === 'intro') {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{interviewData.intro.title}</h1>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              {interviewData.intro.content.map((paragraph, idx) => (
                <p key={idx} className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1.5">•</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>
          </div>
          <NotesSection
            sectionId="intro"
            notes={notes['intro'] || ''}
            onClear={() => handleClearNotes('intro')}
            onChange={(value) => handleNoteChange('intro', value)}
          />
        </div>
      );
    }

    if (activeSection === 'path1') {
      return <SectionView data={interviewData.path1} sectionId="path1" notes={notes['path1'] || ''} onNoteChange={(value) => handleNoteChange('path1', value)} onClearNotes={() => handleClearNotes('path1')} onCopy={handleCopyText} copiedId={copiedId} />;
    }

    if (activeSection === 'path2Intro') {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{interviewData.path2Intro.title}</h1>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              {interviewData.path2Intro.scenario.map((paragraph, idx) => (
                <p key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1.5">•</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>
          </div>
          <NotesSection
            sectionId="path2Intro"
            notes={notes['path2Intro'] || ''}
            onClear={() => handleClearNotes('path2Intro')}
            onChange={(value) => handleNoteChange('path2Intro', value)}
          />
        </div>
      );
    }

    if (activeSection === 'conclusion') {
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{interviewData.conclusion.title}</h1>
            <div className="space-y-6">
              {interviewData.conclusion.questions.map((q) => (
                <QuestionCard key={q.id} question={q} onCopy={handleCopyText} copiedId={copiedId} />
              ))}
            </div>
          </div>
          <NotesSection
            sectionId="conclusion"
            notes={notes['conclusion'] || ''}
            onClear={() => handleClearNotes('conclusion')}
            onChange={(value) => handleNoteChange('conclusion', value)}
          />
        </div>
      );
    }

    const stageData = interviewData.path2Stages.find(s => s.id === activeSection);
    if (stageData) {
      return <SectionView data={stageData} isPath2 sectionId={stageData.id} notes={notes[stageData.id] || ''} onNoteChange={(value) => handleNoteChange(stageData.id, value)} onClearNotes={() => handleClearNotes(stageData.id)} onCopy={handleCopyText} copiedId={copiedId} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900" style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <h1 className="font-bold text-lg text-slate-800">دليل المقابلة</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l border-slate-200 z-40
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-8 hidden lg:block">دليل المقابلة البحثية</h2>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200
                  ${activeSection === item.id 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className={`${activeSection === item.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-20 lg:pt-8 pb-12 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

function SectionView({ data, isPath2 = false, sectionId, notes, onNoteChange, onClearNotes, onCopy, copiedId }: { data: any, isPath2?: boolean, sectionId: string, notes: string, onNoteChange: (value: string) => void, onClearNotes: () => void, onCopy: (text: string, id: string) => void, copiedId: string | null }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h1>
          {data.subtitle && (
            <p className="text-sm font-mono text-indigo-500 bg-indigo-50 inline-block px-3 py-1 rounded-full">
              {data.subtitle}
            </p>
          )}
        </div>

        {data.scenario && (
          <div className="mb-10 bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              السيناريو
            </h3>
            <div className="space-y-3 text-slate-600 leading-relaxed">
              {data.scenario.map((paragraph: string, idx: number) => (
                <p key={idx} className="flex items-start gap-3">
                  <span className={`mt-1.5 ${isPath2 ? 'text-emerald-500' : 'text-indigo-500'}`}>•</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            أسئلة المقابلة
          </h3>
          {data.questions.map((q: any) => (
            <QuestionCard key={q.id} question={q} onCopy={onCopy} copiedId={copiedId} />
          ))}
        </div>
      </div>
      <NotesSection
        sectionId={sectionId}
        notes={notes}
        onClear={onClearNotes}
        onChange={onNoteChange}
      />
    </div>
  );
}

function QuestionCard({ question, onCopy, copiedId }: { question: any, onCopy: (text: string, id: string) => void, copiedId: string | null }) {
  const fullText = `${question.title}\n${question.text}${question.hint ? `\n\nتوضيح إضافي: ${question.hint}` : ''}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="text-lg font-bold text-slate-800">{question.title}</h4>
        <button
          onClick={() => onCopy(fullText, question.id)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="نسخ السؤال"
        >
          {copiedId === question.id ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-slate-700 text-lg leading-relaxed mb-4">{question.text}</p>

      {question.hint && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mt-4">
          <p className="text-sm text-amber-800 leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span><strong className="font-semibold">توضيح إضافي:</strong> {question.hint}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function NotesSection({ sectionId, notes, onClear, onChange }: { sectionId: string, notes: string, onClear: () => void, onChange: (value: string) => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          ملاحظاتك
        </h3>
        {notes && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            مسح الملاحظات
          </button>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اكتب ملاحظاتك هنا..."
        className="w-full h-32 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 placeholder-slate-400"
        dir="rtl"
      />
    </div>
  );
}
