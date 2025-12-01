import React, { useEffect, useState } from "react";

type PetResponse = {
    points: number;
    mood: "very_sad" | "sad" | "neutral" | "happy" | "very_happy" | string;
    maxPoints: number;
};

const moodEmoji: Record<string, string> = {
    very_sad: "😭",
    sad: "😢",
    neutral: "😐",
    happy: "😊",
    very_happy: "🥰",
};

export const VirtualPet: React.FC = () => {
    const [pet, setPet] = useState<PetResponse | null>(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch("/api/pet", {
                    headers: { Accept: "application/json" },
                });
                const data = (await res.json()) as PetResponse;
                setPet(data);

            } catch (error) {
                console.error("Failed to fetch pet state", error);
            }
        };

        // initial load
        fetchPet();

        // poll every 2 seconds
        const interval = setInterval(fetchPet, 2000);

        return () => clearInterval(interval);
    }, []);

    if (!pet) {
        return <div>Loading pet…</div>;
    }

    const emoji = moodEmoji[pet.mood] ?? "❓";
    const progress = (pet.points / pet.maxPoints) * 100;

    return (
        <div
            style={{
                padding: "1rem",
                borderRadius: "1rem",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                minWidth: "250px",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <div style={{ fontSize: "3rem", textAlign: "center" }}>{emoji}</div>

            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                Mood: <strong>{pet.mood.replace("_", " ")}</strong>
            </div>

            <div style={{ fontSize: "0.9rem", textAlign: "center", marginBottom: "0.5rem" }}>
                Happiness: {pet.points} / {pet.maxPoints}
            </div>

            <div
                style={{
                    height: "10px",
                    width: "100%",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "999px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "lime",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
        </div>
    );
};
