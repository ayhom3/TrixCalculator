Trix Calculator is a mobile-responsive web application built with React and TypeScript using Next.js to track scores for the card game Trix.

The application allows users to input team names, track scores across multiple kingdoms and game modes, 
view game history, and undo or reset scores, all with a clean and intuitive interface.


Features

- Team Setup: Enter names for two teams to start the game.

- Score Tracking: Track scores for five game modes (King, Queen, Diamonds, Ltoosh, Trix) across up to four kingdoms.


Game Modes:

- King: Select which team collected the King (-75 points for the collecting team).

- Queen: Input the number of Queens collected by Team 1 (0-4, with -25 points per Queen).

- Diamonds: Input the number of Diamond cards collected by Team 1 (0-13, with -10 points per card).

- Ltoosh: Input the number of tricks collected by Team 1 (0-13, with -15 points per trick).

- Trix: Select finish positions for Team 1 (e.g., 1,2 for 350 points, 3,4 for 150 points).


History Tracking:

- View current kingdom game history and previous kingdom summaries with expandable details.

- Undo and Reset: Undo the last score or reset the entire game with confirmation.


Tech Stack:

- Framework: Next.js (React with TypeScript)

- Styling: Tailwind CSS

- State Management: React useState hooks

- Deployment: Client-side rendering with 'use client' directive


Usage:

- Enter Team Names: On the initial screen, input names for Team 1 and Team 2.
Click "Start Game" to proceed to the scoreboard (disabled until both names are entered).


Play the Game:

- Select a game mode (King, Queen, Diamonds, Ltoosh, or Trix) from the available options.

- Input scores based on the game mode's rules (e.g., number of Queens or finish positions).

- Scores are automatically updated and added to the current kingdom's history.


Track Progress:

- View the current kingdom's scores and overall scores at the top.

- Check the "Current Kingdom Game History" for games played in the current kingdom.

- Expand the "Previous Kingdoms Summary" to see scores and game details for completed kingdoms.


Manage Scores:

- Click "Undo Last Score" to revert the most recent score entry (disabled if no scores exist).

- Click "Reset Game" to clear all scores and history (requires confirmation).


Start a New Kingdom:

- After completing five rounds in a kingdom, click "Start Kingdom X" to begin the next kingdom (up to four kingdoms).
