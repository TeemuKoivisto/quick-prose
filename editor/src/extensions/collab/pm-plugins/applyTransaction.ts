import { Transaction, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Step, ReplaceStep } from 'prosemirror-transform';

import { CollabParticipant } from './main'

export function apply(tr: Transaction) {
  let { participants, sid, isReady } = this;

  const presenceData = tr.getMeta('presence') as CollabEventPresenceData;
  const telepointerData = tr.getMeta(
    'telepointer',
  ) as CollabEventTelepointerData;
  const sessionIdData = tr.getMeta('sessionId') as CollabEventConnectionData;
  let collabInitialised = tr.getMeta('collabInitialised');

  if (typeof collabInitialised !== 'boolean') {
    collabInitialised = isReady;
  }

  if (sessionIdData) {
    sid = sessionIdData.sid;
  }

  let add: Decoration[] = [];
  let remove: Decoration[] = [];

  if (presenceData) {
    const {
      joined = [] as CollabParticipant[],
      left = [] as { sessionId: string }[],
    } = presenceData;

    participants = participants.remove(left.map(i => i.sessionId));
    participants = participants.add(joined);

    // Remove telepointers for users that left
    left.forEach(i => {
      const pointers = findPointers(i.sessionId, this.decorationSet);
      if (pointers) {
        remove = remove.concat(pointers);
      }
    });
  }

  if (telepointerData) {
    const { sessionId } = telepointerData;
    if (participants.get(sessionId) && sessionId !== sid) {
      const oldPointers = findPointers(
        telepointerData.sessionId,
        this.decorationSet,
      );

      if (oldPointers) {
        remove = remove.concat(oldPointers);
      }

      const { anchor, head } = telepointerData.selection;
      const rawFrom = anchor < head ? anchor : head;
      const rawTo = anchor >= head ? anchor : head;
      const isSelection = rawTo - rawFrom > 0;

      let from = 1;
      let to = 1;

      try {
        from = getValidPos(
          tr,
          isSelection ? Math.max(rawFrom - 1, 0) : rawFrom,
        );
        to = isSelection ? getValidPos(tr, rawTo) : from;
      } catch (err) {
        this.onError(err);
      }

      add = add.concat(
        createTelepointers(
          from,
          to,
          sessionId,
          isSelection,
          this.getInitial(sessionId),
        ),
      );
    }
  }

  if (tr.docChanged) {
    // Adjust decoration positions to changes made by the transaction
    try {
      this.decorationSet = this.decorationSet.map(tr.mapping, tr.doc, {
        // Reapplies decorators those got removed by the state change
        onRemove: spec => {
          if (spec.pointer && spec.pointer.sessionId) {
            const step = tr.steps.filter(isReplaceStep)[0];
            if (step) {
              const { sessionId } = spec.pointer;
              const {
                slice: {
                  content: { size },
                },
                from,
              } = step as any;
              const pos = getValidPos(
                tr,
                size
                  ? Math.min(from + size, tr.doc.nodeSize - 3)
                  : Math.max(from, 1),
              );

              add = add.concat(
                createTelepointers(
                  pos,
                  pos,
                  sessionId,
                  false,
                  this.getInitial(sessionId),
                ),
              );
            }
          }
        },
      });
    } catch (err) {
      this.onError(err);
    }

    // Remove any selection decoration within the change range,
    // takes care of the issue when after pasting we end up with a dead selection
    tr.steps.filter(isReplaceStep).forEach(s => {
      const { from, to } = s as any;
      this.decorationSet.find(from, to).forEach((deco: any) => {
        // `type` is private, `from` and `to` are public in latest version
        // `from` != `to` means it's a selection
        if (deco.from !== deco.to) {
          remove.push(deco);
        }
      });
    });
  }

  const { selection } = tr;
  this.decorationSet.find().forEach((deco: any) => {
    if (deco.type.toDOM) {
      const hasTelepointerDimClass = deco.type.toDOM.classList.contains(
        TELEPOINTER_DIM_CLASS,
      );

      if (deco.from === selection.from && deco.to === selection.to) {
        if (!hasTelepointerDimClass) {
          deco.type.toDOM.classList.add(TELEPOINTER_DIM_CLASS);
        }

        deco.type.side = -1;
      } else {
        if (hasTelepointerDimClass) {
          deco.type.toDOM.classList.remove(TELEPOINTER_DIM_CLASS);
        }
        deco.type.side = 0;
      }
    }
  });

  if (remove.length) {
    this.decorationSet = this.decorationSet.remove(remove);
  }

  if (add.length) {
    this.decorationSet = this.decorationSet.add(tr.doc, add);
  }

  const nextState = new PluginState(
    this.decorationSet,
    participants,
    sid,
    collabInitialised,
  );

  return PluginState.eq(nextState, this) ? this : nextState;
}
