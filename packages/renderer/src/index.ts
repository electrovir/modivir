const api = (window as any).api;

// // trigger file prompt
// api.send('doThing');

// // handle response
// api.on('doThing', (base64: string) => {
//     if (!base64) {
//         return;
//     }
//     const src = `data:image/jpg;base64,${base64}`;
//     const image = document.querySelector('img');
//     if (image) {
//         image.src = src;
//     }
// });

const player = new Audio('file:///Users/electrovir/Desktop/audio.m4a');
player.play();

export {};
