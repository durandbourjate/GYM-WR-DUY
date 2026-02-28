import { useRef, useEffect, useMemo } from 'react';
import { COURSES } from './data/courses';
import { WEEKS, S2_START_INDEX } from './data/weeks';
import { usePlannerStore } from './store/plannerStore';
import { SemesterHeader } from './components/SemesterHeader';
import { WeekRows } from './components/WeekRows';
import { AppHeader, HelpBar, MultiSelectToolbar, Legend } from './components/Toolbar';
import { DetailPanel } from './components/DetailPanel';
import { InsertDialog } from './components/InsertDialog';

function App() {
  const { filter, selection, weekData, setWeekData } = usePlannerStore();
  const curRef = useRef<HTMLTableRowElement>(null);

  // Initialize weekData in store on first render
  useEffect(() => {
    if (weekData.length === 0) {
      setWeekData(WEEKS.map((w) => ({ ...w, lessons: { ...w.lessons } })));
    }
  }, []);

  const filterCourses = (semester: 1 | 2) => {
    let c = COURSES.filter((co) => co.semesters.includes(semester));
    if (filter !== 'ALL') c = c.filter((co) => co.typ === filter);
    return c;
  };

  const s1Courses = useMemo(() => filterCourses(1), [filter]);
  const s2Courses = useMemo(() => filterCourses(2), [filter]);
  const s1Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : WEEKS).slice(0, S2_START_INDEX), [weekData]);
  const s2Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : WEEKS).slice(S2_START_INDEX), [weekData]);

  useEffect(() => {
    setTimeout(() => curRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  // Keyboard shortcut: Ctrl+Z for undo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        usePlannerStore.getState().undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="bg-[#0c0f1a] text-slate-200 min-h-screen font-sans">
      <AppHeader />
      <HelpBar />
      <Legend />
      <MultiSelectToolbar />
      <InsertDialog />

      <div className="overflow-x-auto" style={{ paddingBottom: selection ? 80 : 20 }}>
        {/* Semester 1 */}
        <table className="border-collapse w-max min-w-full">
          <SemesterHeader courses={s1Courses} semester={1} />
          <tbody>
            <WeekRows weeks={s1Weeks} courses={s1Courses} currentRef={curRef} />
          </tbody>
        </table>

        {/* Semester divider */}
        <div className="py-1.5 px-4 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #f59e0b20, #f59e0b40, #f59e0b20)' }}>
          <span className="text-xs font-bold text-amber-500">━━ Semester 2 ━━</span>
          <span className="text-[9px] text-amber-800">ab KW 07</span>
        </div>

        {/* Semester 2 */}
        <table className="border-collapse w-max min-w-full">
          <SemesterHeader courses={s2Courses} semester={2} />
          <tbody>
            <WeekRows weeks={s2Weeks} courses={s2Courses} currentRef={curRef} />
          </tbody>
        </table>
      </div>

      <DetailPanel />
    </div>
  );
}

export default App;
