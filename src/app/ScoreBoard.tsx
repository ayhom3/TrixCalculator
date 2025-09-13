'use client'
import { useState } from "react";
import ScoringInputs from "./ScoringInputs";

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
            onReset(); // Call parent reset handler
        }
    };

    const toggleKingdomDetails = (kingdomId: number) => {
        setExpandedKingdom(prev => (prev === kingdomId ? null : kingdomId));
    };

    const availableGames = allGames.filter(game => !completedModes.has(game.id));
    const currentRound = completedModes.size + (currentMode ? 1 : 0);
    const totalRounds = 5;
    const isKingdomComplete = completedModes.size >= totalRounds;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side: Main Content */}
            <div className="flex-1 space-y-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Kingdom {currentKingdomId} Scoreboard</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-gray-700">{teamName1}</span>
                        <span className="text-3xl font-bold text-blue-600">{currentKingdomScore1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{teamName2}</span>
                        <span className="text-3xl font-bold text-blue-600">{currentKingdomScore2}</span>
                    </div>
                    <p className="text-sm text-center text-gray-600 mt-4">
                        Overall: {teamName1} - {overallScore1} | {teamName2} - {overallScore2}
                    </p>
                </div>

                <div className="text-center text-sm text-gray-600">
                    Kingdom {currentKingdomId} - Round {currentRound} of {totalRounds}
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
                    <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Kingdom {currentKingdomId} Complete!</h3>
                        <p className="text-sm text-gray-600">Start next kingdom?</p>
                        <button
                            onClick={startNewKingdom}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Start Kingdom {currentKingdomId + 1}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Pick Next Game Mode</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {availableGames.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => setCurrentMode(game.id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                                >
                                    {game.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={resetGame}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Reset Game
                    </button>
                    <button
                        onClick={undoLastScore}
                        disabled={gameHistory.length === 0}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition duration-200"
                    >
                        Undo Last Score
                    </button>
                </div>
            </div>

            {/* Right Side: Game History */}
            <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Kingdom Game History</h3>
                    {gameHistory.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-gray-600">Game</th>
                                    <th className="px-4 py-2 text-right text-gray-600">{teamName1}</th>
                                    <th className="px-4 py-2 text-right text-gray-600">{teamName2}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {gameHistory.map((game, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-700">{game.label}</td>
                                        <td className="px-4 py-2 text-right font-semibold text-gray-800">{game.pointsTeam1}</td>
                                        <td className="px-4 py-2 text-right font-semibold text-gray-800">{game.pointsTeam2}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">No games played in this kingdom yet.</p>
                    )}
                </div>

                {kingdomHistory.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Previous Kingdoms Summary</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-gray-600">Kingdom</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Modes</th>
                                    <th className="px-4 py-2 text-right text-gray-600">{teamName1}</th>
                                    <th className="px-4 py-2 text-right text-gray-600">{teamName2}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {kingdomHistory.map((kingdom) => (
                                    <>
                                        <tr
                                            key={kingdom.id}
                                            className="border-t cursor-pointer hover:bg-gray-50"
                                            onClick={() => toggleKingdomDetails(kingdom.id)}
                                        >
                                            <td className="px-4 py-2 font-medium text-gray-700">
                                                #{kingdom.id} {expandedKingdom === kingdom.id ? '▼' : '▶'}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {kingdom.modes.map(m => allGames.find(g => g.id === m)?.label).join(', ')}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-800">{kingdom.pointsTeam1}</td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-800">{kingdom.pointsTeam2}</td>
                                        </tr>
                                        {expandedKingdom === kingdom.id && kingdom.games.length > 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-2 bg-gray-50">
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="w-full">
                                                            <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="px-4 py-2 text-left text-gray-600">Game</th>
                                                                <th className="px-4 py-2 text-right text-gray-600">{teamName1}</th>
                                                                <th className="px-4 py-2 text-right text-gray-600">{teamName2}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {kingdom.games.map((game, index) => (
                                                                <tr key={index} className="border-t hover:bg-gray-50">
                                                                    <td className="px-4 py-2 text-gray-700">{game.label}</td>
                                                                    <td className="px-4 py-2 text-right font-semibold text-gray-800">{game.pointsTeam1}</td>
                                                                    <td className="px-4 py-2 text-right font-semibold text-gray-800">{game.pointsTeam2}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
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