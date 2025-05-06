import z from 'zod';
import * as mpcf from 'mpc-framework';
import { EmpWasmEngine } from 'emp-wasm-engine';
import * as summon from 'summon-ts';
import { RtcPairSocket } from 'rtc-pair-socket';
import assert from './assert';
import AsyncQueue from './AsyncQueue';

export default async function runProtocol(
  mode: 'Host' | 'Join',
  socket: RtcPairSocket,
  choice: '🙂' | '😍',
  onProgress?: (progress: number) => void,
) {
  const msgQueue = new AsyncQueue<unknown>();

  const TOTAL_BYTES = 240730;
  let currentBytes = 0;

  socket.on('message', (msg: Uint8Array) => {
    msgQueue.push(msg);

    currentBytes += msg.byteLength;

    if (onProgress) {
      onProgress(currentBytes / TOTAL_BYTES);
    }
  });

  await summon.init();

  const { circuit } = summon.compile({
    path: '/src/main.ts',
    boolifyWidth: 8,
    files: {
      '/src/main.ts': `
        export default (io: Summon.IO) => {
          const aliceInLove = io.input('alice', 'aliceInLove', summon.bool());
          const bobInLove = io.input('bob', 'bobInLove', summon.bool());

          io.outputPublic('bothInLove', aliceInLove && bobInLove);
        }
      `,
    },
  });

  const protocol = new mpcf.Protocol(
    circuit,
    new EmpWasmEngine(),
  );

  const party = mode === 'Host' ? 'alice' : 'bob';
  const otherParty = mode === 'Host' ? 'bob' : 'alice';

  const inLove = choice === '😍';
  const inputName = `${party}InLove`;

  const session = protocol.join(
    party,
    { [inputName]: inLove },
    (to, msg) => {
      assert(to === otherParty);
      socket.send(msg);

      currentBytes += msg.byteLength;

      if (onProgress) {
        onProgress(currentBytes / TOTAL_BYTES);
      }
    },
  );

  msgQueue.stream(msg => {
    if (!(msg instanceof Uint8Array)) {
      console.error(new Error('Expected Uint8Array'));
      return;
    }

    session.handleMessage(otherParty, msg);
  });

  const Output = z.object({
    bothInLove: z.boolean(),
  });

  const output = Output.parse(await session.output());

  if (currentBytes !== TOTAL_BYTES) {
    console.error(
      [
        'Bytes sent & received was not equal to TOTAL_BYTES.',
        ' This causes incorrect progress calculations.',
        ` To fix, updated TOTAL_BYTES to ${currentBytes}.`,
      ].join(''),
    );
  }

  return output.bothInLove ? '😍' : '🙂';
}
