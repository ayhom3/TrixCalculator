'use client'
import { useState } from "react";
import ScoreBoard from "./ScoreBoard";

export default function Teams() {
    const [teamName1, setTeamName1] = useState<string>("");
    const [teamName2, setTeamName2] = useState<string>("");
    const [gameStarted, setGameStarted] = useState(false);

    // Function to handle game reset from ScoreBoard
    const handleReset = () => {
        setGameStarted(false);
        setTeamName1("");
        setTeamName2("");
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Trix Scoreboard</h1>
            <div className="space-y-6">
                {!gameStarted && (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Enter Team Names</h2>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="block text-sm font-medium text-gray-600 mb-1">Team 1</span>
                                <input
                                    value={teamName1}
                                    onChange={(e) => setTeamName1(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Team 1 name"
                                />
                            </label>
                            <label className="block">
                                <span className="block text-sm font-medium text-gray-600 mb-1">Team 2</span>
                                <input
                                    value={teamName2}
                                    onChange={(e) => setTeamName2(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Team 2 name"
                                />
                            </label>
                            <button
                                onClick={() => setGameStarted(true)}
                                disabled={!teamName1 || !teamName2}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                )}
                {gameStarted && (
                    <ScoreBoard
                        teamName1={teamName1}
                        teamName2={teamName2}
                        onReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
}