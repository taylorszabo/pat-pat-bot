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

declare global {
    interface Window {
        Echo: any;
    }
}

export const VirtualPet: React.FC = () => {
    const [pet, setPet] = useState<PetResponse | null>(null);

    useEffect(() => {
        fetch("/api/pet")
            .then((res) => res.json())
            .then((data) => setPet(data))
            .catch(console.error);

        const channel = window.Echo.channel("pet-state");
        channel.listen(".PetUpdated", (data: PetResponse) => {
            setPet(data);
        });

        return () => {
            window.Echo.leave("pet-state");
        };
    }, []);

    if (!pet) {
        // render nothing until the first event arrives
        return null;
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
                background: "transparent",
                pointerEvents: "none",
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
                <img
                    src={spriteSrc}
                    alt="Virtual pet"
                    style={{
                        width: "200px",
                        height: "200px",
                        imageRendering: "pixelated",
                    }}
                />
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
