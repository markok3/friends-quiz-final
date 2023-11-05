import { Attempt } from "@/app/components/types/types";
import React from "react";
import { BounceLoader } from "react-spinners";
interface LeaderboardProps {
  attempts: Attempt[];
  loading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ attempts, loading }) => {
  const sortedResults = attempts.sort((a, b) => b.score - a.score);

  if (loading || attempts === undefined)
    return (
      <div className="w-full flex items-center justify-center">
        <BounceLoader color="#36d7b7" className="w-full" />
      </div>
    );

  return (
    <div className="w-full text-white">
      <h2 className="text-center text-2xl font-bold mb-4 text-white">
        Leaderboard
      </h2>
      <div className="max-h-[200px] overflow-auto rounded-lg text-center">
        <table className="w-full   ">
          <thead className="bg-[#202026]">
            <tr>
              <th className="  p-2">Rank</th>
              <th className="  p-2">User Name</th>
              <th className="  p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((attempt, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-[#1a1a1f]" : "bg-[#202026]"}
              >
                <td className=" p-2">{index + 1}</td>
                <td className=" p-2">{attempt.userName}</td>
                <td className=" p-2">{attempt.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  // Component implementation
};

export default Leaderboard;
