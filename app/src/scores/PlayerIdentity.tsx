// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Matthew Kissinger

import { useEffect, useState } from 'react';
import { scoresController } from './controller';
import { useScoreStore } from './store';

export function PlayerIdentity() {
  const identity = useScoreStore((state) => state.identity);
  const status = useScoreStore((state) => state.identityStatus);
  const renaming = useScoreStore((state) => state.renaming);
  const message = useScoreStore((state) => state.renameMessage || state.identityMessage);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(identity?.displayName ?? '');

  useEffect(() => {
    if (!editing) setName(identity?.displayName ?? '');
  }, [editing, identity?.displayName]);

  const save = async () => {
    if (await scoresController.rename(name)) setEditing(false);
  };

  if (editing) {
    return (
      <form className="herd-identity-editor" onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <label>
          <span className="herd-visually-hidden">순위표 이름</span>
          <input
            className="herd-name-input"
            value={name}
            maxLength={20}
            autoComplete="nickname"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button type="submit" className="herd-text-button" disabled={renaming}>저장</button>
        <button type="button" className="herd-text-button" onClick={() => setEditing(false)}>취소</button>
        {message ? <span className="herd-identity-message" role="status">{message}</span> : null}
      </form>
    );
  }

  return (
    <div className="herd-identity" aria-live="polite">
      {identity ? (
        <>
          <span><strong>{identity.displayName}</strong>(으)로 플레이 중</span>
          <button type="button" className="herd-text-button" onClick={() => setEditing(true)}>변경</button>
        </>
      ) : (
        <span>{status === 'connecting' ? '이름 정하는 중' : '온라인 기록 사용 불가'}</span>
      )}
    </div>
  );
}
