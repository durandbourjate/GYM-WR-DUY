import { useState } from 'react';
import type { Tool, ToolbarLayout } from './ZeichnenTypes';

/** Inline SVG Radierer-Icon */
function RadiererIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H7L3 16a1 1 0 0 1 0-1.41l9.59-9.59a2 2 0 0 1 2.82 0l5.18 5.18a2 2 0 0 1 0 2.82L14 20" />
      <path d="M6 12l4 4" />
    </svg>
  );
}

interface ZeichnenToolbarProps {
  aktivesTool: Tool;
  onToolChange: (tool: Tool) => void;
  aktiveFarbe: string;
  onFarbeChange: (farbe: string) => void;
  verfuegbareWerkzeuge: string[];
  verfuegbareFarben: string[];
  radiererAktiv: boolean;
  layout: ToolbarLayout;
  onLayoutToggle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAllesLoeschen: () => void;
  kannUndo: boolean;
  kannRedo: boolean;
  disabled: boolean;
  textRotation?: 0 | 90 | 180 | 270;
  onTextRotationChange?: (r: 0 | 90 | 180 | 270) => void;
  textGroesse?: number;
  onTextGroesseChange?: (g: number) => void;
  textFett?: boolean;
  onTextFettChange?: (f: boolean) => void;
  istTextSelektiert?: boolean;
}

const TOOL_DEFS: { id: Tool; icon: string | null; label: string; configKey?: string }[] = [
  { id: 'auswahl', icon: '↖', label: 'Auswahl' },
  { id: 'stift', icon: '✏️', label: 'Freihand', configKey: 'stift' },
  { id: 'linie', icon: '╱', label: 'Linie', configKey: 'linie' },
  { id: 'pfeil', icon: '→', label: 'Pfeil', configKey: 'pfeil' },
  { id: 'rechteck', icon: '▭', label: 'Rechteck', configKey: 'rechteck' },
  { id: 'text', icon: 'T', label: 'Text', configKey: 'text' },
  { id: 'radierer', icon: null, label: 'Radierer' },
];

export function ZeichnenToolbar({
  aktivesTool,
  onToolChange,
  aktiveFarbe,
  onFarbeChange,
  verfuegbareWerkzeuge,
  verfuegbareFarben,
  radiererAktiv,
  layout,
  onLayoutToggle,
  onUndo,
  onRedo,
  onAllesLoeschen,
  kannUndo,
  kannRedo,
  disabled,
  textRotation = 0,
  onTextRotationChange,
  textGroesse = 18,
  onTextGroesseChange,
  textFett = false,
  onTextFettChange,
  istTextSelektiert = false,
}: ZeichnenToolbarProps) {
  const [zeigeLoeschenDialog, setZeigeLoeschenDialog] = useState(false);
  const isHorizontal = layout === 'horizontal';

  // Filter tools based on config
  const sichtbareTools = TOOL_DEFS.filter((def) => {
    if (def.id === 'auswahl') return true;
    if (def.id === 'radierer') return radiererAktiv;
    if (def.configKey) return (verfuegbareWerkzeuge || []).includes(def.configKey);
    return false;
  });

  const containerKlassen = [
    'flex items-center gap-1.5 p-1',
    isHorizontal ? 'flex-row flex-wrap' : 'flex-col max-h-full overflow-y-auto',
    disabled ? 'pointer-events-none opacity-50' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const separatorKlassen = isHorizontal
    ? 'w-px h-6 bg-slate-200 dark:bg-slate-600 self-center'
    : 'h-px w-6 bg-slate-200 dark:bg-slate-600 self-center';

  return (
    <div
      role="toolbar"
      aria-label="Zeichenwerkzeuge"
      aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
      className={containerKlassen}
    >
      {/* Werkzeug-Gruppe */}
      <div
        role="group"
        aria-label="Werkzeuge"
        className={`flex gap-0.5 bg-slate-100 dark:bg-slate-700 rounded-md p-0.5 ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      >
        {sichtbareTools.map((def) => {
          const aktiv = aktivesTool === def.id;
          return (
            <button
              key={def.id}
              role="button"
              aria-pressed={aktiv}
              title={def.label}
              onClick={() => onToolChange(def.id)}
              className={[
                'min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm font-medium transition-colors',
                aktiv
                  ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-slate-100'
                  : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300',
              ].join(' ')}
            >
              {def.icon !== null ? def.icon : <RadiererIcon />}
            </button>
          );
        })}
      </div>

      {/* Trennlinie */}
      <div className={separatorKlassen} aria-hidden="true" />

      {/* Farb-Gruppe */}
      <div
        role="group"
        aria-label="Farben"
        className={`flex gap-1 items-center ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      >
        {verfuegbareFarben.map((farbe) => {
          const aktiv = aktiveFarbe === farbe;
          return (
            <button
              key={farbe}
              role="button"
              aria-pressed={aktiv}
              aria-label={`Farbe ${farbe}`}
              title={farbe}
              onClick={() => onFarbeChange(farbe)}
              className={[
                'min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-all',
                aktiv ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110',
              ].join(' ')}
            >
              <span
                className="block rounded-full"
                style={{ width: 22, height: 22, backgroundColor: farbe }}
              />
            </button>
          );
        })}
      </div>

      {/* Text-Kontrollen (bei Text-Werkzeug oder selektiertem Text) */}
      {(aktivesTool === 'text' || istTextSelektiert) && (
        <>
          <div className={separatorKlassen} aria-hidden="true" />
          <div
            role="group"
            aria-label="Text-Formatierung"
            className={`flex gap-0.5 items-center ${isHorizontal ? 'flex-row' : 'flex-col'}`}
          >
            {/* Grösse S/M/L/XL */}
            {onTextGroesseChange && (
              <>
                {([
                  { label: 'S', wert: 14 },
                  { label: 'M', wert: 18 },
                  { label: 'L', wert: 24 },
                  { label: 'XL', wert: 32 },
                ] as const).map(({ label, wert }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onTextGroesseChange(wert)}
                    className={[
                      'min-w-[36px] min-h-[36px] flex items-center justify-center rounded text-xs font-medium transition-colors',
                      textGroesse === wert
                        ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-slate-100'
                        : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300',
                    ].join(' ')}
                    title={`Textgrösse ${label} (${wert}px)`}
                  >
                    {label}
                  </button>
                ))}
              </>
            )}

            {/* Fett-Toggle */}
            {onTextFettChange && (
              <button
                type="button"
                onClick={() => onTextFettChange(!textFett)}
                className={[
                  'min-w-[36px] min-h-[36px] flex items-center justify-center rounded text-sm transition-colors',
                  textFett
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-slate-100 font-bold'
                    : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300',
                ].join(' ')}
                title={textFett ? 'Fett aus' : 'Fett ein'}
              >
                B
              </button>
            )}

            {/* Rotation */}
            {onTextRotationChange && (
              <button
                type="button"
                onClick={() => onTextRotationChange(((textRotation + 90) % 360) as 0 | 90 | 180 | 270)}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                title={`Rotation: ${textRotation}°`}
              >
                ⟳{textRotation > 0 ? `${textRotation}°` : ''}
              </button>
            )}
          </div>
        </>
      )}

      {/* Trennlinie */}
      <div className={separatorKlassen} aria-hidden="true" />

      {/* Undo/Redo */}
      <div
        role="group"
        aria-label="Verlauf"
        className={`flex gap-0.5 ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      >
        <button
          role="button"
          title="Rückgängig"
          onClick={onUndo}
          disabled={!kannUndo}
          className={[
            'min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm transition-colors',
            'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300',
            !kannUndo ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
        >
          ↩
        </button>
        <button
          role="button"
          title="Wiederherstellen"
          onClick={onRedo}
          disabled={!kannRedo}
          className={[
            'min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm transition-colors',
            'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300',
            !kannRedo ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
        >
          ↪
        </button>
      </div>

      {/* Spacer — nur horizontal, damit flex-1 den Container vertikal nicht sprengt */}
      {isHorizontal && <div className="flex-1" aria-hidden="true" />}

      {/* Layout-Toggle */}
      <button
        role="button"
        title={isHorizontal ? 'Vertikal anordnen' : 'Horizontal anordnen'}
        onClick={onLayoutToggle}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm transition-colors bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400"
      >
        {isHorizontal ? '⇅' : '⇆'}
      </button>

      {/* Alles löschen */}
      <button
        role="button"
        title="Alles löschen"
        onClick={() => setZeigeLoeschenDialog(true)}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm transition-colors bg-red-50 dark:bg-red-950 text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
      >
        🗑
      </button>

      {/* Bestätigungsdialog (kein window.confirm — bleibt im Fullscreen) */}
      {zeigeLoeschenDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setZeigeLoeschenDialog(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Alles löschen?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">Alle Zeichnungen werden unwiderruflich entfernt.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setZeigeLoeschenDialog(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => { onAllesLoeschen(); setZeigeLoeschenDialog(false) }}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
