import { useRef, useEffect, useMemo } from 'react';
import { COURSES } from './data/courses';
import { WEEKS, S2_START_INDEX } from './data/weeks';
import { usePlannerStore } from './store/plannerStore';
import { SemesterHeader } from './components/SemesterHeader';
import { WeekRows } from './components/WeekRows';
import { AppHeader, HelpBar, MultiSelectToolbar, Legend } from './components/Toolbar';
import { DetailPanel } from './components/DetailPanel';
import { InsertDialog } from './components/InsertDialog';
import { ZoomBlockView } from './components/ZoomBlockView';
import { ZoomMultiYearView } from './components/ZoomMultiYearView';

function App() {
  const { filter, classFilter, weekData, setWeekData, migrateStaticSequences, fixSequenceTitles, sequencePanelOpen, sidePanelOpen, zoomLevel } = usePlannerStore();
  const curRef = useRef<HTMLTableRowElement>(null);

  // Initialize weekData in store on first render
  useEffect(() => {
    if (weekData.length === 0) {
      setWeekData(WEEKS.map((w) => ({ ...w, lessons: { ...w.lessons } })));
    }
  }, []);

  // Migrate static sequences to store on first render
  useEffect(() => {
    migrateStaticSequences();
    fixSequenceTitles();
  }, []);

  const filterCourses = (semester: 1 | 2) => {
    let c = COURSES.filter((co) => co.semesters.includes(semester));
    if (filter !== 'ALL') c = c.filter((co) => co.typ === filter);
    if (classFilter) c = c.filter((co) => co.cls === classFilter);
    return c;
  };

  const s1Courses = useMemo(() => filterCourses(1), [filter, classFilter]);
  const s2Courses = useMemo(() => filterCourses(2), [filter, classFilter]);
  const s1Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : WEEKS).slice(0, S2_START_INDEX), [weekData]);
  const s2Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : WEEKS).slice(S2_START_INDEX), [weekData]);

  useEffect(() => {
    setTimeout(() => curRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  // Keyboard shortcut: Ctrl+Z for undo, Escape to close panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture shortcuts when editing inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        usePlannerStore.getState().undo();
      }
      if (e.key === 'Escape') {
        const state = usePlannerStore.getState();
        if (state.multiSelection.length > 0) {
          state.clearMultiSelect();
        } else if (state.sidePanelOpen) {
          state.setSidePanelOpen(false);
          state.setSequencePanelOpen(false);
        } else if (state.selection) {
          state.setSelection(null);
        }
      }
      // Zoom shortcuts: 1, 2, 3 (without modifier)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1') usePlannerStore.getState().setZoomLevel(1);
        if (e.key === '2') usePlannerStore.getState().setZoomLevel(2);
        if (e.key === '3') usePlannerStore.getState().setZoomLevel(3);
      }
      // Cmd+F: focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Suche"]') as HTMLInputElement;
        searchInput?.focus();
        searchInput?.select();
      }
      // Cmd+P: print
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        // Let browser handle print with our CSS
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="bg-[#0c0f1a] text-slate-200 min-h-screen font-sans" data-app-root>
      <AppHeader />
      <HelpBar />
      <Legend />
      <MultiSelectToolbar />
      <InsertDialog />

      <div className="flex">
        <div className={`overflow-x-auto flex-1 ${(sidePanelOpen || sequencePanelOpen) ? 'mr-[340px]' : ''}`} style={{ paddingBottom: 20 }}>
          {zoomLevel === 2 ? (
            <>
              {/* Block View — Semester 1 */}
              <ZoomBlockView semester={1} />

              {/* Semester divider */}
              <div className="py-1.5 px-4 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #f59e0b20, #f59e0b40, #f59e0b20)' }}>
                <span className="text-xs font-bold text-amber-500">━━ Semester 2 ━━</span>
                <span className="text-[9px] text-amber-800">ab KW 07</span>
              </div>

              {/* Block View — Semester 2 */}
              <ZoomBlockView semester={2} />
            </>
          ) : zoomLevel === 1 ? (
            <ZoomMultiYearView />
          ) : (
            <>
              {/* Semester 1 — Week View */}
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

              {/* Semester 2 — Week View */}
              <table className="border-collapse w-max min-w-full">
                <SemesterHeader courses={s2Courses} semester={2} />
                <tbody>
                  <WeekRows weeks={s2Weeks} courses={s2Courses} currentRef={curRef} />
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <DetailPanel />
    </div>
  );
}

export default App;
