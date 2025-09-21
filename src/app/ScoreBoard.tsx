'use client'
import { useState } from "react";
import ScoringInputs from "./ScoringInputs";
import React from "react";

interface ScoreBoardProps {
    teamName1: string;
    teamName2: string;
    onReset: () => void;
}

interface GameHistory {
    id: string;
    label: string;
    pointsTeam1: number;
    pointsTeam2: number;
}

interface KingdomHistory {
    id: number;
    modes: string[];
    pointsTeam1: number;
    pointsTeam2: number;
    games: GameHistory[];
}

export default function ScoreBoard({ teamName1, teamName2, onReset }: ScoreBoardProps) {
    const [overallScore1, setOverallScore1] = useState<number>(0);
    const [overallScore2, setOverallScore2] = useState<number>(0);
    const [currentKingdomScore1, setCurrentKingdomScore1] = useState<number>(0);
    const [currentKingdomScore2, setCurrentKingdomScore2] = useState<number>(0);
    const [completedModes, setCompletedModes] = useState<Set<string>>(new Set());
    const [currentMode, setCurrentMode] = useState<string>("");
    const [currentKingdomId, setCurrentKingdomId] = useState(1);
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
    const [kingdomHistory, setKingdomHistory] = useState<KingdomHistory[]>([]);
    const [expandedKingdom, setExpandedKingdom] = useState<number | null>(null);

    const MAX_KINGDOMS = 4;
    const TOTAL_ROUNDS_PER_KINGDOM = 5;

    const allGames = [
        { id: "king", label: "King" },
        { id: "queen", label: "Queen" },
        { id: "diamonds", label: "Diamonds" },
        { id: "ltoosh", label: "Ltoosh" },
        { id: "trix", label: "Trix" },
    ];

    const updateScore = (pointsTeam1: number, pointsTeam2: number, mode: string) => {
        setCurrentKingdomScore1(prev => prev + pointsTeam1);
        setCurrentKingdomScore2(prev => prev + pointsTeam2);
        setOverallScore1(prev => prev + pointsTeam1);
        setOverallScore2(prev => prev + pointsTeam2);
        setGameHistory(prev => [...prev, {
            id: mode,
            label: allGames.find(g => g.id === mode)?.label || mode,
            pointsTeam1,
            pointsTeam2,
        }]);
    };

    const undoLastScore = () => {
        if (gameHistory.length === 0) return;
        const lastGame = gameHistory[gameHistory.length - 1];
        setGameHistory(prev => prev.slice(0, -1));
        setCurrentKingdomScore1(prev => prev - lastGame.pointsTeam1);
        setCurrentKingdomScore2(prev => prev - lastGame.pointsTeam2);
        setOverallScore1(prev => prev - lastGame.pointsTeam1);
        setOverallScore2(prev => prev - lastGame.pointsTeam2);
        setCompletedModes(prev => {
            const newSet = new Set(prev);
            newSet.delete(lastGame.id);
            return newSet;
        });
        setCurrentMode("");
    };

    const handleModeComplete = (mode: string) => {
        setCompletedModes(prev => new Set([...prev, mode]));
        setCurrentMode("");
    };

    const startNewKingdom = () => {
        if (currentKingdomId >= MAX_KINGDOMS) return;
        setKingdomHistory(prev => [...prev, {
            id: currentKingdomId,
            modes: Array.from(completedModes),
            pointsTeam1: currentKingdomScore1,
            pointsTeam2: currentKingdomScore2,
            games: gameHistory,
        }]);
        setCurrentKingdomScore1(0);
        setCurrentKingdomScore2(0);
        setCompletedModes(new Set());
        setCurrentMode("");
        setCurrentKingdomId(prev => prev + 1);
        setGameHistory([]);
    };

    const resetGame = () => {
        if (window.confirm("Are you sure you want to reset the game? All scores and history will be lost.")) {
            setOverallScore1(0);
            setOverallScore2(0);
            setKingdomHistory([]);
            setCurrentKingdomScore1(0);
            setCurrentKingdomScore2(0);
            setCompletedModes(new Set());
            setCurrentMode("");
            setCurrentKingdomId(1);
            setGameHistory([]);
            setExpandedKingdom(null);
            onReset();
        }
    };

    const toggleKingdomDetails = (kingdomId: number) => {
        setExpandedKingdom(prev => (prev === kingdomId ? null : kingdomId));
    };

    const availableGames = allGames.filter(game => !completedModes.has(game.id));
    const currentRound = completedModes.size + (currentMode ? 1 : 0);
    const isKingdomComplete = completedModes.size >= TOTAL_ROUNDS_PER_KINGDOM;
    const isGameComplete = currentKingdomId >= MAX_KINGDOMS && isKingdomComplete;

    return (
        <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            {/* Main Content */}
            <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700">Kingdom {currentKingdomId} Scoreboard</h2>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm sm:text-base font-semibold text-gray-700">{teamName1}</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-700">{currentKingdomScore1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-semibold text-gray-700">{teamName2}</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-700">{currentKingdomScore2}</span>
                    </div>
                </div>

                <div className="text-center text-xs sm:text-sm font-medium text-gray-500">
                    Kingdom {currentKingdomId} | Round {currentRound} of {TOTAL_ROUNDS_PER_KINGDOM} | Overall: {teamName1} {overallScore1}, {teamName2} {overallScore2}
                </div>

                {currentMode ? (
                    <ScoringInputs
                        gameMode={currentMode}
                        onScoreUpdate={updateScore}
                        onModeComplete={() => handleModeComplete(currentMode)}
                        teamName1={teamName1}
                        teamName2={teamName2}
                    />
                ) : isKingdomComplete ? (
                    <div className="text-center space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-700">Kingdom {currentKingdomId} Complete!</h3>
                        {isGameComplete ? (
                            <p className="text-sm sm:text-base font-medium text-gray-500">Game Over! All 4 kingdoms completed.</p>
                        ) : (
                            <>
                                <p className="text-sm sm:text-base font-medium text-gray-500">Start next kingdom?</p>
                                <button
                                    onClick={startNewKingdom}
                                    disabled={currentKingdomId >= MAX_KINGDOMS}
                                    className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-white border-2 border-gray-200 text-sm sm:text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                >
                                    Start Kingdom {currentKingdomId + 1}
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-700">Pick Next Game Mode</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                            {availableGames.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => setCurrentMode(game.id)}
                                    className="min-h-[48px] sm:min-h-[60px] flex justify-center items-center px-4 py-2 sm:px-6 sm:py-3 bg-white border-2 border-gray-200 text-sm sm:text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition duration-200"
                                >
                                    {game.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                        onClick={resetGame}
                        className="flex-1 min-h-[48px] sm:min-h-[60px] flex justify-center items-center px-4 py-2 sm:px-6 sm:py-3 bg-white border-2 border-gray-200 text-sm sm:text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition duration-200"
                    >
                        Reset Game
                    </button>
                    <button
                        onClick={undoLastScore}
                        disabled={gameHistory.length === 0}
                        className="flex-1 min-h-[48px] sm:min-h-[60px] flex justify-center items-center px-4 py-2 sm:px-6 sm:py-3 bg-white border-2 border-gray-200 text-sm sm:text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        Undo Last Score
                    </button>
                </div>
            </div>

            {/* Game History */}
            <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">Current Kingdom Game History</h3>
                    {gameHistory.length > 0 ? (
                        <div className="border border-gray-200 rounded-lg overflow-x-auto">
                            <table className="w-full min-w-[300px]">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Game</th>
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName1}</th>
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName2}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {gameHistory.map((game, index) => (
                                    <tr key={`${game.id}-${index}`} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm font-medium">{game.label}</td>
                                        <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{game.pointsTeam1}</td>
                                        <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{game.pointsTeam2}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm font-medium text-gray-500">No games played in this kingdom yet.</p>
                    )}
                </div>

                {kingdomHistory.length > 0 && (
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">Previous Kingdoms Summary</h3>
                        <div className="border border-gray-200 rounded-lg overflow-x-auto">
                            <table className="w-full min-w-[300px]">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Kingdom</th>
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Modes</th>
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName1}</th>
                                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName2}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {kingdomHistory.map((kingdom) => (
                                    <React.Fragment key={`kingdom-${kingdom.id}`}>
                                        <tr
                                            className="border-t border-gray-200 cursor-pointer hover:bg-gray-50"
                                            onClick={() => toggleKingdomDetails(kingdom.id)}
                                        >
                                            <td className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm">
                                                #{kingdom.id} {expandedKingdom === kingdom.id ? '▼' : '▶'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm font-medium">
                                                {kingdom.modes.map(m => allGames.find(g => g.id === m)?.label).join(', ')}
                                            </td>
                                            <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{kingdom.pointsTeam1}</td>
                                            <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{kingdom.pointsTeam2}</td>
                                        </tr>
                                        {expandedKingdom === kingdom.id && kingdom.games.length > 0 && (
                                            <tr key={`kingdom-games-${kingdom.id}`}>
                                                <td colSpan={4} className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50">
                                                    <div className="border border-gray-200 rounded-lg">
                                                        <table className="w-full">
                                                            <thead>
                                                            <tr className="bg-gray-50">
                                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Game</th>
                                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName1}</th>
                                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">{teamName2}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {kingdom.games.map((game, index) => (
                                                                <tr key={`game-${kingdom.id}-${game.id}-${index}`} className="border-t border-gray-200 hover:bg-gray-50">
                                                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm font-medium">{game.label}</td>
                                                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{game.pointsTeam1}</td>
                                                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm">{game.pointsTeam2}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}