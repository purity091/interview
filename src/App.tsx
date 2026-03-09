import React, { useState } from 'react';
import { interviewData } from './data';
import { Menu, X, BookOpen, ChevronLeft, Lightbulb, Target, Shield, Users, Award, CheckCircle, HelpCircle, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        </div>
      );
    }

    if (activeSection === 'path1') {
      return <SectionView data={interviewData.path1} />;
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
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    const stageData = interviewData.path2Stages.find(s => s.id === activeSection);
    if (stageData) {
      return <SectionView data={stageData} isPath2 />;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
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

function SectionView({ data, isPath2 = false }: { data: any, isPath2?: boolean }) {
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
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question }: { question: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors duration-200 shadow-sm hover:shadow-md">
      <h4 className="text-lg font-bold text-slate-800 mb-3">{question.title}</h4>
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
