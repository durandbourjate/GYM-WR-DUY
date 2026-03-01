import { useRef, useEffect, useMemo } from 'react';
import { WEEKS } from './data/weeks';
import { usePlannerStore } from './store/plannerStore';
import { usePlannerData } from './hooks/usePlannerData';
import { loadSettings, applySettingsToWeekData } from './store/settingsStore';
import { SemesterHeader } from './components/SemesterHeader';
import { WeekRows } from './components/WeekRows';
import { AppHeader, HelpBar, MultiSelectToolbar, Legend } from './components/Toolbar';
import { DetailPanel } from './components/DetailPanel';
import { InsertDialog } from './components/InsertDialog';
import { ZoomBlockView } from './components/ZoomBlockView';
import { ZoomMultiYearView } from './components/ZoomMultiYearView';

function App() {
  const { filter, classFilter, weekData, setWeekData, migrateStaticSequences, fixSequenceTitles, sequencePanelOpen, sidePanelOpen, zoomLevel, panelWidth } = usePlannerStore();
  const { courses: allCourses, weeks: staticWeeks, s2StartIndex } = usePlannerData();
  const curRef = useRef<HTMLTableRowElement>(null);

  // Initialize weekData in store on first render (apply holidays/special weeks from settings)
  useEffect(() => {
    if (weekData.length === 0) {
      let initial = WEEKS.map((w) => ({ ...w, lessons: { ...w.lessons } }));
      const settings = loadSettings();
      if (settings && (settings.holidays.length > 0 || settings.specialWeeks.length > 0)) {
        const applied = applySettingsToWeekData(initial, settings);
        initial = applied.weekData;
      }
      setWeekData(initial);
    }
  }, []);

  // Migrate static sequences to store on first render
  useEffect(() => {
    migrateStaticSequences();
    fixSequenceTitles();
  }, []);

  const DAY_ORDER: Record<string, number> = { Mo: 0, Di: 1, Mi: 2, Do: 3, Fr: 4 };
  const filterCourses = (semester: 1 | 2) => {
    let c = allCourses.filter((co) => co.semesters.includes(semester));
    if (filter !== 'ALL') c = c.filter((co) => co.typ === filter);
    if (classFilter) c = c.filter((co) => co.cls === classFilter);
    return [...c].sort((a, b) => {
      const dayDiff = (DAY_ORDER[a.day] ?? 9) - (DAY_ORDER[b.day] ?? 9);
      if (dayDiff !== 0) return dayDiff;
      return a.from.localeCompare(b.from);
    });
  };

  const allWeekKeys = useMemo(() =>
    (weekData.length > 0 ? weekData : staticWeeks).map(w => w.w), [weekData, staticWeeks]);

  const s1Courses = useMemo(() => filterCourses(1), [filter, classFilter, allCourses]);
  const s2Courses = useMemo(() => filterCourses(2), [filter, classFilter, allCourses]);
  const s1Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : staticWeeks).slice(0, s2StartIndex), [weekData, staticWeeks, s2StartIndex]);
  const s2Weeks = useMemo(() =>
    (weekData.length > 0 ? weekData : staticWeeks).slice(s2StartIndex), [weekData, staticWeeks, s2StartIndex]);

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
        if (state.settingsOpen) {
          state.setSettingsOpen(false);
        } else if (state.insertDialog) {
          state.setInsertDialog(null);
        } else if (state.editingSequenceId) {
          state.setEditingSequenceId(null);
        } else if (state.multiSelection.length > 0) {
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
      // Arrow keys: navigate between weeks when a cell is selected
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.metaKey && !e.ctrlKey) {
        const state = usePlannerStore.getState();
        if (!state.selection) return;
        e.preventDefault();
        const allW = (state.weekData.length > 0 ? state.weekData : staticWeeks).map(w => w.w);
        const curIdx = allW.indexOf(state.selection.week);
        if (curIdx < 0) return;
        const nextIdx = e.key === 'ArrowUp' ? curIdx - 1 : curIdx + 1;
        if (nextIdx < 0 || nextIdx >= allW.length) return;
        const nextWeek = allW[nextIdx];
        const c = state.selection.course;
        if (!c) return;
        const weekEntry = state.weekData.find(w => w.w === nextWeek);
        const entry = weekEntry?.lessons[c.col];
        state.setSelection({ week: nextWeek, courseId: c.id, title: entry?.title || '', course: c });
        // Scroll into view
        const row = document.querySelector(`tr[data-week="${nextWeek}"]`);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // Delete/Backspace: clear selected cell content
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const state = usePlannerStore.getState();
        if (state.selection) {
          e.preventDefault();
          const { week, course: c } = state.selection;
          if (c) {
            state.pushUndo();
            state.updateLesson(week, c.col, { title: '', type: 0 });
            state.setSelection({ ...state.selection, title: '' });
          }
        }
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
      <div className="print-title hidden">Unterrichtsplanung SJ 25/26 – {classFilter || 'Alle Klassen'}{filter !== 'ALL' ? ` (${filter})` : ''}</div>
      <AppHeader />
      <HelpBar />
      <Legend />
      <MultiSelectToolbar />
      <InsertDialog />

      <div className="flex" style={{ height: 'calc(100vh - 36px)' }}>
        <div className="overflow-auto flex-1" style={{ paddingBottom: 20, marginRight: (sidePanelOpen || sequencePanelOpen) ? panelWidth : 0 }}>
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
                <SemesterHeader courses={s1Courses} semester={1} weeks={s1Weeks} />
                <tbody>
                  <WeekRows weeks={s1Weeks} courses={s1Courses} allWeeks={allWeekKeys} currentRef={curRef} />
                </tbody>
              </table>

              {/* Semester divider */}
              <div className="py-1.5 px-4 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #f59e0b20, #f59e0b40, #f59e0b20)' }}>
                <span className="text-xs font-bold text-amber-500">━━ Semester 2 ━━</span>
                <span className="text-[9px] text-amber-800">ab KW 07</span>
              </div>

              {/* Semester 2 — Week View */}
              <table className="border-collapse w-max min-w-full">
                <SemesterHeader courses={s2Courses} semester={2} weeks={s2Weeks} />
                <tbody>
                  <WeekRows weeks={s2Weeks} courses={s2Courses} allWeeks={allWeekKeys} currentRef={curRef} />
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
