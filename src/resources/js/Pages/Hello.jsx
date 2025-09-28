import React, { useEffect } from "react";

export default function Hello() {
    // 開発環境でのみ自動リロード
    useEffect(() => {
        if (import.meta.env.DEV) {
            const handleHMR = () => {
                console.log("HMR detected, reloading...");
                setTimeout(() => window.location.reload(), 100);
            };

            if (import.meta.hot) {
                import.meta.hot.accept(handleHMR);
            }
        }
    }, []);

    const currentTime = new Date().toLocaleTimeString();

    return (
        <div>
            <h1>Hello from Inertia + React!</h1>
            <p>Time: {currentTime}</p>
            <p>Random: {Math.random()}</p>
        </div>
    );
}
