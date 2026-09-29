import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { ScoreRecord, GuestbookEntry, ParticipantRecord } from '../types/game';

// Save stage score
export async function saveScore(score: Omit<ScoreRecord, 'id' | 'createdAt'>): Promise<string> {
  const scoresCol = collection(db, 'scores');
  const docRef = await addDoc(scoresCol, {
    ...score,
    createdAt: Date.now(),
    timestamp: serverTimestamp()
  });

  // Also update or log participant record
  try {
    const participantDoc = doc(db, 'participants', score.nickname);
    await setDoc(participantDoc, {
      nickname: score.nickname,
      cheerMessage: score.cheerMessage,
      lastPlayedAt: Date.now(),
      lastStage: score.stage
    }, { merge: true });
  } catch (err) {
    console.warn('Participant log error:', err);
  }

  return docRef.id;
}

// Fetch top 10 rankings for a given stage (fastest time first)
export async function getTopRankings(stage: number): Promise<ScoreRecord[]> {
  try {
    const scoresCol = collection(db, 'scores');
    const q = query(
      scoresCol,
      where('stage', '==', stage),
      orderBy('timeMs', 'asc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<ScoreRecord, 'id'>)
    }));
  } catch (err) {
    console.error('Error fetching rankings for stage', stage, err);
    // Fallback: fetch without compound index if needed
    try {
      const scoresCol = collection(db, 'scores');
      const qFallback = query(scoresCol, where('stage', '==', stage), limit(40));
      const snapFallback = await getDocs(qFallback);
      const items = snapFallback.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<ScoreRecord, 'id'>)
      }));
      return items.sort((a, b) => a.timeMs - b.timeMs).slice(0, 10);
    } catch {
      return [];
    }
  }
}

// Add guestbook message
export async function addGuestbookEntry(entry: { nickname: string; message: string; tag?: string }): Promise<string> {
  const guestCol = collection(db, 'guestbook');
  const docRef = await addDoc(guestCol, {
    nickname: entry.nickname,
    message: entry.message,
    tag: entry.tag || '🎉 즐거웠어요',
    createdAt: Date.now(),
    likes: 0
  });
  return docRef.id;
}

// Fetch recent guestbook entries
export async function getGuestbookEntries(maxCount = 30): Promise<GuestbookEntry[]> {
  try {
    const guestCol = collection(db, 'guestbook');
    const q = query(guestCol, orderBy('createdAt', 'desc'), limit(maxCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<GuestbookEntry, 'id'>)
    }));
  } catch (err) {
    console.error('Error getting guestbook', err);
    // Fallback simple fetch
    try {
      const guestCol = collection(db, 'guestbook');
      const snap = await getDocs(query(guestCol, limit(maxCount)));
      const items = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<GuestbookEntry, 'id'>)
      }));
      return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch {
      return [];
    }
  }
}

// Delete a score entry (Admin)
export async function deleteScore(scoreId: string): Promise<void> {
  const docRef = doc(db, 'scores', scoreId);
  await deleteDoc(docRef);
}

// Delete a guestbook entry (Admin)
export async function deleteGuestbookEntry(entryId: string): Promise<void> {
  const docRef = doc(db, 'guestbook', entryId);
  await deleteDoc(docRef);
}

