import React from "react";
import { Head, Link } from "@inertiajs/react";
import "../../css/common.css";
import "../../css/sanitize.css";
import { route } from "ziggy-js";
import { Ziggy } from "@/ziggy";

export default function GuestLayout({ children, title, extraHead = null }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{title ?? "COACHTECH"}</title>
                {extraHead}
            </Head>

            <header className="header">
                <div className="header-wrapper">
                    <h1 className="sr-only">COACHTECH</h1>
                    <Link
                        className="header-logo"
                        href={route("index", {}, false, Ziggy)}
                    >
                        <img
                            className="header-logo-img"
                            src="/storage/assets/logo.svg"
                            alt="ロゴ"
                        />
                    </Link>
                </div>
            </header>

            <main className="content">{children}</main>
        </div>
    );
}
