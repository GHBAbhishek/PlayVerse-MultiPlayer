const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: false }, maxHttpBufferSize: 1e6 });
const PORT = process.env.PORT || 3000;
const rooms = new Map();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));
function roomInfo(room) {
  return { code: room.code, game: room.game, players: [...room.players.values()].map(p => ({ id: p.id, name: p.name, color: p.color })), maxPlayers: room.maxPlayers };
}
function sendRoom(code) { const r = rooms.get(code); if (r) io.to(code).emit('room:update', roomInfo(r)); }
function cleanName(v) { return String(v || 'Player').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, 18) || 'Player'; }
function newCode() { const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let code; do { code = Array.from({length:5}, () => chars[Math.floor(Math.random()*chars.length)]).join(''); } while (rooms.has(code)); return code; }
io.on('connection', socket => {
  socket.on('room:create', ({ name, game } = {}, cb = () => {}) => {
    const code = newCode(); const room = { code, game: String(game || 'Neon Trivia').slice(0, 40), maxPlayers: 50, players: new Map(), state: { started: false, round: 0, scores: {} } };
    rooms.set(code, room); room.players.set(socket.id, { id: socket.id, name: cleanName(name), color: '#9b8cff' }); socket.join(code); socket.data.room = code; cb({ ok: true, room: roomInfo(room) }); sendRoom(code);
  });
  socket.on('room:join', ({ code, name } = {}, cb = () => {}) => {
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5); const room = rooms.get(code);
    if (!room) return cb({ ok: false, error: 'Room not found. Check the code and try again.' });
    if (room.players.size >= room.maxPlayers) return cb({ ok: false, error: 'This room is full (50 players).' });
    if (socket.data.room) leaveRoom(socket);
    room.players.set(socket.id, { id: socket.id, name: cleanName(name), color: ['#9b8cff','#64e5ff','#ff9e80','#c8f17c','#ff85c2'][room.players.size % 5] }); socket.join(code); socket.data.room = code;
    cb({ ok: true, room: roomInfo(room) }); sendRoom(code); io.to(code).emit('room:notice', `${cleanName(name)} joined the lobby`);
  });
  socket.on('game:action', payload => {
    const code = socket.data.room; const room = rooms.get(code); if (!room || !payload || typeof payload !== 'object') return;
    // Relay small game actions only to members of the same room.
    socket.to(code).emit('game:action', { from: socket.id, action: String(payload.action || '').slice(0, 40), data: payload.data ?? null });
  });
  socket.on('room:chat', ({ message } = {}) => {
    const code = socket.data.room; const room = rooms.get(code); if (!room || !room.players.has(socket.id)) return;
    const text = String(message || '').trim().slice(0, 240); if (!text) return;
    io.to(code).emit('room:chat', { name: room.players.get(socket.id).name, message: text, at: Date.now() });
  });
  socket.on('room:leave', () => leaveRoom(socket));
  socket.on('disconnect', () => leaveRoom(socket));
});
function leaveRoom(socket) {
  const code = socket.data.room; if (!code) return; const room = rooms.get(code); socket.leave(code); delete socket.data.room;
  if (room) { room.players.delete(socket.id); if (!room.players.size) rooms.delete(code); else sendRoom(code); }
}
server.listen(PORT, () => console.log(`\n🎮 PlayVerse is running at http://localhost:${PORT}\n`));
