import React from "react";
import {VirtualPet} from "@/Components/VirtualPet";
import {router} from "@inertiajs/react";


export default function VirtualPetPage({ twitchChannelName }: {twitchChannelName?: string |null}) {

    const isConnected = !!twitchChannelName;

    return (
        <div style={{ minHeight: "100vh", padding: "1.25rem" }}>
            <div style={{ marginBottom: "1rem" }}>
                {!isConnected ? (
                    <a
                        href="/auth/twitch/redirect"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.75rem 1.25rem",
                            backgroundColor: "#9146FF",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: "0.5rem",
                            textDecoration: "none",
                            boxShadow: "0 4px 12px rgba(145, 70, 255, 0.35)",
                            transition: "background-color 0.2s ease, transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#772CE8";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#9146FF";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        🎮 Connect with Twitch
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => router.post("/twitch/disconnect")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.75rem 1.25rem",
                            backgroundColor: "#2b2b2b",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(255,255,255,0.12)",
                            cursor: "pointer",
                        }}
                    >
                            🔌 Disconnect PatPat bot ({twitchChannelName})
                        </button>
                )}
            </div>

            <VirtualPet />
        </div>
    );
}
