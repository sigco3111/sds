// SPDX-License-Identifier: AGPL-3.0-or-later
import { useTouchPresent } from '@app/input/touchPresent';
import { useGameStore } from '@app/state/store';

function keyLabel(code: string): string {
  if (code === 'ShiftLeft') return '왼쪽 Shift';
  if (code === 'ShiftRight') return '오른쪽 Shift';
  return code.replace(/^(Key|Digit)/, '');
}

/** A quiet reminder; binding changes render once, never on the frame loop. */
export function DesktopControls() {
  // Complementary to the touch stick, from the same answer rather than from a
  // stylesheet rule that has to be kept in step with it by hand. A phone has
  // no keys to be reminded of, and the reminder sits exactly where the stick's
  // resting position is.
  const touch = useTouchPresent();
  const bindings = useGameStore((state) => state.inputBindings);
  const movement = [bindings.forward, bindings.left, bindings.backward, bindings.right]
    .map(keyLabel).join(' ');
  if (touch) return null;
  return (
    <div className="herd-desktop-controls" role="group" aria-label="키보드 조작">
      <span><kbd>{movement}</kbd> 이동</span>
      <span><kbd>{keyLabel(bindings.bark)}</kbd> 짖기</span>
      <span><kbd>{keyLabel(bindings.sprint)}</kbd> 전력질주</span>
      <span><kbd>{keyLabel(bindings.walk)}</kbd> 누르는 동안 걷기</span>
      <span><kbd>{keyLabel(bindings.camera)}</kbd> 카메라</span>
      <span><kbd>{keyLabel(bindings.timer)}</kbd> 타이머</span>
      <span><kbd>Esc</kbd> 일시정지</span>
    </div>
  );
}
