import React from "react";
import {VirtualPet} from "@/Components/VirtualPet";

export default function VirtualPetPage() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
            }}
        >
            <VirtualPet />
        </div>
    );
}
