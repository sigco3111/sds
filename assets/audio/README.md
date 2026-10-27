# Audio source ledger (Korean edition)

All runtime audio in this fork is locally synthesized replacement audio,
created for the Korean edition on 2026-10-28.

The upstream project shipped two Mixkit recordings (`birds-loop`,
`pant-loop`) and twelve ElevenLabs-generated effects whose provider terms
cover the original author's own use. The upstream LICENSE-ASSETS policy
allows redistributing an asset only under the license recorded in its
nearest ledger, and no ledger records a redistributable license for those
recordings. To keep this fork's public deployment clean, every runtime
sound was replaced with audio synthesized from scratch with FFmpeg
(oscillator and noise-synthesis recipes; no sampled or downloaded material).

Replacement audio files (same filenames and roles as upstream):

- dog/bark-01..03.mp3 — dog barks (frequency-swept oscillator bursts)
- dog/footfall-01..02.flac — paw steps (filtered noise thumps)
- dog/huff.mp3 — dog huff (filtered noise puff)
- flock/baa-01..03.mp3 — sheep calls (vibrato oscillator)
- flock/bellwether.mp3 — bell (additive partials with decay)
- world/gate-creak.mp3 — gate creak (modulated low oscillator)
- world/fence-knock.mp3 — fence knock (decaying knock + click)
- synth/birds-loop.flac — meadow bird ambience (sequenced chirps, 20 s loop)
- synth/pant-loop.flac — dog panting loop (rhythmic filtered noise)

These synthesized files are distributed with this fork under the same
AGPL-3.0-or-later terms as the code.
