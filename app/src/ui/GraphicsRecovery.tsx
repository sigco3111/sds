// SPDX-License-Identifier: AGPL-3.0-or-later
import { useLayoutEffect, useRef } from 'react';

/** The renderer cannot resume this run; the page remains usable without it. */
export function GraphicsRecovery() {
  const reload = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => { reload.current?.focus(); }, []);
  return (
    <div className="herd-modal" role="alertdialog" aria-modal="true"
      aria-labelledby="graphics-lost-title" aria-describedby="graphics-lost-detail"
      onKeyDown={(event) => {
        if (event.key === 'Tab') { event.preventDefault(); reload.current?.focus(); }
      }}>
      <section className="herd-panel">
      <h1 id="graphics-lost-title" className="herd-panel__title">그래픽이 멈췄습니다</h1>
      <p id="graphics-lost-detail">현재 플레이를 계속할 수 없습니다. 다시 불러오면 타이틀 화면으로 돌아갑니다.</p>
      <button ref={reload} type="button" className="herd-button herd-button--primary"
        onClick={() => window.location.reload()}>게임 다시 불러오기</button>
      </section>
    </div>
  );
}
