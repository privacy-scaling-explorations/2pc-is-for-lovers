# 2PC IS FOR LOVERS ❤️

Did you ever fall in love with your best friend? Hope they feel the same, but
afraid to lose the friendship?

This app uses advanced cryptography to solve the problem! 🤓

## How it Works

1. [Open the app](https://mpc.pse.dev/apps/2pc-is-for-lovers).
2. Host a session.
3. Get your friend to join.
4. Choose love or friendship.
5. If you both choose love, you'll both find out. Otherwise, you'll both see
   friendship.

## They Really Won't Know?

Yes. Really.

This is an open source app.

If you choose love but the result is friendship, only you will know. Even if
your friend knows [advanced cryptography](https://eprint.iacr.org/2017/030.pdf).

This is the [magic](https://www.youtube.com/watch?v=PzcDqegGoKI) of 2PC.

All communication is end-to-end encrypted. The server/internet will not know
either.

## Under the Hood

This app is built with
[mpc-framework](https://github.com/voltrevo/mpc-framework), which enables
secure 2PC based on [*Authenticated Garbling and Efficient Maliciously Secure
Two-Party Computation*](https://eprint.iacr.org/2017/030.pdf). In this app we
only use a circuit with a single AND gate, but the framework allows you to
compute any function (in principle) by using larger circuits, which can be
compiled using a TypeScript-like language called
[summon](https://github.com/voltrevo/summon).
