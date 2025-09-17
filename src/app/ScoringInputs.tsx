'use client'
import { useState } from "react";

interface ScoringInputsProps {
    gameMode: string;
    onScoreUpdate: (pointsTeam1: number, pointsTeam2: number, mode: string) => void;
    onModeComplete: () => void;
    teamName1: string;
    teamName2: string;
}

export default function ScoringInputs({ gameMode, onScoreUpdate, onModeComplete, teamName1, teamName2 }: ScoringInputsProps) {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleNumericSelection = (value: number | string, mode: string, team?: 1 | 2) => {
        setSelectedValue(String(value));
        let pointsTeam1 = 0;
        let pointsTeam2 = 0;

        switch (mode) {
            case "king":
                pointsTeam1 = team === 1 ? -75 : 0;
                pointsTeam2 = team === 2 ? -75 : 0;
                setSelectedValue(team === 1 ? teamName1 : teamName2);
                break;
            case "queen":
                pointsTeam1 = Number(value) * -25;
                pointsTeam2 = (4 - Number(value)) * -25;
                break;
            case "diamonds":
                pointsTeam1 = Number(value) * -10;
                pointsTeam2 = (13 - Number(value)) * -10;
                break;
            case "ltoosh":
                pointsTeam1 = Number(value) * -15;
                pointsTeam2 = (13 - Number(value)) * -15;
                break;
            case "trix":
                const trixPoints = {
                    "1,2": { team1: 350, team2: 150 },
                    "1,3": { team1: 300, team2: 200 },
                    "2,3": { team1: 250, team2: 250 },
                    "3,4": { team1: 150, team2: 350 },
                };
                pointsTeam1 = trixPoints[value as keyof typeof trixPoints].team1;
                pointsTeam2 = trixPoints[value as keyof typeof trixPoints].team2;
                break;
        }

        onScoreUpdate(pointsTeam1, pointsTeam2, mode);
        onModeComplete();
    };

    const getInputs = () => {
        switch (gameMode) {
            case "king":
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">Which team collected the King?</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleNumericSelection(teamName1, gameMode, 1)}
                                    disabled={!!selectedValue}
                                    className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                        selectedValue === teamName1 ? 'bg-blue-700 text-white border-blue-600' : ''
                                    }`}
                                >
                                    {teamName1} (-75)
                                </button>
                                <button
                                    onClick={() => handleNumericSelection(teamName2, gameMode, 2)}
                                    disabled={!!selectedValue}
                                    className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                        selectedValue === teamName2 ? 'bg-blue-700 text-white border-blue-600' : ''
                                    }`}
                                >
                                    {teamName2} (-75)
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "queen":
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">{teamName1} Queens Collected:</label>
                            <div className="grid grid-cols-5 gap-4">
                                {[0, 1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumericSelection(num, gameMode)}
                                        disabled={!!selectedValue}
                                        className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                            selectedValue === String(num) ? 'bg-blue-700 text-white border-blue-600' : ''
                                        }`}
                                    >
                                        {num} ({num * -25})
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                );
            case "diamonds":
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">{teamName1} Diamond Cards collected:</label>
                            <div className="grid grid-cols-4 gap-4">
                                {Array.from({ length: 14 }, (_, i) => i).map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumericSelection(num, gameMode)}
                                        disabled={!!selectedValue}
                                        className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                            selectedValue === String(num) ? 'bg-blue-700 text-white border-blue-600' : ''
                                        }`}
                                    >
                                        {num} ({num * -10})
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                );
            case "ltoosh":
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">{teamName1} Tricks Collected:</label>
                            <div className="grid grid-cols-4 gap-4">
                                {Array.from({ length: 14 }, (_, i) => i).map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumericSelection(num, gameMode)}
                                        disabled={!!selectedValue}
                                        className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                            selectedValue === String(num) ? 'bg-blue-700 text-white border-blue-600' : ''
                                        }`}
                                    >
                                        {num} ({num * -15})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "trix":
                const trixOptions = [
                    { positions: "1,2", team1Points: 350, team2Points: 150 },
                    { positions: "1,3", team1Points: 300, team2Points: 200 },
                    { positions: "2,3", team1Points: 250, team2Points: 250 },
                    { positions: "3,4", team1Points: 150, team2Points: 350 },
                ];
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">{teamName1} Finish Positions (1= First, 4= Last):</label>
                            <div className="grid grid-cols-2 gap-4">
                                {trixOptions.map(option => (
                                    <button
                                        key={option.positions}
                                        onClick={() => handleNumericSelection(option.positions, gameMode)}
                                        disabled={!!selectedValue}
                                        className={`min-w-[60px] min-h-[60px] flex justify-center items-center px-8 py-6 rounded-lg border-2 border-gray-200 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm focus:bg-blue-700 focus:text-white focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${
                                            selectedValue === option.positions ? 'bg-blue-700 text-white border-blue-600' : ''
                                        }`}
                                    >
                                        ({option.positions}) ({option.team1Points})
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-700">Scoring for {gameMode.toUpperCase()} Game</h3>
            {getInputs()}
        </div>
    );
}