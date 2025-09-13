'use client'
import { useState } from "react";

interface ScoringInputsProps {
    gameMode: string;
    onScoreUpdate: (pointsTeam1: number, pointsTeam2: number, mode: string) => void;
    onModeComplete: () => void;
    teamName1: string; // Added to receive team names
    teamName2: string;
}

export default function ScoringInputs({ gameMode, onScoreUpdate, onModeComplete, teamName1, teamName2 }: ScoringInputsProps) {
    const [kingCollectedBy, setKingCollectedBy] = useState<1 | 2>(1);
    const [queensTeam1, setQueensTeam1] = useState<string>("");
    const [diamondsTeam1, setDiamondsTeam1] = useState<string>("");
    const [tricksLtooshTeam1, setTricksLtooshTeam1] = useState<string>("");
    const [trixPosTeam1Player1, setTrixPosTeam1Player1] = useState<string>("");
    const [trixPosTeam1Player2, setTrixPosTeam1Player2] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingPoints, setPendingPoints] = useState<{ team1: number; team2: number } | null>(null);

    const trixBonuses = [0, 200, 150, 100, 50]; // Index: position 1=200, 2=150, 3=100, 4=50

    const calculatePoints = () => {
        let pointsTeam1 = 0;
        let pointsTeam2 = 0;

        switch (gameMode) {
            case "king":
                if (kingCollectedBy === 1) {
                    pointsTeam1 -= 75;
                } else {
                    pointsTeam2 -= 75;
                }
                return { team1: pointsTeam1, team2: pointsTeam2 };
            case "queen":
                const queens1 = Number(queensTeam1) || 0;
                const queens2 = 4 - queens1; // Total 4 queens
                pointsTeam1 -= queens1 * 25;
                pointsTeam2 -= queens2 * 25;
                return { team1: pointsTeam1, team2: pointsTeam2 };
            case "diamonds":
                const diamonds1 = Number(diamondsTeam1) || 0;
                const diamonds2 = 13 - diamonds1; // Total 13 diamonds
                pointsTeam1 -= diamonds1 * 10;
                pointsTeam2 -= diamonds2 * 10;
                return { team1: pointsTeam1, team2: pointsTeam2 };
            case "ltoosh":
                const tricks1 = Number(tricksLtooshTeam1) || 0;
                const tricks2 = 13 - tricks1; // Total 13 tricks
                pointsTeam1 -= tricks1 * 15;
                pointsTeam2 -= tricks2 * 15;
                return { team1: pointsTeam1, team2: pointsTeam2 };
            case "trix":
                const pos1 = Number(trixPosTeam1Player1) || 0;
                const pos2 = Number(trixPosTeam1Player2) || 0;
                if (pos1 === pos2 || pos1 < 1 || pos1 > 4 || pos2 < 1 || pos2 > 4) {
                    return { team1: 0, team2: 0 };
                }
                const team1Bonus = (pos1 > 0 ? trixBonuses[pos1] : 0) + (pos2 > 0 ? trixBonuses[pos2] : 0);
                const allPositions = [1, 2, 3, 4];
                const team2Positions = allPositions.filter(pos => pos !== pos1 && pos !== pos2);
                const team2Bonus = team2Positions.reduce((sum, pos) => sum + trixBonuses[pos], 0);
                pointsTeam1 += team1Bonus;
                pointsTeam2 += team2Bonus;
                return { team1: pointsTeam1, team2: pointsTeam2 };
            default:
                return { team1: 0, team2: 0 };
        }
    };

    const handleCalculate = () => {
        const points = calculatePoints();
        setPendingPoints(points);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        if (pendingPoints) {
            onScoreUpdate(pendingPoints.team1, pendingPoints.team2, gameMode);
            onModeComplete();
            setShowConfirm(false);
            setPendingPoints(null);
            setKingCollectedBy(1);
            setQueensTeam1("");
            setDiamondsTeam1("");
            setTricksLtooshTeam1("");
            setTrixPosTeam1Player1("");
            setTrixPosTeam1Player2("");
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingPoints(null);
    };

    const getInputs = () => {
        switch (gameMode) {
            case "king":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Which team collected the King?</label>
                            <div className="space-y-1">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="1"
                                        checked={kingCollectedBy === 1}
                                        onChange={() => setKingCollectedBy(1)}
                                        className="rounded"
                                    />
                                    <span>{teamName1} (-75)</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="2"
                                        checked={kingCollectedBy === 2}
                                        onChange={() => setKingCollectedBy(2)}
                                        className="rounded"
                                    />
                                    <span>{teamName2} (-75)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case "queen":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{teamName1} Queens Collected:</label>
                            <select
                                value={queensTeam1}
                                onChange={(e) => setQueensTeam1(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select number</option>
                                {[0, 1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num} ({num * -25})</option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-600 mt-1">
                                {teamName2} will get {queensTeam1 ? 4 - Number(queensTeam1) : "remaining"} queens ({(queensTeam1 ? (4 - Number(queensTeam1)) * -25 : 0)} points)
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">Each Queen: -25 points (Total 4 Queens)</p>
                    </div>
                );
            case "diamonds":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{teamName1} Diamond Cards:</label>
                            <select
                                value={diamondsTeam1}
                                onChange={(e) => setDiamondsTeam1(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select number</option>
                                {Array.from({ length: 14 }, (_, i) => i).map(num => (
                                    <option key={num} value={num}>{num} ({num * -10})</option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-600 mt-1">
                                {teamName2} will get {diamondsTeam1 ? 13 - Number(diamondsTeam1) : "remaining"} diamonds ({(diamondsTeam1 ? (13 - Number(diamondsTeam1)) * -10 : 0)} points)
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">Each Diamond: -10 points (Total 13 Diamonds)</p>
                    </div>
                );
            case "ltoosh":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{teamName1} Tricks Collected:</label>
                            <select
                                value={tricksLtooshTeam1}
                                onChange={(e) => setTricksLtooshTeam1(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select number</option>
                                {Array.from({ length: 14 }, (_, i) => i).map(num => (
                                    <option key={num} value={num}>{num} ({num * -15})</option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-600 mt-1">
                                {teamName2} will get {tricksLtooshTeam1 ? 13 - Number(tricksLtooshTeam1) : "remaining"} tricks ({(tricksLtooshTeam1 ? (13 - Number(tricksLtooshTeam1)) * -15 : 0)} points)
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">Each Trick: -15 points (Total 13 Tricks)</p>
                    </div>
                );
            case "trix":
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{teamName1} Player 1 Finish Position (1=first, 4=last):</label>
                            <select
                                value={trixPosTeam1Player1}
                                onChange={(e) => setTrixPosTeam1Player1(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select position</option>
                                {[1, 2, 3, 4].map(pos => (
                                    <option key={pos} value={pos} disabled={trixPosTeam1Player2 === String(pos)}>
                                        {pos} ({trixBonuses[pos]})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{teamName1} Player 2 Finish Position (1=first, 4=last):</label>
                            <select
                                value={trixPosTeam1Player2}
                                onChange={(e) => setTrixPosTeam1Player2(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select position</option>
                                {[1, 2, 3, 4].map(pos => (
                                    <option key={pos} value={pos} disabled={trixPosTeam1Player1 === String(pos)}>
                                        {pos} ({trixBonuses[pos]})
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-600 mt-1">
                                {teamName2} will get positions {trixPosTeam1Player1 && trixPosTeam1Player2
                                ? [1, 2, 3, 4].filter(pos => pos !== Number(trixPosTeam1Player1) && pos !== Number(trixPosTeam1Player2)).join(' and ')
                                : "remaining"} ({trixPosTeam1Player1 && trixPosTeam1Player2
                                ? [1, 2, 3, 4].filter(pos => pos !== Number(trixPosTeam1Player1) && pos !== Number(trixPosTeam1Player2))
                                    .reduce((sum, pos) => sum + trixBonuses[pos], 0)
                                : 0} points)
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">
                            Bonuses per position (per player): 1st +200, 2nd +150, 3rd +100, 4th +50
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scoring for {gameMode.toUpperCase()} Game</h3>
            {showConfirm && pendingPoints ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm font-medium">Confirm Scores:</p>
                    <p>{teamName1}: {pendingPoints.team1} points</p>
                    <p>{teamName2}: {pendingPoints.team2} points</p>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {getInputs()}
                    <button
                        onClick={handleCalculate}
                        disabled={gameMode !== "king" && !showConfirm && !(queensTeam1 || diamondsTeam1 || tricksLtooshTeam1 || (trixPosTeam1Player1 && trixPosTeam1Player2))}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 w-full"
                    >
                        Calculate Scores
                    </button>
                </>
            )}
        </div>
    );
}