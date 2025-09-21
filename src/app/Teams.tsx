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
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-4 sm:mb-8">Trix Scoreboard</h1>
            <div className="space-y-4 sm:space-y-8">
                {!gameStarted && (
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 sm:mb-6 text-center">Enter Team Names</h2>
                        <div className="space-y-4 sm:space-y-6">
                            <label className="block">
                                <span className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Team 1</span>
                                <input
                                    value={teamName1}
                                    onChange={(e) => setTeamName1(e.target.value)}
                                    className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Enter Team 1 name"
                                />
                            </label>
                            <label className="block">
                                <span className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Team 2</span>
                                <input
                                    value={teamName2}
                                    onChange={(e) => setTeamName2(e.target.value)}
                                    className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Enter Team 2 name"
                                />
                            </label>
                            <button
                                onClick={() => setGameStarted(true)}
                                disabled={!teamName1 || !teamName2}
                                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-sm sm:text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
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