// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Matthew Kissinger

import { useEffect, useRef, useState } from 'react';
import {
  FLOCK_SIZES,
  useGameStore,
} from '@app/state/store';
import { useReducedMotion } from './useReducedMotion';
import { PlayerIdentity } from '@app/scores/PlayerIdentity';
import { LeaderboardPanel } from '@app/scores/LeaderboardPanel';
import { bootPercent, bootStatus } from '@app/boot/progress';
import { flockSizeFromPath } from '@app/boot/playPath';

export function Boot() {
  const startGame = useGameStore((state) => state.startGame);
  const openSettings = useGameStore((state) => state.openSettings);
  const openCustomize = useGameStore((state) => state.openCustomize);
  const sceneReady = useGameStore((state) => state.sceneReady);
  const bootProgress = useGameStore((state) => state.bootProgress);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const flockSize = useGameStore((state) => state.flockSize);
  const setFlockSize = useGameStore((state) => state.setFlockSize);
  const [leaving, setLeaving] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const timeout = useRef<number | null>(null);
  const timesButton = useRef<HTMLButtonElement | null>(null);
  const reducedMotion = useReducedMotion();
  const playPath = flockSizeFromPath(window.location.pathname);
  const startedFromPath = useRef(false);
  const percent = sceneReady ? 100 : bootPercent(bootProgress);
  const status = sceneReady ? '들판 준비 완료' : bootStatus(bootProgress);

  const closeTimes = () => {
    setShowTimes(false);
    window.requestAnimationFrame(() => timesButton.current?.focus());
  };

  useEffect(() => () => {
    if (timeout.current !== null) window.clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    if (playPath === null || !sceneReady || startedFromPath.current) return;
    startedFromPath.current = true;
    setFlockSize(playPath);
    startGame(playPath);
  }, [playPath, sceneReady, setFlockSize, startGame]);

  const play = () => {
    if (!sceneReady || leaving) return;
    const begin = () => startGame(flockSize);
    if (reducedMotion) {
      begin();
      return;
    }
    setLeaving(true);
    begin();
    timeout.current = window.setTimeout(() => setLeaving(false), 150);
  };

  if (gamePhase !== 'title' && !leaving) return null;

  return (
    <div
      className="herd-boot"
      data-ready={sceneReady}
      data-leaving={leaving}
      data-progress={percent}
      data-stage={status}
      aria-busy={!sceneReady}
    >
      <div className="herd-boot__wash" aria-hidden="true" />
      {!sceneReady ? (
        <section className="herd-loading-card" role="status" aria-live="polite">
          <div className="herd-loading-card__lockup">
            <h1>Sheepdog Sim</h1>
            <p>들판을 준비하고 있습니다</p>
          </div>
          <div
            className="herd-loading-track"
            role="progressbar"
            aria-label="게임 불러오는 중"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="herd-loading-status">
            <span>{status}</span>
            <span>{percent}%</span>
          </p>
        </section>
      ) : null}
      <main className="herd-title-card" inert={!sceneReady || showTimes ? true : undefined}>
        <div className="herd-title-lockup">
          <h1 className="herd-title">Sheepdog Sim</h1>
          <p className="herd-kicker">모든 양을 울타리 안으로</p>
        </div>
        <PlayerIdentity />
        <div className="herd-size-row" aria-label="양 떼 크기">
          {FLOCK_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className="herd-size"
              aria-pressed={size === flockSize}
              onClick={() => setFlockSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="herd-title-actions">
          <button
            type="button"
            className="herd-button herd-button--primary"
            disabled={!sceneReady || leaving}
            onClick={play}
          >
            플레이
          </button>
          <button
            type="button"
            className="herd-button herd-button--quiet"
            id="customize-trigger"
            aria-haspopup="dialog"
            aria-controls="customization-studio"
            onClick={openCustomize}
          >
            꾸미기
          </button>
          <button
            type="button"
            className="herd-button herd-button--quiet"
            onClick={openSettings}
          >
            설정
          </button>
          <button
            ref={timesButton}
            type="button"
            className="herd-button herd-button--quiet"
            onClick={() => setShowTimes(true)}
          >
            기록
          </button>
        </div>
        <nav className="herd-title-links" aria-label="게임 정보">
          <a href={`${import.meta.env.BASE_URL}about`}>게임 소개</a>
          <a href={`${import.meta.env.BASE_URL}support`}>조작법과 도움말</a>
        </nav>
      </main>
      {showTimes ? (
        <LeaderboardPanel initialFlockSize={flockSize} onClose={closeTimes} />
      ) : null}
    </div>
  );
}
