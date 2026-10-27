// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Matthew Kissinger

import { useMemo, useState, type CSSProperties } from 'react';
import type { FlockSize } from '@app/state/store';
import { formatRunTime } from '@app/ui/time';
import {
  COLLAPSED_RUNS, formatDelta, formatOrdinal, groupRunsByFlockSize, type SizeGroup,
} from './runGroups';
import { historyShareText, cardShareTitle, formatCardClock } from './share';
import { ShareControl } from './ShareControl';
import type { PlayerRun } from './types';

/**
 * The player's own history, one section per flock size.
 *
 * The flat list this replaced interleaved all three sizes in submission order,
 * which put a 4:58 run with 200 sheep directly above a 0:38 run with 25 and
 * invited a comparison that means nothing. Sections make the only comparison
 * that does - a time against the player's other times at the same size - the
 * one the layout actually offers.
 */
export function MyTimes({ runs }: { readonly runs: readonly PlayerRun[] }) {
  const groups = useMemo(() => groupRunsByFlockSize(runs), [runs]);
  const [expanded, setExpanded] = useState<readonly FlockSize[]>([]);
  const sizesRun = groups.filter((group) => group.runs.length > 0).length;

  return (
    <div className="herd-mine">
      <p className="herd-mine__summary">
        <span>완주 <b>{runs.length}</b>회</span>
        <span>양 떼 크기 {groups.length}개 중 <b>{sizesRun}</b>개</span>
      </p>
      {groups.map((group) => (
        <Group
          key={group.flockSize}
          group={group}
          expanded={expanded.includes(group.flockSize)}
          onToggle={() => setExpanded((open) => (
            open.includes(group.flockSize)
              ? open.filter((size) => size !== group.flockSize)
              : [...open, group.flockSize]
          ))}
        />
      ))}
    </div>
  );
}

function Group({ group, expanded, onToggle }: {
  readonly group: SizeGroup;
  readonly expanded: boolean;
  readonly onToggle: () => void;
}) {
  const { flockSize, runs, boardPlayers } = group;
  const best = runs[0];
  const collapsible = runs.length > COLLAPSED_RUNS;
  const shown = collapsible && !expanded ? runs.slice(0, COLLAPSED_RUNS) : runs;
  const listId = `my-times-${flockSize}`;
  // One run has nothing to measure itself against, so the group draws no bar.
  // The cell stays in the grid: hiding it rather than dropping it keeps the
  // times in one column down the whole panel, which is what makes the three
  // sections scan as one table instead of three.
  const bars = runs.length > 1;

  return (
    <section className="herd-mine-group">
      <header className="herd-mine-group__head">
        <h3 className="herd-mine-group__size">양 {flockSize}마리</h3>
        <p className="herd-mine-group__count">
          {runs.length === 0 ? '아직 기록 없음' : `${runs.length}회`}
          {boardPlayers === null ? '' : ` · 순위표 ${boardPlayers}명`}
        </p>
      </header>
      {best === undefined ? (
        <p className="herd-mine-empty">이 크기로 완주하면 여기에 기록됩니다.</p>
      ) : (
        <>
          <p className="herd-mine-best">
            <span className="herd-mine-best__label">내 최고 기록</span>
            <span className="herd-mine-best__time">
              {formatRunTime(best.run.scoreSeconds * 1000)}
              {best.run.boardRank === undefined || best.run.boardPlayers === undefined ? null : (
                <span className="herd-mine-best__standing">
                  {best.run.boardPlayers}명 중 {formatOrdinal(best.run.boardRank)}
                </span>
              )}
            </span>
          </p>
          <ol
            id={listId}
            className={`herd-mine-runs${bars ? '' : ' herd-mine-runs--single'}`}
            aria-label={`양 ${flockSize}마리 기록, 빠른 순`}
          >
            {shown.map(({ run, position, deltaSeconds, fill }) => (
              <li key={`${run.submittedAt}-${run.scoreSeconds}`} data-best={position === 1}>
                <span className="herd-run__rank">{position}</span>
                <span className="herd-run__bar">
                  {bars ? <i style={{ '--fill': fill } as CSSProperties} /> : null}
                </span>
                <span className="herd-run__time">{formatRunTime(run.scoreSeconds * 1000)}</span>
                <span className="herd-run__meta" data-best={position === 1}>
                  <b>{position === 1 ? '최고' : formatDelta(deltaSeconds)}</b>
                  {run.boardRank === undefined ? null : <em>{formatOrdinal(run.boardRank)}</em>}
                </span>
                <span className="herd-run__share-slot">
                  {run.sharePath ? (
                    <ShareControl
                      compact
                      path={run.sharePath}
                      title={cardShareTitle(formatCardClock(run.scoreSeconds), flockSize)}
                      text={historyShareText({
                        clock: formatCardClock(run.scoreSeconds),
                        flockSize,
                        weekRank: run.weekRank,
                        weekPlayers: run.weekPlayers,
                        weekLabel: run.weekLabel,
                      })}
                    />
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
          {collapsible ? (
            <button
              type="button"
              className="herd-mine-more"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={onToggle}
            >
              {expanded
                ? '접기'
                : `${runs.length}개 기록 모두 보기`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
