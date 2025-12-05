// resources/js/Components/VirtualPet.tsx

import React, { useEffect, useState } from "react";

import verySad from "../images/very_sad.png";
import sad from "../images/sad.png";
import neutral from "../images/neutral.png";
import happy from "../images/happy.png";
import veryHappy from "../images/very_happy.png";

type PetResponse = {
    points: number;
    mood: "very_sad" | "sad" | "neutral" | "happy" | "very_happy" | string;
    maxPoints: number;
    lastPatUser?: string | null;
};


const moodSprite: Record<string, string> = {
    very_sad: verySad,
    sad: sad,
    neutral: neutral,
    happy: happy,
    very_happy: veryHappy,
};

export const VirtualPet: React.FC = () => {
    const [pet, setPet] = useState<PetResponse | null>(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch("/api/pet", {
                    headers: {
                        Accept: "application/json",
                    },
                });
                const data = (await res.json()) as PetResponse;
                setPet(data);
            } catch (error) {
                console.error("Failed to fetch pet state", error);
            }
        };

        fetchPet();
        const interval = setInterval(fetchPet, 2000); // poll every 2s

        return () => clearInterval(interval);
    }, []);

    if (!pet) {
        return null; // for OBS overlay, you can show nothing while loading
    }

    const spriteSrc = moodSprite[pet.mood] ?? moodSprite["neutral"];
    const lastPatUser = pet.lastPatUser ?? "";

    const phrase = lastPatUser
        ? `${lastPatUser} gave the little guy a patpat!`
        : "Waiting for someone to give the little guy a patpat…";

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                background: "transparent", // so OBS can layer it
                pointerEvents: "none", // so clicks pass through if needed
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                }}
            >
                {/* The little guy */}
                <img
                    src={spriteSrc}
                    alt="Virtual pet"
                    style={{
                        width: "200px",
                        height: "200px",
                        imageRendering: "pixelated", // if it's pixel art
                    }}
                />

                {/* Phrase text */}
                <div
                    style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "1.1rem",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "999px",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        whiteSpace: "nowrap",
                    }}
                >
                    {phrase}
                </div>
            </div>
        </div>
    );
};
