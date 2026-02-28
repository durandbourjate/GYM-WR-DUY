import { CURRICULUM_GOALS, type CurriculumGoal } from '../data/curriculumGoals';
import type { SubjectArea, TaxonomyLevel, BlockType } from '../types';

/**
 * Phase 4: Auto-Suggest Lehrplanziele
 * 
 * Fuzzy-matches a topicMain string against curriculum goals,
 * returning scored suggestions ordered by relevance.
 */

interface SuggestResult {
  goal: CurriculumGoal;
  score: number;       // 0–1, higher = better match
  matchReason: string; // e.g. "topic: Preistheorie", "content: Elastizitäten"
}

// Normalize text for matching
function norm(s: string): string {
  return s.toLowerCase()
    .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue')
    .replace(/[–—]/g, '-').replace(/[^a-z0-9\s-]/g, '').trim();
}

// Tokenize into meaningful words (skip stopwords)
const STOPWORDS = new Set(['und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'von', 'zu', 'mit', 'in', 'auf', 'an', 'des', 'den', 'dem', 'als', 'fuer', 'bei', 'zum', 'zur']);

function tokenize(s: string): string[] {
  return norm(s).split(/\s+/).filter(w => w.length > 1 && !STOPWORDS.has(w));
}

// Score how well a query matches a goal
function scoreGoal(queryTokens: string[], goal: CurriculumGoal, subjectArea?: SubjectArea): { score: number; reason: string } {
  if (queryTokens.length === 0) return { score: 0, reason: '' };

  let bestScore = 0;
  let bestReason = '';

  const topicNorm = norm(goal.topic);
  const contentsNorm = goal.contents.map(norm);

  // 1. Exact topic match (highest priority)
  const queryJoined = queryTokens.join(' ');
  if (topicNorm.includes(queryJoined) || queryJoined.includes(topicNorm)) {
    const overlap = Math.min(queryJoined.length, topicNorm.length) / Math.max(queryJoined.length, topicNorm.length);
    const s = 0.8 + 0.2 * overlap;
    if (s > bestScore) { bestScore = s; bestReason = `Thema: ${goal.topic}`; }
  }

  // 2. Token-by-token matching against topic
  const topicTokens = tokenize(goal.topic);
  const topicHits = queryTokens.filter(qt => topicTokens.some(tt => tt.includes(qt) || qt.includes(tt)));
  if (topicHits.length > 0) {
    const s = (topicHits.length / queryTokens.length) * 0.7 + (topicHits.length / Math.max(topicTokens.length, 1)) * 0.2;
    if (s > bestScore) { bestScore = s; bestReason = `Thema: ${goal.topic}`; }
  }

  // 3. Token matching against goal text
  const goalTokens = tokenize(goal.goal);
  const goalHits = queryTokens.filter(qt => goalTokens.some(gt => gt.includes(qt) || qt.includes(gt)));
  if (goalHits.length > 0) {
    const s = (goalHits.length / queryTokens.length) * 0.5;
    if (s > bestScore) { bestScore = s; bestReason = `Grobziel: ${goal.goal.slice(0, 60)}…`; }
  }

  // 4. Token matching against contents
  for (const content of goal.contents) {
    const cTokens = tokenize(content);
    const cHits = queryTokens.filter(qt => cTokens.some(ct => ct.includes(qt) || qt.includes(ct)));
    if (cHits.length > 0) {
      const s = (cHits.length / queryTokens.length) * 0.45;
      if (s > bestScore) {
        bestScore = s;
        const matched = contentsNorm.find(cn => cHits.some(h => cn.includes(h)));
        bestReason = `Inhalt: ${goal.contents.find((_, i) => norm(goal.contents[i]) === matched) || content}`;
      }
    }
  }

  // 5. Subject area bonus
  if (subjectArea && goal.area === subjectArea) {
    bestScore *= 1.2; // 20% boost for matching subject area
  }

  return { score: Math.min(bestScore, 1), reason: bestReason };
}

/**
 * Suggest curriculum goals based on a topic string.
 * Returns top N matches with score > threshold.
 */
export function suggestGoals(
  topicMain: string,
  subjectArea?: SubjectArea,
  maxResults = 3,
  threshold = 0.2
): SuggestResult[] {
  const queryTokens = tokenize(topicMain);
  if (queryTokens.length === 0) return [];

  const scored = CURRICULUM_GOALS
    .map(goal => {
      const { score, reason } = scoreGoal(queryTokens, goal, subjectArea);
      return { goal, score, matchReason: reason };
    })
    .filter(r => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored;
}

/**
 * Phase 4: Auto-Suggest Taxonomiestufe
 * 
 * Maps BlockType to a suggested taxonomy level based on
 * Bloom's taxonomy alignment with activity types.
 */
export const BLOCK_TYPE_TAXONOMY_MAP: Partial<Record<BlockType, TaxonomyLevel>> = {
  INTRO: 'K1',        // Einführung → Wissen
  LESSON: 'K2',       // Lektion → Verstehen
  SELF_STUDY: 'K3',   // SOL → Anwenden
  DISCUSSION: 'K4',   // Diskussion → Analysieren
  PRESENTATION: 'K5', // Präsentation → Synthese
  EXAM: 'K3',         // Prüfung → Anwenden
  EXAM_ORAL: 'K4',    // Mündl. Prüfung → Analysieren
  EXAM_LONG: 'K5',    // Langprüfung → Synthese
  PROJECT_DUE: 'K5',  // Projektabgabe → Synthese
};

export function suggestTaxonomyLevel(blockType?: BlockType): TaxonomyLevel | undefined {
  if (!blockType) return undefined;
  return BLOCK_TYPE_TAXONOMY_MAP[blockType];
}
