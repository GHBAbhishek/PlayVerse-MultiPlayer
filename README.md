# PlayVerse — Multiplayer Gaming Hub Starter

A dark, neon-styled gaming hub starter built with Node.js, Express, Socket.IO, HTML, CSS and vanilla JavaScript.

## Included
- Responsive gaming homepage and custom SVG favicon.
- Catalog of 50 game entries across multiple categories (many are roadmap concepts, not finished games).
- Playable browser games: Neon Dash reaction test, Pixel Pairs memory game, Trivia Chaos quiz, Cosmic Clicker, Code Cracker, Number Ninja, Word Wizards, Bubble Burst, Goal Glitch penalty shootout, Maze Mayhem, Snowball Smash (rock-paper-scissors), Chess Rush (tic-tac-toe vs CPU), Paper Planes, and Penguin Pileup.
- Favorites, search, player name/avatar/accent customization, profile, and browser-local preferences.
- Multiplayer rooms with 5-character codes, up to 50 connected players per room, live player lists, lobby chat, and simple game-action relays.
- Community idea submissions and voting stored locally in the current browser.
- Donation UI with suggested INR amounts; it does **not** process payments yet.

## Run locally (Windows)
1. Install Node.js 18 or newer from https://nodejs.org/.
2. Extract this project folder.
3. Open Command Prompt in the `playverse` folder.
4. Run:
   ```cmd
   npm install
   npm start
   ```
5. Open http://localhost:3000 in your browser.

Note: You can run it from here also- https://playverse-multiplayer-0zib.onrender.com/
## Test multiplayer
1. Keep the server terminal open.
2. Open http://localhost:3000 in two or more browser windows/devices on the same network.
3. Open **Multiplayer**, create a room in one window, and join using its code in the other.
4. For other devices on the same Wi-Fi, use the host computer's local IP address, e.g. `http://192.168.1.5:3000` (allow Node through Windows Firewall if prompted).
5. For players outside your network, deploy the Node app to a public host with WebSocket support.

## Important production work before public launch
- The 50-player number is a room limit in this starter, not a load-tested promise of 50+ concurrent players across many rooms. Use a production host, load testing, rate limiting, room cleanup, observability and possibly a shared Socket.IO adapter for multiple server instances.
- The multiplayer implementation currently provides room membership, live lobby updates, chat and generic action relays. It does not yet implement synchronized game rules/state for every game. The playable browser games are currently solo prototypes (including a CPU opponent in Chess Rush); they do not yet synchronize game state between remote players.
- Community ideas, favorites and profile customization are stored in `localStorage`, so they are not shared between users/devices. Add a database and authenticated API for a public launch.
- Donations are UI-only. Integrate a payment provider such as Razorpay using server-side order creation, webhook/signature verification, secure environment variables and clear donation/refund terms. Never trust a client-side “payment successful” flag.
- Add authentication, moderation/reporting, chat rate limits, profanity/spam controls, privacy policy, terms, age-appropriate safety measures, backups and security testing before launch.
- Use original/licensed game art, sounds and code. The listed game names are working concepts and should be reviewed before commercial branding.
