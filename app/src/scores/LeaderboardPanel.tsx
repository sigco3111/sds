// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Matthew Kissinger

import { useEffect, useRef, useState } from 'react';
import { FLOCK_SIZES, type FlockSize } from '@app/state/store';
import { formatRunTime } from '@app/ui/time';
import { MyTimes } from './MyTimes';
import { scoresController } from './controller';
import { useScoreStore } from './store';
import { previousIsoWeek } from './week';

/**
 * The board tab: a flock size, or the player's own history across all three.
 *
 * "mine" sits in the same control group as the sizes because it answers the
 * same question from the other side - the sizes ask who is fastest, this asks
 * what the player has actually run. A player reported a second run as missing;
 * it was recorded, but the board aggregates to one row per player, so only
 * their best was ever visible.
 */
type BoardTab = FlockSize | 'mine';

export function LeaderboardPanel({
  initialFlockSize,
  onClose,
}: {
  readonly initialFlockSize: FlockSize;
  readonly onClose: () => void;
}) {
  const [tab, setTab] = useState<BoardTab>(initialFlockSize);
  // null is all-time. 'current' is this week. Any other value is an ISO week.
  const [weekToken, setWeekToken] = useState<string | null>(null);
  const flockSize = tab === 'mine' ? initialFlockSize : tab;
  const panel = useRef<HTMLElement | null>(null);
  const status = useScoreStore((state) => state.boardStatus);
  const entries = useScoreStore((state) => state.boardEntries);
  const message = useScoreStore((state) => state.boardMessage);
  const runsStatus = useScoreStore((state) => state.runsStatus);
  const runs = useScoreStore((state) => state.runs);
  const runsMessage = useScoreStore((state) => state.runsMessage);
  const boardWeek = useScoreStore((state) => state.boardWeek);
  const boardWeekLabel = useScoreStore((state) => state.boardWeekLabel);

  useEffect(() => {
    if (tab === 'mine') void scoresController.loadMyRuns();
    else void scoresController.loadBoard(tab, weekToken ?? undefined);
  }, [tab, weekToken]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!controls || controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="herd-modal" role="dialog" aria-modal="true" aria-labelledby="times-title">
      <section ref={panel} className="herd-panel herd-board-panel">
        <header className="herd-panel__header">
          <div>
            <p className="herd-panel__kicker">가장 빠른 완주 기록</p>
            <h2 id="times-title" className="herd-panel__title">솔로 기록</h2>
          </div>
          <button
            type="button"
            className="herd-icon-button"
            aria-label="솔로 기록 닫기"
            autoFocus
            onClick={onClose}
          >
            닫기
          </button>
        </header>
        <div className="herd-board-tabs" aria-label="양 떼 크기">
          {FLOCK_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className="herd-size"
              aria-pressed={size === tab}
              onClick={() => setTab(size)}
            >
              {size}
            </button>
          ))}
          <button
            type="button"
            className="herd-size"
            aria-pressed={tab === 'mine'}
            onClick={() => setTab('mine')}
          >
            내 기록
          </button>
        </div>
        {tab === 'mine' ? (
          <>
            <p className="herd-board-caption">완주한 모든 기록을 양 떼 크기별로 보여줍니다.</p>
            {runsStatus !== 'ready' || runs.length === 0 ? (
              <p className="herd-board-message" role="status">{runsMessage}</p>
            ) : (
              <MyTimes runs={runs} />
            )}
          </>
        ) : (
          <>
            <div className="herd-board-tabs" aria-label="순위표">
              <button
                type="button"
                className="herd-size"
                aria-pressed={weekToken === null}
                onClick={() => setWeekToken(null)}
              >
                전체 기간
              </button>
              <button
                type="button"
                className="herd-size"
                aria-pressed={weekToken !== null}
                onClick={() => setWeekToken('current')}
              >
                이번 주
              </button>
            </div>
            <p className="herd-board-caption">
              {weekToken === null
                ? `양 ${flockSize}마리 최고 기록.`
                : weekToken === 'current'
                  ? `이번 주, 양 ${flockSize}마리.`
                  : `${boardWeekLabel || '해당 주'}, 양 ${flockSize}마리.`}
            </p>
            {status === 'loading' || status === 'offline' || entries.length === 0 ? (
              <p className="herd-board-message" role="status">{message}</p>
            ) : (
              <ol className="herd-board-list" aria-label={`양 ${flockSize}마리 솔로 기록`}>
                {entries.slice(0, 10).map((entry) => (
                  <li key={entry.persistentId}>
                    <span><span className="herd-board-rank">{entry.rank}.</span> {entry.displayName}</span>
                    <span>{formatRunTime(entry.scoreSeconds * 1000)}</span>
                  </li>
                ))}
              </ol>
            )}
            {weekToken !== null && boardWeek ? (
              <button
                type="button"
                className="herd-mine-more"
                onClick={() => {
                  const previous = previousIsoWeek(boardWeek);
                  if (previous) setWeekToken(previous);
                }}
              >
                지난주
              </button>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
