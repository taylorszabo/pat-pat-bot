// resources/js/Components/VirtualPet.tsx

import React, { useEffect, useState } from "react";

import verySad from "../images/very_sad.png";
import sad from "../images/sad.png";
import neutral from "../images/neutral.png";
import happy from "../images/happy.png";
import veryHappy from "../images/very_happy.png";
import pat from "../images/pat.png";

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

const patSprite = pat;

declare global {
    interface Window {
        Echo: any;
    }
}

export const VirtualPet: React.FC = () => {
    const [pet, setPet] = useState<PetResponse | null>(null);
    const [isPatting, setIsPatting] = useState(false);
    const [isDecaying, setIsDecaying] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState<string | null>(null);


    useEffect(() => {
        fetch("/api/pet")
            .then((res) => res.json())
            .then((data) => setPet(data))
            .catch(console.error);

        const channel = window.Echo.channel("pet-state");
        channel.listen(".PetUpdated", (data: PetResponse) => {
            // previous points to detect decay
            const previousPoints = pet?.points ?? null;
            const wasPat = !!data.lastPatUser;
            const isDecayEvent =
                !wasPat &&
                previousPoints !== null &&
                data.points < previousPoints;

            if (wasPat) {
                // 🟡 PAT EVENT
                setIsPatting(true);
                setIsDecaying(false);

                setOverlayMessage(
                    `${data.lastPatUser} gave the little guy a patpat!`
                );

                setTimeout(() => {
                    setIsPatting(false);
                }, 1000);

                setTimeout(() => {
                    setOverlayMessage(null);
                }, 2500);
            } else if (isDecayEvent) {
                // 🔵 DECAY EVENT
                setIsDecaying(true);
                setIsPatting(false);

                setOverlayMessage("The little guy wasn't patted quick enough…");

                // show sad state briefly
                setTimeout(() => {
                    setIsDecaying(false);
                }, 1500);

                setTimeout(() => {
                    setOverlayMessage(null);
                }, 2500);
            }

            setPet(data);
        });

        return () => {
            window.Echo.leave("pet-state");
        };
    }, [pet?.points]);

    if (!pet) {
        return null;
    }

    const spriteSrc = isPatting
        ? patSprite
        : isDecaying
            ? moodSprite["sad"] // force sad image during decay animation
            : moodSprite[pet.mood] ?? moodSprite["neutral"];


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
                        height: "2.2rem",
                        marginTop: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {overlayMessage && (
                        <div
                            style={{
                                fontFamily: "system-ui, sans-serif",
                                fontSize: "1.1rem",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "999px",
                                background: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                whiteSpace: "nowrap",
                                transition: "opacity 0.3s ease",
                            }}
                        >
                            {overlayMessage}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
